import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Icon from '@/components/ui/icon';
import Navigation from '@/components/Navigation';
import CharacterPreview from '@/components/kinetic/CharacterPreview';
import { Character, Trick, CharacterTrick, SPORT_NAMES, SPORT_ICONS, CATEGORY_NAMES, DIFFICULTY_NAMES, DIFFICULTY_COLORS } from '@/types/kinetic';

const KineticUniverse = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [character, setCharacter] = useState<Character | null>(null);
  const [characters, setCharacters] = useState<Character[]>([]);
  const [tricks, setTricks] = useState<Trick[]>([]);
  const [masteredTricks, setMasteredTricks] = useState<CharacterTrick[]>([]);
  const [loading, setLoading] = useState(true);
  const [showShop, setShowShop] = useState(false);
  const [showGames, setShowGames] = useState(false);
  const [showTournaments, setShowTournaments] = useState(false);
  const [showPro, setShowPro] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    const stored = localStorage.getItem('kinetic_universe_data');
    const data = stored ? JSON.parse(stored) : { characters: [], masteredTricks: [] };

    const userCharacter = data.characters?.find((c: Character) => c.user_id === user?.id);
    
    if (!userCharacter) {
      navigate('/character-creation');
      return;
    }

    setCharacter(userCharacter);
    setCharacters(data.characters || []);
    setMasteredTricks(data.masteredTricks?.filter((mt: CharacterTrick) => mt.character_id === userCharacter.id) || []);
    
    // Загружаем трюки для выбранного спорта
    loadTricksForSport(userCharacter.sport_type);
    setLoading(false);
  };

  const loadTricksForSport = (sportType: string) => {
    // Моковые данные трюков (в реальности будут загружаться из БД)
    const mockTricks: Trick[] = [
      // Скейт
      { id: 1, name: 'Ollie', sport_type: 'skate', category: 'jumps', difficulty: 'novice', experience_reward: 50, kinetics_reward: 10, description: 'Базовый прыжок', created_at: '' },
      { id: 2, name: 'Kickflip', sport_type: 'skate', category: 'flips', difficulty: 'amateur', experience_reward: 100, kinetics_reward: 20, description: 'Вращение доски', created_at: '' },
      { id: 3, name: 'Heelflip', sport_type: 'skate', category: 'flips', difficulty: 'amateur', experience_reward: 100, kinetics_reward: 20, description: 'Вращение пяткой', created_at: '' },
      { id: 4, name: 'Pop Shove-It', sport_type: 'skate', category: 'spins', difficulty: 'novice', experience_reward: 60, kinetics_reward: 12, description: 'Вращение доски 180', created_at: '' },
      { id: 5, name: 'Frontside 180', sport_type: 'skate', category: 'spins', difficulty: 'amateur', experience_reward: 80, kinetics_reward: 15, description: 'Разворот лицом', created_at: '' },
      { id: 6, name: 'Backside 180', sport_type: 'skate', category: 'spins', difficulty: 'amateur', experience_reward: 80, kinetics_reward: 15, description: 'Разворот спиной', created_at: '' },
      { id: 7, name: 'Boardslide', sport_type: 'skate', category: 'slides', difficulty: 'pro', experience_reward: 150, kinetics_reward: 30, description: 'Скольжение по грани', created_at: '' },
      { id: 8, name: '50-50 Grind', sport_type: 'skate', category: 'slides', difficulty: 'pro', experience_reward: 150, kinetics_reward: 30, description: 'Грайнд на подвесках', created_at: '' },
      { id: 9, name: 'Manual', sport_type: 'skate', category: 'balance', difficulty: 'novice', experience_reward: 40, kinetics_reward: 8, description: 'Баланс на задних колёсах', created_at: '' },
      { id: 10, name: 'Drop-in', sport_type: 'skate', category: 'jumps', difficulty: 'amateur', experience_reward: 90, kinetics_reward: 18, description: 'Заезд в рампу', created_at: '' },
    ];

    setTricks(mockTricks.filter(t => t.sport_type === sportType));
  };

  const getExperienceForNextLevel = (level: number) => {
    return level * 100;
  };

  const getTricksByCategory = (category: string) => {
    return tricks.filter(t => t.category === category);
  };

  const isTrickMastered = (trickId: number) => {
    return masteredTricks.some(mt => mt.trick_id === trickId);
  };

  const getTrickProgress = () => {
    const total = tricks.length;
    const mastered = tricks.filter(t => isTrickMastered(t.id)).length;
    return total > 0 ? (mastered / total) * 100 : 0;
  };

  if (loading || !character) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center">
        <div className="text-white text-xl">Загрузка...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 p-4">
      <div className="max-w-7xl mx-auto">
        {/* Шапка */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold text-white flex items-center gap-2">
              🌌 Kinetic Universe
            </h1>
            <p className="text-blue-200">Добро пожаловать, {character.name}!</p>
          </div>
          <Navigation currentPage="dashboard" />
        </div>

        {/* Карточка персонажа */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          {/* Визуализация персонажа */}
          <div>
            <CharacterPreview
              sportType={character.sport_type}
              bodyType={character.body_type}
              hairstyle={character.hairstyle}
              hairColor={character.hair_color}
              name={character.name}
              level={character.level}
            />
          </div>

          {/* Информация о персонаже */}
          <Card className="lg:col-span-2 bg-white/95 backdrop-blur-md">
            <CardContent className="pt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Основная информация */}
                <div>
                  <div className="flex items-center gap-3 mb-4">
                    <div className="text-4xl">{SPORT_ICONS[character.sport_type]}</div>
                    <div>
                      <div className="text-2xl font-bold">{character.name}</div>
                      <div className="text-gray-600">{SPORT_NAMES[character.sport_type]}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 mb-4">
                    <Badge className="text-lg px-3 py-1">Уровень {character.level}</Badge>
                    <span className="text-lg font-semibold text-yellow-600">
                      💰 {character.kinetics}
                    </span>
                  </div>
                </div>

                {/* Прогресс и характеристики */}
                <div>
                  <div className="mb-4">
                    <div className="text-sm text-gray-600 mb-2">Опыт до следующего уровня</div>
                    <div className="w-full bg-gray-200 rounded-full h-4 mb-2">
                      <div 
                        className="bg-gradient-to-r from-purple-500 to-blue-500 h-4 rounded-full transition-all"
                        style={{ width: `${(character.experience / getExperienceForNextLevel(character.level)) * 100}%` }}
                      />
                    </div>
                    <div className="text-sm text-gray-600">
                      {character.experience} / {getExperienceForNextLevel(character.level)} XP
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="flex justify-between items-center p-2 bg-gray-50 rounded">
                      <span className="font-semibold">⚖️ Баланс</span>
                      <div className="flex items-center gap-2">
                        <div className="w-24 bg-gray-200 rounded-full h-2">
                          <div className="bg-green-500 h-2 rounded-full" style={{ width: `${character.balance}%` }} />
                        </div>
                        <span className="font-bold text-lg">{character.balance}</span>
                      </div>
                    </div>
                    <div className="flex justify-between items-center p-2 bg-gray-50 rounded">
                      <span className="font-semibold">⚡ Скорость</span>
                      <div className="flex items-center gap-2">
                        <div className="w-24 bg-gray-200 rounded-full h-2">
                          <div className="bg-blue-500 h-2 rounded-full" style={{ width: `${character.speed}%` }} />
                        </div>
                        <span className="font-bold text-lg">{character.speed}</span>
                      </div>
                    </div>
                    <div className="flex justify-between items-center p-2 bg-gray-50 rounded">
                      <span className="font-semibold">🔥 Смелость</span>
                      <div className="flex items-center gap-2">
                        <div className="w-24 bg-gray-200 rounded-full h-2">
                          <div className="bg-red-500 h-2 rounded-full" style={{ width: `${character.courage}%` }} />
                        </div>
                        <span className="font-bold text-lg">{character.courage}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Вкладки */}
        <Tabs defaultValue="tricks" className="space-y-4">
          <TabsList className="bg-white/90">
            <TabsTrigger value="tricks">📖 Паспорт трюков</TabsTrigger>
            <TabsTrigger value="progress">📊 Прогресс</TabsTrigger>
            <TabsTrigger value="leaderboard">🏆 Лидеры</TabsTrigger>
            <TabsTrigger value="friends">👥 Друзья</TabsTrigger>
          </TabsList>

          {/* Паспорт трюков */}
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

          {/* Прогресс */}
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

          {/* Таблица лидеров */}
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

          {/* Друзья и кланы */}
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

        {/* Быстрые действия */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
          <Button onClick={() => setShowShop(true)} className="h-20 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700">
            <div className="text-center">
              <Icon name="Sparkles" className="w-6 h-6 mx-auto mb-1" />
              <div className="text-sm">Магазин</div>
            </div>
          </Button>
          <Button onClick={() => setShowGames(true)} className="h-20 bg-gradient-to-r from-green-600 to-teal-600 hover:from-green-700 hover:to-teal-700">
            <div className="text-center">
              <Icon name="Gamepad2" className="w-6 h-6 mx-auto mb-1" />
              <div className="text-sm">Мини-игры</div>
            </div>
          </Button>
          <Button onClick={() => setShowTournaments(true)} className="h-20 bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700">
            <div className="text-center">
              <Icon name="Trophy" className="w-6 h-6 mx-auto mb-1" />
              <div className="text-sm">Турниры</div>
            </div>
          </Button>
          <Button onClick={() => setShowPro(true)} className="h-20 bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-700 hover:to-purple-700">
            <div className="text-center">
              <Icon name="Crown" className="w-6 h-6 mx-auto mb-1" />
              <div className="text-sm">Kinetic Pro</div>
            </div>
          </Button>
        </div>

        {/* Модальное окно Магазин */}
        {showShop && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={() => setShowShop(false)}>
            <Card className="max-w-4xl w-full max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="text-2xl">✨ Магазин</CardTitle>
                <Button variant="ghost" size="icon" onClick={() => setShowShop(false)}>
                  <Icon name="X" className="w-5 h-5" />
                </Button>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {[
                    { name: 'Крутая кепка', price: 200, icon: '🧢', rarity: 'rare' },
                    { name: 'Стильные кроссовки', price: 500, icon: '👟', rarity: 'epic' },
                    { name: 'Защитный шлем', price: 300, icon: '⛑️', rarity: 'common' },
                    { name: 'Граффити доска', price: 1000, icon: '🎨', rarity: 'legendary' },
                    { name: 'Бустер опыта x2', price: 150, icon: '⚡', rarity: 'rare' },
                    { name: 'Смена причёски', price: 50, icon: '💇', rarity: 'common' }
                  ].map((item, idx) => (
                    <div key={idx} className="p-4 border-2 border-purple-300 rounded-lg hover:border-purple-500 transition-all">
                      <div className="text-center mb-3">
                        <div className="text-5xl mb-2">{item.icon}</div>
                        <div className="font-bold">{item.name}</div>
                        <Badge className={
                          item.rarity === 'legendary' ? 'bg-orange-500' :
                          item.rarity === 'epic' ? 'bg-purple-500' :
                          item.rarity === 'rare' ? 'bg-blue-500' : 'bg-gray-500'
                        }>
                          {item.rarity === 'legendary' ? 'Легендарный' :
                           item.rarity === 'epic' ? 'Эпический' :
                           item.rarity === 'rare' ? 'Редкий' : 'Обычный'}
                        </Badge>
                      </div>
                      <Button className="w-full" size="sm">
                        Купить за {item.price} 💰
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Модальное окно Мини-игры */}
        {showGames && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={() => setShowGames(false)}>
            <Card className="max-w-4xl w-full" onClick={(e) => e.stopPropagation()}>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="text-2xl">🎮 Мини-игры</CardTitle>
                <Button variant="ghost" size="icon" onClick={() => setShowGames(false)}>
                  <Icon name="X" className="w-5 h-5" />
                </Button>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {[
                    { name: 'Трюковой симулятор', desc: 'Повтори трюки из паспорта', icon: '🎯', rewards: '+50 XP' },
                    { name: 'Турнирная арена', desc: 'Сражайся 1 на 1', icon: '⚔️', rewards: 'Эксклюзив' },
                    { name: 'Карточная битва', desc: 'Используй свои трюки', icon: '🃏', rewards: '+30 💰' },
                    { name: 'AR-квесты', desc: 'Сканируй QR-коды в клубе', icon: '📱', rewards: 'Артефакты' }
                  ].map((game, idx) => (
                    <div key={idx} className="p-6 bg-gradient-to-br from-green-50 to-teal-50 rounded-lg border-2 border-green-300 hover:border-green-500 transition-all">
                      <div className="text-center mb-4">
                        <div className="text-6xl mb-2">{game.icon}</div>
                        <div className="font-bold text-lg">{game.name}</div>
                        <p className="text-sm text-gray-600">{game.desc}</p>
                      </div>
                      <div className="text-center text-sm text-green-600 mb-3">
                        Награда: {game.rewards}
                      </div>
                      <Button className="w-full bg-gradient-to-r from-green-600 to-teal-600">
                        <Icon name="Play" className="w-4 h-4 mr-2" />
                        Играть
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Модальное окно Турниры */}
        {showTournaments && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={() => setShowTournaments(false)}>
            <Card className="max-w-2xl w-full" onClick={(e) => e.stopPropagation()}>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="text-2xl">🏆 Турниры</CardTitle>
                <Button variant="ghost" size="icon" onClick={() => setShowTournaments(false)}>
                  <Icon name="X" className="w-5 h-5" />
                </Button>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="p-6 bg-gradient-to-br from-yellow-50 to-orange-50 rounded-lg border-2 border-yellow-400">
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <div className="font-bold text-xl">Еженедельный турнир</div>
                        <p className="text-sm text-gray-600">До конца: 3 дня 12 часов</p>
                      </div>
                      <div className="text-5xl">🏆</div>
                    </div>
                    <div className="mb-4">
                      <div className="text-sm text-gray-600 mb-2">Призовой фонд:</div>
                      <div className="grid grid-cols-3 gap-2 text-center">
                        <div className="bg-white/80 p-2 rounded">
                          <div>🥇</div>
                          <div className="text-xs font-semibold">1000 💰</div>
                        </div>
                        <div className="bg-white/80 p-2 rounded">
                          <div>🥈</div>
                          <div className="text-xs font-semibold">500 💰</div>
                        </div>
                        <div className="bg-white/80 p-2 rounded">
                          <div>🥉</div>
                          <div className="text-xs font-semibold">250 💰</div>
                        </div>
                      </div>
                    </div>
                    <Button className="w-full bg-gradient-to-r from-orange-600 to-red-600" size="lg">
                      Участвовать (300 💰)
                    </Button>
                  </div>

                  <div className="text-center py-6 text-gray-500">
                    <div className="text-4xl mb-2">🔒</div>
                    <p>Больше турниров скоро откроется!</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Модальное окно Kinetic Pro */}
        {showPro && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={() => setShowPro(false)}>
            <Card className="max-w-2xl w-full" onClick={(e) => e.stopPropagation()}>
              <CardHeader className="flex flex-row items-center justify-between bg-gradient-to-r from-pink-100 to-purple-100">
                <CardTitle className="text-2xl">👑 Kinetic Pro</CardTitle>
                <Button variant="ghost" size="icon" onClick={() => setShowPro(false)}>
                  <Icon name="X" className="w-5 h-5" />
                </Button>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="text-center mb-6">
                  <div className="text-6xl mb-4">👑</div>
                  <div className="text-3xl font-bold mb-2">Стань PRO!</div>
                  <p className="text-gray-600">Получи эксклюзивные привилегии</p>
                </div>

                <div className="space-y-3 mb-6">
                  {[
                    'Ежедневный бонус: 50 кинетиков вместо 1',
                    'Ускорение прогресса: +30% опыта',
                    '1 новая одежда каждый месяц',
                    'Особые анимации и титулы',
                    'Расширенная аналитика трюков',
                    'Доступ к бета-тестам'
                  ].map((feature, idx) => (
                    <div key={idx} className="flex items-center gap-3 p-3 bg-purple-50 rounded-lg">
                      <Icon name="Check" className="w-5 h-5 text-green-600" />
                      <span>{feature}</span>
                    </div>
                  ))}
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 border-2 border-purple-300 rounded-lg text-center">
                    <div className="font-bold text-lg mb-2">Месяц</div>
                    <div className="text-3xl font-bold text-purple-600 mb-2">500₽</div>
                    <Button className="w-full bg-gradient-to-r from-purple-600 to-pink-600">
                      Купить
                    </Button>
                  </div>
                  <div className="p-4 border-2 border-yellow-400 rounded-lg text-center bg-yellow-50">
                    <div className="font-bold text-lg mb-2">Год</div>
                    <div className="text-3xl font-bold text-orange-600 mb-2">5000₽</div>
                    <div className="text-xs text-green-600 mb-2">2 месяца в подарок!</div>
                    <Button className="w-full bg-gradient-to-r from-orange-600 to-red-600">
                      Купить
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
};

export default KineticUniverse;