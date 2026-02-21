import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';
import {
  Character, Tournament, TournamentEntry, LeaderboardEntry, PublicProfile,
  SPORT_NAMES, SPORT_ICONS, SportType
} from '@/types/kinetic';
import * as api from '@/services/kineticApi';
import { useToast } from '@/hooks/use-toast';

interface TournamentsModalProps {
  show: boolean;
  onClose: () => void;
  character?: Character | null;
  onCharacterUpdate?: (char: Character) => void;
}

const TournamentsModal = ({ show, onClose, character, onCharacterUpdate }: TournamentsModalProps) => {
  const { toast } = useToast();
  const [tournament, setTournament] = useState<Tournament | null>(null);
  const [entries, setEntries] = useState<TournamentEntry[]>([]);
  const [leaderTab, setLeaderTab] = useState<'weekly' | 'monthly'>('weekly');
  const [leaders, setLeaders] = useState<LeaderboardEntry[]>([]);
  const [profileChar, setProfileChar] = useState<PublicProfile | null>(null);
  const [showProfile, setShowProfile] = useState(false);

  useEffect(() => {
    if (show) {
      api.getCurrentTournament().then(d => {
        setTournament(d.tournament);
        setEntries(d.entries);
      });
      api.getLeaderboard(leaderTab).then(setLeaders);
    }
  }, [show, leaderTab]);

  const formatDate = (d: string) => new Date(d).toLocaleDateString('ru-RU');

  const myEntry = entries.find(e => e.character_id === character?.id);

  const handleJoinTournament = async () => {
    if (!character || !tournament) return;
    if (character.kinetics < tournament.entry_fee) {
      toast({ title: 'Недостаточно кинетиков', description: `Нужно ${tournament.entry_fee}`, variant: 'destructive' });
      return;
    }
    try {
      const result = await api.joinTournament(character.id);
      onCharacterUpdate?.(result.character);
      const d = await api.getCurrentTournament();
      setEntries(d.entries);
      toast({ title: 'Вы в турнире!', description: `Вступительный взнос: ${tournament.entry_fee} кинетиков` });
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : '';
      if (msg.includes('already_joined')) {
        toast({ title: 'Вы уже участвуете!' });
      } else {
        toast({ title: 'Ошибка', variant: 'destructive' });
      }
    }
  };

  const openProfile = async (charId: number) => {
    try {
      const p = await api.getPublicProfile(charId);
      setProfileChar(p);
      setShowProfile(true);
    } catch {
      toast({ title: 'Ошибка загрузки профиля', variant: 'destructive' });
    }
  };

  if (!show) return null;

  return (
    <>
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={onClose}>
        <Card className="max-w-3xl w-full max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-2xl">Турниры и лидерборды</CardTitle>
            <Button variant="ghost" size="icon" onClick={onClose}><Icon name="X" className="w-5 h-5" /></Button>
          </CardHeader>
          <CardContent>
            {tournament && (
              <div className="p-4 bg-gradient-to-br from-yellow-50 to-orange-50 rounded-lg border-2 border-yellow-400 mb-6">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <div className="font-bold text-xl">Еженедельный турнир</div>
                    <p className="text-sm text-gray-600">{formatDate(tournament.week_start)} — {formatDate(tournament.week_end)}</p>
                  </div>
                  <div className="text-4xl">🏆</div>
                </div>
                <div className="text-sm text-gray-600 mb-3">
                  Очки: мини-игры (10/игра), трюки (25/трюк), тренировки (30/визит)
                </div>
                <div className="mb-3">
                  <div className="text-sm font-semibold mb-1">Участников: {entries.length}</div>
                  {myEntry ? (
                    <div className="p-3 bg-white rounded border border-green-300">
                      <div className="font-semibold text-green-700">Вы участвуете!</div>
                      <div className="text-sm">Очки: {myEntry.score} | Место: #{entries.findIndex(e => e.character_id === character?.id) + 1}</div>
                      <div className="text-xs text-gray-500 mt-1">Игры: {myEntry.games_score} | Трюки: {myEntry.tricks_score} | Тренировки: {myEntry.training_score}</div>
                    </div>
                  ) : (
                    <Button onClick={handleJoinTournament} className="w-full bg-gradient-to-r from-orange-600 to-red-600">
                      Вступить за {tournament.entry_fee} кинетиков
                    </Button>
                  )}
                </div>
                {entries.length > 0 && (
                  <div className="space-y-2">
                    <div className="font-semibold text-sm">Рейтинг турнира:</div>
                    {entries.slice(0, 10).map((e, i) => (
                      <div key={e.id} className={`flex items-center gap-3 p-2 rounded cursor-pointer hover:bg-white/80 transition-all ${e.character_id === character?.id ? 'bg-purple-50 border border-purple-300' : ''}`}
                        onClick={() => openProfile(e.character_id)}>
                        <div className="w-6 text-center font-bold">{i === 0 ? '🥇' : i === 1 ? '🥈' : i === 2 ? '🥉' : `#${i + 1}`}</div>
                        <div className="flex-1"><div className="font-semibold text-sm">{e.character_name}</div></div>
                        <div className="font-bold">{e.score}</div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            <div className="flex gap-2 mb-4">
              <Button variant={leaderTab === 'weekly' ? 'default' : 'outline'} onClick={() => setLeaderTab('weekly')} size="sm">Еженедельный</Button>
              <Button variant={leaderTab === 'monthly' ? 'default' : 'outline'} onClick={() => setLeaderTab('monthly')} size="sm">Ежемесячный</Button>
            </div>
            <div className="space-y-2">
              {leaders.length === 0 && <p className="text-center text-gray-500 py-4">Пока нет участников</p>}
              {leaders.map((l, i) => (
                <div key={l.character_id} className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer hover:bg-gray-100 transition-all ${l.character_id === character?.id ? 'bg-purple-50 border border-purple-300' : 'bg-gray-50'}`}
                  onClick={() => openProfile(l.character_id)}>
                  <div className="w-8 text-center font-bold text-lg">{i === 0 ? '🥇' : i === 1 ? '🥈' : i === 2 ? '🥉' : `#${i + 1}`}</div>
                  <div className="text-2xl">{SPORT_ICONS[l.sport_type as SportType] || '🏅'}</div>
                  <div className="flex-1">
                    <div className="font-semibold">{l.character_name}</div>
                    <div className="text-xs text-gray-500">Уровень {l.level}</div>
                  </div>
                  <div className="text-right">
                    <div className="font-bold text-lg">{l.score}</div>
                    <div className="text-xs text-gray-500">очков</div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {showProfile && profileChar && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={() => setShowProfile(false)}>
          <Card className="max-w-2xl w-full max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-2xl">Профиль: {profileChar.character.name}</CardTitle>
              <Button variant="ghost" size="icon" onClick={() => setShowProfile(false)}><Icon name="X" className="w-5 h-5" /></Button>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-4 mb-6">
                {profileChar.character.avatar_url && (
                  <img src={profileChar.character.avatar_url} alt="" className="w-20 h-20 rounded-xl object-cover border-2 border-purple-400" />
                )}
                <div>
                  <div className="text-2xl font-bold">{profileChar.character.name}</div>
                  <div className="text-gray-600">{SPORT_NAMES[profileChar.character.sport_type]} | Уровень {profileChar.character.level}</div>
                  {profileChar.character.trainer_name && <div className="text-sm text-purple-600">Тренер: {profileChar.character.trainer_name}</div>}
                  {profileChar.character.age && <div className="text-sm text-gray-500">Возраст: {profileChar.character.age} лет</div>}
                  {profileChar.character.sport_types?.length > 1 && (
                    <div className="flex gap-1 mt-1">
                      {profileChar.character.sport_types.map((s: string) => (
                        <span key={s} className="text-lg">{SPORT_ICONS[s as SportType]}</span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
                <div className="bg-purple-50 p-3 rounded-lg text-center">
                  <div className="text-2xl font-bold">{profileChar.character.level}</div>
                  <div className="text-xs text-gray-600">Уровень</div>
                </div>
                <div className="bg-green-50 p-3 rounded-lg text-center">
                  <div className="text-2xl font-bold">{profileChar.stats.tricks_learned}</div>
                  <div className="text-xs text-gray-600">Трюков</div>
                </div>
                <div className="bg-blue-50 p-3 rounded-lg text-center">
                  <div className="text-2xl font-bold">{profileChar.stats.training_visits}</div>
                  <div className="text-xs text-gray-600">Тренировок</div>
                </div>
                <div className="bg-yellow-50 p-3 rounded-lg text-center">
                  <div className="text-2xl font-bold">{profileChar.stats.achievements_earned}</div>
                  <div className="text-xs text-gray-600">Достижений</div>
                </div>
              </div>
              {profileChar.stats.tournament_history.length > 0 && (
                <div>
                  <h4 className="font-semibold mb-2">История турниров</h4>
                  <div className="space-y-1">
                    {profileChar.stats.tournament_history.map((t, i) => (
                      <div key={i} className="flex justify-between items-center p-2 bg-gray-50 rounded text-sm">
                        <span>{formatDate(t.week_start)} — {formatDate(t.week_end)}</span>
                        <span className="font-semibold">#{t.rank || '-'} | {t.score} очков</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      )}
    </>
  );
};

export default TournamentsModal;
