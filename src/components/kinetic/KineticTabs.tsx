import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';
import { Character, Trick, Achievement, PublicProfile, SPORT_NAMES, SPORT_ICONS, CATEGORY_NAMES, DIFFICULTY_NAMES, DIFFICULTY_COLORS, SportType } from '@/types/kinetic';
import * as api from '@/services/kineticApi';

interface KineticTabsProps {
  character: Character;
  characters: Character[];
  tricks: Trick[];
  getTricksByCategory: (category: string) => Trick[];
  isTrickMastered: (trickId: number) => boolean;
  getTrickProgress: () => number;
}

const KineticTabs = ({ character, characters, tricks, getTricksByCategory, isTrickMastered, getTrickProgress }: KineticTabsProps) => {
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [profileChar, setProfileChar] = useState<PublicProfile | null>(null);
  const [showProfile, setShowProfile] = useState(false);

  useEffect(() => {
    if (character?.id) {
      api.getAchievements(character.id).then(setAchievements);
    }
  }, [character?.id, character?.level, character?.experience]);

  const earnedCount = achievements.filter(a => a.is_earned).length;
  const totalCount = achievements.length;
  const sportTypes = character.sport_types?.length > 0 ? character.sport_types : [character.sport_type];

  const openProfile = async (charId: number) => {
    const p = await api.getPublicProfile(charId);
    setProfileChar(p);
    setShowProfile(true);
  };

  const formatDate = (d: string) => new Date(d).toLocaleDateString('ru-RU');

  return (
    <>
      <Tabs defaultValue="tricks" className="space-y-4">
        <TabsList className="bg-white/90">
          <TabsTrigger value="tricks">📖 Паспорт трюков</TabsTrigger>
          <TabsTrigger value="progress">📊 Прогресс</TabsTrigger>
          <TabsTrigger value="achievements">🎯 Достижения ({earnedCount}/{totalCount})</TabsTrigger>
          <TabsTrigger value="leaderboard">🏆 Лидеры</TabsTrigger>
        </TabsList>

        <TabsContent value="tricks">
          <Card className="bg-white/95 backdrop-blur-md">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Паспорт трюков</span>
                <Badge variant="outline" className="text-lg">{tricks.filter(t => isTrickMastered(t.id)).length} / {tricks.length}</Badge>
              </CardTitle>
              {sportTypes.length > 1 && (
                <div className="flex gap-2 mt-2">
                  {sportTypes.map(s => <Badge key={s} variant="outline" className="gap-1">{SPORT_ICONS[s as SportType]} {SPORT_NAMES[s as SportType]}</Badge>)}
                </div>
              )}
              <div className="w-full bg-gray-200 rounded-full h-3 mt-2">
                <div className="bg-gradient-to-r from-green-500 to-teal-500 h-3 rounded-full transition-all" style={{ width: `${getTrickProgress()}%` }} />
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {(['balance', 'spins', 'jumps', 'slides', 'flips'] as const).map(category => {
                  const ct = getTricksByCategory(category);
                  if (ct.length === 0) return null;
                  return (
                    <div key={category}>
                      <h3 className="text-xl font-bold mb-3 flex items-center gap-2">
                        {category === 'balance' && '⚖️'}{category === 'spins' && '🌀'}{category === 'jumps' && '🦘'}{category === 'slides' && '🛹'}{category === 'flips' && '🔄'}
                        {CATEGORY_NAMES[category]}
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                        {ct.map(trick => {
                          const mastered = isTrickMastered(trick.id);
                          return (
                            <div key={trick.id} className={`p-4 rounded-lg border-2 transition-all ${mastered ? 'border-green-500 bg-green-50' : 'border-gray-300 bg-gray-50'}`}>
                              <div className="flex justify-between items-start mb-2">
                                <div>
                                  <div className="font-semibold">{trick.name}</div>
                                  {sportTypes.length > 1 && <div className="text-xs text-gray-400">{SPORT_ICONS[trick.sport_type]}</div>}
                                </div>
                                {mastered && <Icon name="CheckCircle2" className="w-5 h-5 text-green-600" />}
                              </div>
                              <p className="text-sm text-gray-600 mb-2">{trick.description}</p>
                              <div className="flex items-center justify-between">
                                <Badge className={DIFFICULTY_COLORS[trick.difficulty]}>{DIFFICULTY_NAMES[trick.difficulty]}</Badge>
                                <div className="text-sm">
                                  <span className="text-purple-600">+{trick.experience_reward} XP</span>{' | '}
                                  <span className="text-yellow-600">+{trick.kinetics_reward}</span>
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="progress">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="bg-white/95">
              <CardHeader><CardTitle>Статистика</CardTitle></CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    { label: 'Освоено трюков', val: `${tricks.filter(t => isTrickMastered(t.id)).length} / ${tricks.length}`, color: 'text-green-600', bg: 'from-green-50 to-teal-50' },
                    { label: 'Общий опыт', val: `${character.experience} XP`, color: 'text-purple-600', bg: 'from-purple-50 to-blue-50' },
                    { label: 'Кинетики', val: `${character.kinetics}`, color: 'text-yellow-600', bg: 'from-yellow-50 to-orange-50' },
                    { label: 'Игр / побед', val: `${character.games_played || 0} / ${character.games_won || 0}`, color: 'text-blue-600', bg: 'from-blue-50 to-indigo-50' },
                    { label: 'Достижений', val: `${earnedCount} / ${totalCount}`, color: 'text-pink-600', bg: 'from-pink-50 to-rose-50' },
                  ].map(s => (
                    <div key={s.label} className={`p-4 bg-gradient-to-r ${s.bg} rounded-lg`}>
                      <div className="text-sm text-gray-600 mb-1">{s.label}</div>
                      <div className={`text-3xl font-bold ${s.color}`}>{s.val}</div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
            <Card className="bg-white/95">
              <CardHeader><CardTitle>Информация</CardTitle></CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {[
                    { icon: '⚖️', name: 'Баланс', val: character.balance, color: 'bg-green-500' },
                    { icon: '⚡', name: 'Скорость', val: character.speed, color: 'bg-blue-500' },
                    { icon: '🔥', name: 'Смелость', val: character.courage, color: 'bg-red-500' },
                  ].map(s => (
                    <div key={s.name} className="flex justify-between items-center p-3 bg-gray-50 rounded">
                      <span className="font-semibold">{s.icon} {s.name}</span>
                      <div className="flex items-center gap-2">
                        <div className="w-28 bg-gray-200 rounded-full h-3"><div className={`${s.color} h-3 rounded-full`} style={{ width: `${s.val}%` }} /></div>
                        <span className="font-bold text-lg w-8 text-right">{s.val}</span>
                      </div>
                    </div>
                  ))}
                </div>
                {character.trainer_name && (
                  <div className="mt-6 p-3 bg-purple-50 rounded-lg">
                    <div className="text-sm text-gray-600">Тренер</div>
                    <div className="font-bold text-lg">{character.trainer_name}</div>
                  </div>
                )}
                {character.age && (
                  <div className="mt-3 p-3 bg-blue-50 rounded-lg">
                    <div className="text-sm text-gray-600">Возраст</div>
                    <div className="font-bold text-lg">{character.age} лет</div>
                  </div>
                )}
                {sportTypes.length > 1 && (
                  <div className="mt-3 p-3 bg-green-50 rounded-lg">
                    <div className="text-sm text-gray-600 mb-1">Виды спорта</div>
                    <div className="flex gap-2 flex-wrap">
                      {sportTypes.map(s => <Badge key={s} variant="outline">{SPORT_ICONS[s as SportType]} {SPORT_NAMES[s as SportType]}</Badge>)}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="achievements">
          <Card className="bg-white/95">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Достижения</span>
                <Badge variant="outline" className="text-lg">{earnedCount} / {totalCount}</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {achievements.map(ach => (
                  <div key={ach.id} className={`p-4 border-2 rounded-lg transition-all ${ach.is_earned ? 'border-yellow-400 bg-yellow-50' : 'border-gray-300 bg-gray-50 opacity-70'}`}>
                    <div className="flex items-center gap-3">
                      <div className="text-3xl">{ach.icon || '🏅'}</div>
                      <div className="flex-1">
                        <div className="font-bold">{ach.name}</div>
                        <div className="text-sm text-gray-600">{ach.description}</div>
                        {!ach.is_earned && ach.progress !== undefined && (
                          <div className="mt-2">
                            <div className="w-full bg-gray-200 rounded-full h-2">
                              <div className="bg-gradient-to-r from-purple-500 to-blue-500 h-2 rounded-full" style={{ width: `${(ach.progress / ach.requirement_value) * 100}%` }} />
                            </div>
                            <div className="text-xs text-gray-500 mt-1">{ach.progress} / {ach.requirement_value}</div>
                          </div>
                        )}
                        {ach.reward_kinetics > 0 && <div className="text-xs text-yellow-600 mt-1">+{ach.reward_kinetics} кинетиков</div>}
                      </div>
                      {ach.is_earned ? <Icon name="CheckCircle2" className="w-6 h-6 text-green-600" /> : <Icon name="Lock" className="w-6 h-6 text-gray-400" />}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="leaderboard">
          <Card className="bg-white/95">
            <CardHeader><CardTitle>Таблица лидеров</CardTitle></CardHeader>
            <CardContent>
              <div className="space-y-3">
                {characters
                  .sort((a, b) => b.level - a.level || b.experience - a.experience)
                  .slice(0, 20)
                  .map((c, idx) => (
                    <div key={c.id}
                      className={`flex items-center gap-4 p-3 rounded-lg cursor-pointer hover:bg-gray-100 transition-all ${c.id === character.id ? 'bg-purple-50 border-2 border-purple-300' : 'bg-gray-50'}`}
                      onClick={() => openProfile(c.id)}>
                      <div className="text-2xl font-bold text-gray-400 w-8 text-center">{idx === 0 ? '🥇' : idx === 1 ? '🥈' : idx === 2 ? '🥉' : `#${idx + 1}`}</div>
                      <div className="text-2xl">{SPORT_ICONS[c.sport_type]}</div>
                      <div className="flex-1">
                        <div className="font-semibold">{c.name}</div>
                        <div className="text-sm text-gray-600">{SPORT_NAMES[c.sport_type]}</div>
                      </div>
                      <div className="text-right">
                        <Badge>Уровень {c.level}</Badge>
                        <div className="text-sm text-gray-600 mt-1">{c.experience} XP</div>
                      </div>
                    </div>
                  ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {showProfile && profileChar && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={() => setShowProfile(false)}>
          <Card className="max-w-2xl w-full max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Профиль: {profileChar.character.name}</CardTitle>
              <Button variant="ghost" size="icon" onClick={() => setShowProfile(false)}><Icon name="X" className="w-5 h-5" /></Button>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-4 mb-6">
                {profileChar.character.avatar_url && <img src={profileChar.character.avatar_url} alt="" className="w-20 h-20 rounded-xl object-cover border-2 border-purple-400" />}
                <div>
                  <div className="text-2xl font-bold">{profileChar.character.name}</div>
                  <div className="text-gray-600">{SPORT_NAMES[profileChar.character.sport_type]} | Уровень {profileChar.character.level}</div>
                  {profileChar.character.trainer_name && <div className="text-sm text-purple-600">Тренер: {profileChar.character.trainer_name}</div>}
                  {profileChar.character.age && <div className="text-sm text-gray-500">Возраст: {profileChar.character.age} лет</div>}
                </div>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
                {[
                  { val: profileChar.character.level, label: 'Уровень', bg: 'bg-purple-50' },
                  { val: profileChar.stats.tricks_learned, label: 'Трюков', bg: 'bg-green-50' },
                  { val: profileChar.stats.training_visits, label: 'Тренировок', bg: 'bg-blue-50' },
                  { val: profileChar.stats.achievements_earned, label: 'Достижений', bg: 'bg-yellow-50' },
                ].map(s => (
                  <div key={s.label} className={`${s.bg} p-3 rounded-lg text-center`}>
                    <div className="text-2xl font-bold">{s.val}</div>
                    <div className="text-xs text-gray-600">{s.label}</div>
                  </div>
                ))}
              </div>
              {profileChar.stats.tournament_history.length > 0 && (
                <div>
                  <h4 className="font-semibold mb-2">История турниров</h4>
                  {profileChar.stats.tournament_history.map((t, i) => (
                    <div key={i} className="flex justify-between items-center p-2 bg-gray-50 rounded text-sm mb-1">
                      <span>{formatDate(t.week_start)} — {formatDate(t.week_end)}</span>
                      <span className="font-semibold">#{t.rank || '-'} | {t.score} очков</span>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      )}
    </>
  );
};

export default KineticTabs;
