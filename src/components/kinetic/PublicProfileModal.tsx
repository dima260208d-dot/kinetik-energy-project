import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import Icon from '@/components/ui/icon';
import { PublicProfile, SPORT_NAMES, SPORT_ICONS } from '@/types/kinetic';
import * as api from '@/services/kineticApi';

interface PublicProfileModalProps {
  characterId: number;
  onClose: () => void;
}

const PublicProfileModal = ({ characterId, onClose }: PublicProfileModalProps) => {
  const [profile, setProfile] = useState<PublicProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.getPublicProfile(characterId).then(p => {
      setProfile(p);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, [characterId]);

  if (loading) {
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={onClose}>
        <div className="text-white text-xl">Загрузка...</div>
      </div>
    );
  }

  if (!profile) return null;

  const { character: c, stats } = profile;
  const sports = (c.sport_types && c.sport_types.length > 0) ? c.sport_types : [c.sport_type];

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={onClose}>
      <Card className="max-w-2xl w-full max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-2xl">Профиль</CardTitle>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <Icon name="X" className="w-5 h-5" />
          </Button>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center gap-4">
            {c.avatar_url && (
              <img src={c.avatar_url} alt={c.name} className="w-20 h-20 rounded-xl object-cover border-4 border-purple-400" />
            )}
            <div>
              <h2 className="text-2xl font-bold">{c.name}</h2>
              <div className="flex items-center gap-2 flex-wrap mt-1">
                {sports.map((s: string) => (
                  <Badge key={s} variant="outline" className="text-sm">
                    {SPORT_ICONS[s as keyof typeof SPORT_ICONS] || '🏃'} {SPORT_NAMES[s as keyof typeof SPORT_NAMES] || s}
                  </Badge>
                ))}
              </div>
              <div className="flex items-center gap-3 mt-1 text-sm text-gray-600">
                <span>Уровень {c.level}</span>
                {c.age && <span>{c.age} лет</span>}
                {c.trainer_name && <span>Тренер: {c.trainer_name}</span>}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <div className="p-3 bg-green-50 rounded-lg text-center">
              <div className="text-2xl font-bold text-green-600">{stats.tricks_learned}</div>
              <div className="text-xs text-gray-600">Трюков</div>
            </div>
            <div className="p-3 bg-purple-50 rounded-lg text-center">
              <div className="text-2xl font-bold text-purple-600">{c.experience} XP</div>
              <div className="text-xs text-gray-600">Опыт</div>
            </div>
            <div className="p-3 bg-blue-50 rounded-lg text-center">
              <div className="text-2xl font-bold text-blue-600">{c.games_played || 0}</div>
              <div className="text-xs text-gray-600">Игр</div>
            </div>
            <div className="p-3 bg-orange-50 rounded-lg text-center">
              <div className="text-2xl font-bold text-orange-600">{stats.training_visits}</div>
              <div className="text-xs text-gray-600">Тренировок</div>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div className="flex justify-between items-center p-2 bg-gray-50 rounded">
              <span className="text-sm">⚖️ Баланс</span>
              <span className="font-bold">{c.balance}</span>
            </div>
            <div className="flex justify-between items-center p-2 bg-gray-50 rounded">
              <span className="text-sm">⚡ Скорость</span>
              <span className="font-bold">{c.speed}</span>
            </div>
            <div className="flex justify-between items-center p-2 bg-gray-50 rounded">
              <span className="text-sm">🔥 Смелость</span>
              <span className="font-bold">{c.courage}</span>
            </div>
          </div>

          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-lg font-bold">🏆 Достижений: {stats.achievements_earned}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-lg font-bold">🎮 Побед: {c.games_won || 0}/{c.games_played || 0}</span>
            </div>
          </div>

          {stats.tournament_history.length > 0 && (
            <div>
              <h3 className="font-bold text-lg mb-2">Турнирная история</h3>
              <div className="space-y-2">
                {stats.tournament_history.map((t, i) => (
                  <div key={i} className="flex justify-between items-center p-2 bg-gray-50 rounded text-sm">
                    <span>{new Date(t.week_start).toLocaleDateString('ru-RU')} - {new Date(t.week_end).toLocaleDateString('ru-RU')}</span>
                    <div className="flex items-center gap-3">
                      <span>{t.score} очков</span>
                      <Badge className={t.rank === 1 ? 'bg-yellow-500' : t.rank === 2 ? 'bg-gray-400' : t.rank === 3 ? 'bg-orange-500' : ''}>
                        #{t.rank} место
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default PublicProfileModal;
