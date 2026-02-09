import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Icon from '@/components/ui/icon';
import Navigation from '@/components/Navigation';
import { Character, Trick, CharacterTrick, SPORT_NAMES, SPORT_ICONS, CATEGORY_NAMES, DIFFICULTY_NAMES, DIFFICULTY_COLORS } from '@/types/kinetic';

const KineticUniverse = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [character, setCharacter] = useState<Character | null>(null);
  const [tricks, setTricks] = useState<Trick[]>([]);
  const [masteredTricks, setMasteredTricks] = useState<CharacterTrick[]>([]);
  const [loading, setLoading] = useState(true);

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
        <Card className="mb-6 bg-white/95 backdrop-blur-md">
          <CardContent className="pt-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Основная информация */}
              <div className="flex items-center gap-4">
                <div className="w-20 h-20 bg-gradient-to-br from-purple-500 to-blue-500 rounded-full flex items-center justify-center text-4xl">
                  {SPORT_ICONS[character.sport_type]}
                </div>
                <div>
                  <div className="text-2xl font-bold">{character.name}</div>
                  <div className="text-gray-600">{SPORT_NAMES[character.sport_type]}</div>
                  <div className="flex items-center gap-2 mt-1">
                    <Badge>Уровень {character.level}</Badge>
                    <span className="text-sm text-gray-500">
                      💰 {character.kinetics} кинетиков
                    </span>
                  </div>
                </div>
              </div>

              {/* Прогресс уровня */}
              <div>
                <div className="text-sm text-gray-600 mb-2">Опыт до следующего уровня</div>
                <Progress 
                  value={(character.experience / getExperienceForNextLevel(character.level)) * 100} 
                  className="mb-2"
                />
                <div className="text-sm text-gray-600">
                  {character.experience} / {getExperienceForNextLevel(character.level)} XP
                </div>
              </div>

              {/* Характеристики */}
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm">⚖️ Баланс</span>
                  <span className="font-semibold">{character.balance}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">⚡ Скорость</span>
                  <span className="font-semibold">{character.speed}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">🔥 Смелость</span>
                  <span className="font-semibold">{character.courage}</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

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
                <Progress value={getTrickProgress()} className="mt-2" />
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

          {/* Остальные вкладки */}
          <TabsContent value="progress">
            <Card className="bg-white/95">
              <CardHeader>
                <CardTitle>📊 Твой прогресс</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">Раздел в разработке...</p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="leaderboard">
            <Card className="bg-white/95">
              <CardHeader>
                <CardTitle>🏆 Таблица лидеров</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">Раздел в разработке...</p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="friends">
            <Card className="bg-white/95">
              <CardHeader>
                <CardTitle>👥 Друзья и кланы</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">Раздел в разработке...</p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Быстрые действия */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
          <Button className="h-20 bg-gradient-to-r from-purple-600 to-blue-600">
            <div className="text-center">
              <Icon name="Sparkles" className="w-6 h-6 mx-auto mb-1" />
              <div className="text-sm">Магазин</div>
            </div>
          </Button>
          <Button className="h-20 bg-gradient-to-r from-green-600 to-teal-600">
            <div className="text-center">
              <Icon name="Gamepad2" className="w-6 h-6 mx-auto mb-1" />
              <div className="text-sm">Мини-игры</div>
            </div>
          </Button>
          <Button className="h-20 bg-gradient-to-r from-orange-600 to-red-600">
            <div className="text-center">
              <Icon name="Trophy" className="w-6 h-6 mx-auto mb-1" />
              <div className="text-sm">Турниры</div>
            </div>
          </Button>
          <Button className="h-20 bg-gradient-to-r from-pink-600 to-purple-600">
            <div className="text-center">
              <Icon name="Crown" className="w-6 h-6 mx-auto mb-1" />
              <div className="text-sm">Kinetic Pro</div>
            </div>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default KineticUniverse;
