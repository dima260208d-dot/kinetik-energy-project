import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Icon from '@/components/ui/icon';
import { Character, Trick, SPORT_NAMES, SPORT_ICONS, CATEGORY_NAMES, DIFFICULTY_NAMES, DIFFICULTY_COLORS } from '@/types/kinetic';

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
  return (
    <Tabs defaultValue="tricks" className="space-y-4">
      <TabsList className="bg-white/90">
        <TabsTrigger value="tricks">📖 Паспорт трюков</TabsTrigger>
        <TabsTrigger value="progress">📊 Прогресс</TabsTrigger>
        <TabsTrigger value="leaderboard">🏆 Лидеры</TabsTrigger>
        <TabsTrigger value="friends">👥 Друзья</TabsTrigger>
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
              <CardTitle>📊 Статистика достижений</CardTitle>
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
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/95">
            <CardHeader>
              <CardTitle>🎯 Достижения</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="p-3 border-2 border-yellow-400 bg-yellow-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="text-3xl">🌟</div>
                    <div>
                      <div className="font-bold">Первый шаг</div>
                      <div className="text-sm text-gray-600">Создай своего персонажа</div>
                    </div>
                    <Icon name="CheckCircle2" className="w-6 h-6 text-green-600 ml-auto" />
                  </div>
                </div>
                <div className="p-3 border-2 border-gray-300 bg-gray-50 rounded-lg opacity-60">
                  <div className="flex items-center gap-3">
                    <div className="text-3xl">🏆</div>
                    <div>
                      <div className="font-bold">Первый трюк</div>
                      <div className="text-sm text-gray-600">Освой свой первый трюк</div>
                    </div>
                    <Icon name="Lock" className="w-6 h-6 text-gray-400 ml-auto" />
                  </div>
                </div>
                <div className="p-3 border-2 border-gray-300 bg-gray-50 rounded-lg opacity-60">
                  <div className="flex items-center gap-3">
                    <div className="text-3xl">⭐</div>
                    <div>
                      <div className="font-bold">Новичок</div>
                      <div className="text-sm text-gray-600">Освой 10 трюков</div>
                    </div>
                    <Icon name="Lock" className="w-6 h-6 text-gray-400 ml-auto" />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </TabsContent>

      <TabsContent value="leaderboard">
        <Card className="bg-white/95">
          <CardHeader>
            <CardTitle>🏆 Таблица лидеров</CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="daily" className="w-full">
              <TabsList className="w-full grid grid-cols-4">
                <TabsTrigger value="daily">📅 День</TabsTrigger>
                <TabsTrigger value="seasonal">📆 Сезон</TabsTrigger>
                <TabsTrigger value="sport">🏆 Спорт</TabsTrigger>
                <TabsTrigger value="age">👶 Возраст</TabsTrigger>
              </TabsList>

              <TabsContent value="daily" className="mt-4">
                <div className="space-y-2">
                  {characters
                    .sort((a, b) => b.level - a.level || b.experience - a.experience)
                    .slice(0, 10)
                    .map((char, idx) => (
                    <div key={char.id} className={`p-4 rounded-lg border-2 ${
                      idx === 0 ? 'border-yellow-400 bg-yellow-50' :
                      idx === 1 ? 'border-gray-400 bg-gray-50' :
                      idx === 2 ? 'border-orange-400 bg-orange-50' :
                      'border-gray-300 bg-white'
                    }`}>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="text-2xl font-bold w-8">{idx === 0 ? '🥇' : idx === 1 ? '🥈' : idx === 2 ? '🥉' : `${idx + 1}.`}</div>
                          <div className="text-3xl">{SPORT_ICONS[char.sport_type]}</div>
                          <div>
                            <div className="font-bold">{char.name}</div>
                            <div className="text-sm text-gray-600">Уровень {char.level}</div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="font-bold text-lg">{char.experience} XP</div>
                          <div className="text-sm text-gray-600">всего</div>
                        </div>
                      </div>
                    </div>
                  ))}
                  {characters.length === 0 && (
                    <div className="text-center py-12 text-gray-500">
                      <div className="text-4xl mb-2">🏆</div>
                      <p>Пока нет участников</p>
                    </div>
                  )}
                </div>
              </TabsContent>

              <TabsContent value="seasonal" className="mt-4">
                <div className="text-center py-12">
                  <div className="text-6xl mb-4">🏆</div>
                  <div className="text-xl font-bold mb-2">Сезонная таблица</div>
                  <p className="text-gray-600">Соревнуйся весь месяц! ТОП-10 получат призы!</p>
                </div>
              </TabsContent>

              <TabsContent value="sport" className="mt-4">
                <div className="text-center py-12">
                  <div className="text-6xl mb-4">{SPORT_ICONS[character.sport_type]}</div>
                  <div className="text-xl font-bold mb-2">Лучшие в {SPORT_NAMES[character.sport_type]}</div>
                  <p className="text-gray-600">Таблица лидеров твоего вида спорта</p>
                </div>
              </TabsContent>

              <TabsContent value="age" className="mt-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {[
                    { age: '6-9 лет', icon: '🧒', color: 'from-green-100 to-teal-100' },
                    { age: '10-13 лет', icon: '🧑‍🎓', color: 'from-blue-100 to-purple-100' },
                    { age: '14-17 лет', icon: '👨‍💼', color: 'from-orange-100 to-red-100' }
                  ].map((group) => (
                    <div key={group.age} className={`p-6 bg-gradient-to-br ${group.color} rounded-lg text-center`}>
                      <div className="text-4xl mb-2">{group.icon}</div>
                      <div className="font-bold">{group.age}</div>
                    </div>
                  ))}
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="friends">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="bg-white/95">
            <CardHeader>
              <CardTitle>👥 Твои друзья</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="p-4 bg-blue-50 rounded-lg border-2 border-blue-300">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-blue-500 rounded-full flex items-center justify-center text-2xl">
                      🛹
                    </div>
                    <div className="flex-1">
                      <div className="font-bold">Макс Скейтер</div>
                      <div className="text-sm text-gray-600">Уровень 8 • Онлайн</div>
                    </div>
                    <Badge className="bg-green-500">🟢</Badge>
                  </div>
                </div>
                <div className="text-center py-8 text-gray-500">
                  <Icon name="UserPlus" className="w-12 h-12 mx-auto mb-2 text-gray-400" />
                  <p>Добавь друзей из клуба!</p>
                  <Button className="mt-4" size="sm">
                    <Icon name="Plus" className="w-4 h-4 mr-2" />
                    Найти друзей
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/95">
            <CardHeader>
              <CardTitle>⚔️ Кланы</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12">
                <div className="text-6xl mb-4">⚔️</div>
                <div className="text-xl font-bold mb-2">Создай свой клан</div>
                <p className="text-gray-600 mb-4">Объединяйся с друзьями!</p>
                <Button size="lg" className="bg-gradient-to-r from-orange-600 to-red-600">
                  <Icon name="Plus" className="w-5 h-5 mr-2" />
                  Создать клан
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </TabsContent>
    </Tabs>
  );
};

export default KineticTabs;
