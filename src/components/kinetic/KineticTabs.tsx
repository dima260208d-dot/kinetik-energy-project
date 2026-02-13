import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Icon from '@/components/ui/icon';
import { Character, Trick, Achievement, SPORT_NAMES, SPORT_ICONS, CATEGORY_NAMES, DIFFICULTY_NAMES, DIFFICULTY_COLORS } from '@/types/kinetic';
import * as api from '@/services/kineticApi';

interface KineticTabsProps {
  character: Character;
  characters: Character[];
  tricks: Trick[];
  getTricksByCategory: (category: string) => Trick[];
  isTrickMastered: (trickId: number) => boolean;
  getTrickProgress: () => number;
}

const KineticTabs = ({
  character,
  characters,
  tricks,
  getTricksByCategory,
  isTrickMastered,
  getTrickProgress
}: KineticTabsProps) => {
  const [achievements, setAchievements] = useState<Achievement[]>([]);

  useEffect(() => {
    if (character?.id) {
      api.getAchievements(character.id).then(setAchievements);
    }
  }, [character?.id, character?.level, character?.experience]);

  const earnedCount = achievements.filter(a => a.is_earned).length;
  const totalCount = achievements.length;

  return (
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
              <span>Паспорт трюков — {SPORT_NAMES[character.sport_type]}</span>
              <Badge variant="outline" className="text-lg">
                {tricks.filter(t => isTrickMastered(t.id)).length} / {tricks.length}
              </Badge>
            </CardTitle>
            <div className="w-full bg-gray-200 rounded-full h-3 mt-2">
              <div
                className="bg-gradient-to-r from-green-500 to-teal-500 h-3 rounded-full transition-all"
                style={{ width: `${getTrickProgress()}%` }}
              />
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {(['balance', 'spins', 'jumps', 'slides', 'flips'] as const).map((category) => {
                const categoryTricks = getTricksByCategory(category);
                if (categoryTricks.length === 0) return null;

                return (
                  <div key={category}>
                    <h3 className="text-xl font-bold mb-3 flex items-center gap-2">
                      {category === 'balance' && '⚖️'}
                      {category === 'spins' && '🌀'}
                      {category === 'jumps' && '🦘'}
                      {category === 'slides' && '🛹'}
                      {category === 'flips' && '🔄'}
                      {CATEGORY_NAMES[category]}
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                      {categoryTricks.map((trick) => {
                        const mastered = isTrickMastered(trick.id);
                        return (
                          <div
                            key={trick.id}
                            className={`p-4 rounded-lg border-2 transition-all ${
                              mastered
                                ? 'border-green-500 bg-green-50'
                                : 'border-gray-300 bg-gray-50'
                            }`}
                          >
                            <div className="flex justify-between items-start mb-2">
                              <div className="font-semibold">{trick.name}</div>
                              {mastered && <Icon name="CheckCircle2" className="w-5 h-5 text-green-600" />}
                            </div>
                            <p className="text-sm text-gray-600 mb-2">{trick.description}</p>
                            <div className="flex items-center justify-between">
                              <Badge className={DIFFICULTY_COLORS[trick.difficulty]}>
                                {DIFFICULTY_NAMES[trick.difficulty]}
                              </Badge>
                              <div className="text-sm">
                                <span className="text-purple-600">+{trick.experience_reward} XP</span>
                                {' | '}
                                <span className="text-yellow-600">+{trick.kinetics_reward} 💰</span>
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
            <CardHeader>
              <CardTitle>📊 Статистика</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="p-4 bg-gradient-to-r from-green-50 to-teal-50 rounded-lg">
                  <div className="text-sm text-gray-600 mb-1">Освоено трюков</div>
                  <div className="text-3xl font-bold text-green-600">
                    {tricks.filter(t => isTrickMastered(t.id)).length} / {tricks.length}
                  </div>
                </div>
                <div className="p-4 bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg">
                  <div className="text-sm text-gray-600 mb-1">Общий опыт</div>
                  <div className="text-3xl font-bold text-purple-600">{character.experience} XP</div>
                </div>
                <div className="p-4 bg-gradient-to-r from-yellow-50 to-orange-50 rounded-lg">
                  <div className="text-sm text-gray-600 mb-1">Накоплено кинетиков</div>
                  <div className="text-3xl font-bold text-yellow-600">💰 {character.kinetics}</div>
                </div>
                <div className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg">
                  <div className="text-sm text-gray-600 mb-1">Игр сыграно / побед</div>
                  <div className="text-3xl font-bold text-blue-600">
                    🎮 {character.games_played || 0} / {character.games_won || 0}
                  </div>
                </div>
                <div className="p-4 bg-gradient-to-r from-pink-50 to-rose-50 rounded-lg">
                  <div className="text-sm text-gray-600 mb-1">Достижений получено</div>
                  <div className="text-3xl font-bold text-pink-600">🏆 {earnedCount} / {totalCount}</div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/95">
            <CardHeader>
              <CardTitle>📈 Характеристики</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex justify-between items-center p-3 bg-gray-50 rounded">
                  <span className="font-semibold">⚖️ Баланс</span>
                  <div className="flex items-center gap-2">
                    <div className="w-28 bg-gray-200 rounded-full h-3">
                      <div className="bg-green-500 h-3 rounded-full transition-all" style={{ width: `${character.balance}%` }} />
                    </div>
                    <span className="font-bold text-lg w-8 text-right">{character.balance}</span>
                  </div>
                </div>
                <div className="flex justify-between items-center p-3 bg-gray-50 rounded">
                  <span className="font-semibold">⚡ Скорость</span>
                  <div className="flex items-center gap-2">
                    <div className="w-28 bg-gray-200 rounded-full h-3">
                      <div className="bg-blue-500 h-3 rounded-full transition-all" style={{ width: `${character.speed}%` }} />
                    </div>
                    <span className="font-bold text-lg w-8 text-right">{character.speed}</span>
                  </div>
                </div>
                <div className="flex justify-between items-center p-3 bg-gray-50 rounded">
                  <span className="font-semibold">🔥 Смелость</span>
                  <div className="flex items-center gap-2">
                    <div className="w-28 bg-gray-200 rounded-full h-3">
                      <div className="bg-red-500 h-3 rounded-full transition-all" style={{ width: `${character.courage}%` }} />
                    </div>
                    <span className="font-bold text-lg w-8 text-right">{character.courage}</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </TabsContent>

      <TabsContent value="achievements">
        <Card className="bg-white/95">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>🎯 Достижения</span>
              <Badge variant="outline" className="text-lg">{earnedCount} / {totalCount}</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {achievements.map((ach) => (
                <div
                  key={ach.id}
                  className={`p-4 border-2 rounded-lg transition-all ${
                    ach.is_earned
                      ? 'border-yellow-400 bg-yellow-50'
                      : 'border-gray-300 bg-gray-50 opacity-70'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="text-3xl">{ach.icon || '🏅'}</div>
                    <div className="flex-1">
                      <div className="font-bold">{ach.name}</div>
                      <div className="text-sm text-gray-600">{ach.description}</div>
                      {!ach.is_earned && ach.progress !== undefined && (
                        <div className="mt-2">
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div
                              className="bg-gradient-to-r from-purple-500 to-blue-500 h-2 rounded-full transition-all"
                              style={{ width: `${(ach.progress / ach.requirement_value) * 100}%` }}
                            />
                          </div>
                          <div className="text-xs text-gray-500 mt-1">{ach.progress} / {ach.requirement_value}</div>
                        </div>
                      )}
                      {ach.reward_kinetics > 0 && (
                        <div className="text-xs text-yellow-600 mt-1">Награда: +{ach.reward_kinetics} 💰</div>
                      )}
                    </div>
                    {ach.is_earned ? (
                      <Icon name="CheckCircle2" className="w-6 h-6 text-green-600" />
                    ) : (
                      <Icon name="Lock" className="w-6 h-6 text-gray-400" />
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="leaderboard">
        <Card className="bg-white/95">
          <CardHeader>
            <CardTitle>🏆 Таблица лидеров</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {characters
                .sort((a, b) => b.level - a.level || b.experience - a.experience)
                .slice(0, 20)
                .map((char, idx) => (
                  <div
                    key={char.id}
                    className={`flex items-center gap-4 p-3 rounded-lg ${
                      char.id === character.id ? 'bg-purple-50 border-2 border-purple-300' : 'bg-gray-50'
                    }`}
                  >
                    <div className="text-2xl font-bold text-gray-400 w-8 text-center">
                      {idx === 0 ? '🥇' : idx === 1 ? '🥈' : idx === 2 ? '🥉' : `#${idx + 1}`}
                    </div>
                    <div className="text-2xl">{SPORT_ICONS[char.sport_type]}</div>
                    <div className="flex-1">
                      <div className="font-semibold">{char.name}</div>
                      <div className="text-sm text-gray-600">{SPORT_NAMES[char.sport_type]}</div>
                    </div>
                    <div className="text-right">
                      <Badge>Уровень {char.level}</Badge>
                      <div className="text-sm text-gray-600 mt-1">{char.experience} XP</div>
                    </div>
                  </div>
                ))}
            </div>
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  );
};

export default KineticTabs;
