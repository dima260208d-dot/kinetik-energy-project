import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Icon from '@/components/ui/icon';
import Navigation from '@/components/Navigation';
import { useToast } from '@/hooks/use-toast';
import { Character, Trick, SPORT_NAMES, SPORT_ICONS, DIFFICULTY_NAMES, DIFFICULTY_COLORS } from '@/types/kinetic';

const KineticAdmin = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [characters, setCharacters] = useState<Character[]>([]);
  const [tricks, setTricks] = useState<Trick[]>([]);
  const [selectedCharacter, setSelectedCharacter] = useState<Character | null>(null);
  const [kineticsAmount, setKineticsAmount] = useState(0);
  const [selectedTricks, setSelectedTricks] = useState<number[]>([]);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    const stored = localStorage.getItem('kinetic_universe_data');
    const data = stored ? JSON.parse(stored) : { characters: [], masteredTricks: [] };
    
    setCharacters(data.characters || []);
    
    // Моковые трюки (в реальности из БД)
    const mockTricks: Trick[] = [
      { id: 1, name: 'Ollie', sport_type: 'skate', category: 'jumps', difficulty: 'novice', experience_reward: 50, kinetics_reward: 10, description: 'Базовый прыжок', created_at: '' },
      { id: 2, name: 'Kickflip', sport_type: 'skate', category: 'flips', difficulty: 'amateur', experience_reward: 100, kinetics_reward: 20, description: 'Вращение доски', created_at: '' },
      { id: 10, name: 'Drop-in', sport_type: 'skate', category: 'jumps', difficulty: 'amateur', experience_reward: 90, kinetics_reward: 18, description: 'Заезд в рампу', created_at: '' },
      { id: 11, name: 'Basic Roll', sport_type: 'rollers', category: 'balance', difficulty: 'novice', experience_reward: 30, kinetics_reward: 5, description: 'Базовое катание', created_at: '' },
      { id: 12, name: 'T-stop', sport_type: 'rollers', category: 'balance', difficulty: 'novice', experience_reward: 40, kinetics_reward: 8, description: 'Торможение', created_at: '' },
      { id: 21, name: 'Bunny Hop', sport_type: 'bmx', category: 'jumps', difficulty: 'novice', experience_reward: 50, kinetics_reward: 10, description: 'Базовый прыжок', created_at: '' },
      { id: 31, name: 'Tailwhip', sport_type: 'scooter', category: 'flips', difficulty: 'amateur', experience_reward: 120, kinetics_reward: 25, description: 'Вращение деки', created_at: '' },
    ];
    setTricks(mockTricks);
  };

  const handleGrantKinetics = () => {
    if (!selectedCharacter) {
      toast({
        title: 'Ошибка',
        description: 'Выберите персонажа',
        variant: 'destructive'
      });
      return;
    }

    if (kineticsAmount <= 0) {
      toast({
        title: 'Ошибка',
        description: 'Введите количество кинетиков',
        variant: 'destructive'
      });
      return;
    }

    const stored = localStorage.getItem('kinetic_universe_data');
    const data = stored ? JSON.parse(stored) : { characters: [], masteredTricks: [] };
    
    const updatedCharacters = data.characters.map((c: Character) => {
      if (c.id === selectedCharacter.id) {
        return { ...c, kinetics: c.kinetics + kineticsAmount };
      }
      return c;
    });

    data.characters = updatedCharacters;
    localStorage.setItem('kinetic_universe_data', JSON.stringify(data));
    
    setCharacters(updatedCharacters);
    setSelectedCharacter({ ...selectedCharacter, kinetics: selectedCharacter.kinetics + kineticsAmount });
    setKineticsAmount(0);

    toast({
      title: 'Успешно!',
      description: `Начислено ${kineticsAmount} кинетиков персонажу ${selectedCharacter.name}`
    });
  };

  const handleConfirmTricks = () => {
    if (!selectedCharacter) {
      toast({
        title: 'Ошибка',
        description: 'Выберите персонажа',
        variant: 'destructive'
      });
      return;
    }

    if (selectedTricks.length === 0) {
      toast({
        title: 'Ошибка',
        description: 'Выберите трюки для подтверждения',
        variant: 'destructive'
      });
      return;
    }

    const stored = localStorage.getItem('kinetic_universe_data');
    const data = stored ? JSON.parse(stored) : { characters: [], masteredTricks: [] };
    
    // Добавляем освоенные трюки
    const newMasteredTricks = selectedTricks.map(trickId => ({
      id: Date.now() + trickId,
      character_id: selectedCharacter.id,
      trick_id: trickId,
      confirmed_by: user?.id,
      confirmed_at: new Date().toISOString()
    }));

    data.masteredTricks = [...(data.masteredTricks || []), ...newMasteredTricks];

    // Начисляем награды
    let totalExp = 0;
    let totalKinetics = 0;

    selectedTricks.forEach(trickId => {
      const trick = tricks.find(t => t.id === trickId);
      if (trick) {
        totalExp += trick.experience_reward;
        totalKinetics += trick.kinetics_reward;
      }
    });

    // Обновляем персонажа
    const updatedCharacters = data.characters.map((c: Character) => {
      if (c.id === selectedCharacter.id) {
        const newExp = c.experience + totalExp;
        const newLevel = Math.floor(newExp / 100) + 1;
        return { 
          ...c, 
          experience: newExp,
          level: Math.min(newLevel, 100),
          kinetics: c.kinetics + totalKinetics 
        };
      }
      return c;
    });

    data.characters = updatedCharacters;
    localStorage.setItem('kinetic_universe_data', JSON.stringify(data));
    
    setCharacters(updatedCharacters);
    setSelectedTricks([]);

    toast({
      title: 'Трюки подтверждены!',
      description: `Персонаж получил: +${totalExp} опыта, +${totalKinetics} кинетиков`
    });
  };

  const toggleTrickSelection = (trickId: number) => {
    if (selectedTricks.includes(trickId)) {
      setSelectedTricks(selectedTricks.filter(id => id !== trickId));
    } else {
      setSelectedTricks([...selectedTricks, trickId]);
    }
  };

  const characterTricks = selectedCharacter 
    ? tricks.filter(t => t.sport_type === selectedCharacter.sport_type)
    : [];

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 p-4">
      <div className="max-w-7xl mx-auto">
        {/* Шапка */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold text-white flex items-center gap-2">
              ⚙️ Kinetic Universe — Админ-панель
            </h1>
            <p className="text-blue-200">Управление персонажами и трюками</p>
          </div>
          <Navigation currentPage="dashboard" />
        </div>

        <Tabs defaultValue="kinetics" className="space-y-4">
          <TabsList className="bg-white/90">
            <TabsTrigger value="kinetics">💰 Начисление кинетиков</TabsTrigger>
            <TabsTrigger value="tricks">✅ Подтверждение трюков</TabsTrigger>
            <TabsTrigger value="characters">👥 Все персонажи</TabsTrigger>
          </TabsList>

          {/* Начисление кинетиков */}
          <TabsContent value="kinetics">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="bg-white/95">
                <CardHeader>
                  <CardTitle>Выбор персонажа</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {characters.map((char) => (
                    <div
                      key={char.id}
                      onClick={() => setSelectedCharacter(char)}
                      className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                        selectedCharacter?.id === char.id
                          ? 'border-purple-500 bg-purple-50'
                          : 'border-gray-300 hover:border-purple-300'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="text-3xl">{SPORT_ICONS[char.sport_type]}</div>
                          <div>
                            <div className="font-semibold">{char.name}</div>
                            <div className="text-sm text-gray-600">{SPORT_NAMES[char.sport_type]}</div>
                          </div>
                        </div>
                        <div className="text-right">
                          <Badge>Уровень {char.level}</Badge>
                          <div className="text-sm text-gray-600 mt-1">💰 {char.kinetics}</div>
                        </div>
                      </div>
                    </div>
                  ))}
                  {characters.length === 0 && (
                    <p className="text-gray-500 text-center py-8">Персонажи не найдены</p>
                  )}
                </CardContent>
              </Card>

              <Card className="bg-white/95">
                <CardHeader>
                  <CardTitle>Начислить кинетики</CardTitle>
                </CardHeader>
                <CardContent>
                  {selectedCharacter ? (
                    <div className="space-y-4">
                      <div className="p-4 bg-purple-50 rounded-lg">
                        <div className="text-sm text-gray-600 mb-1">Выбран персонаж:</div>
                        <div className="font-bold text-lg">{selectedCharacter.name}</div>
                        <div className="text-sm text-gray-600">
                          Текущий баланс: <span className="font-semibold">{selectedCharacter.kinetics} 💰</span>
                        </div>
                      </div>

                      <div>
                        <Label>Количество кинетиков</Label>
                        <Input
                          type="number"
                          value={kineticsAmount || ''}
                          onChange={(e) => setKineticsAmount(parseInt(e.target.value) || 0)}
                          placeholder="Введите количество..."
                          min="1"
                          className="mt-2"
                        />
                      </div>

                      <div className="grid grid-cols-3 gap-2">
                        {[10, 50, 100, 200, 500, 1000].map((amount) => (
                          <Button
                            key={amount}
                            variant="outline"
                            onClick={() => setKineticsAmount(amount)}
                            className="text-sm"
                          >
                            +{amount}
                          </Button>
                        ))}
                      </div>

                      <Button
                        onClick={handleGrantKinetics}
                        className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
                        size="lg"
                        disabled={kineticsAmount <= 0}
                      >
                        <Icon name="Plus" className="w-5 h-5 mr-2" />
                        Начислить {kineticsAmount} кинетиков
                      </Button>
                    </div>
                  ) : (
                    <p className="text-gray-500 text-center py-8">
                      Выберите персонажа из списка слева
                    </p>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Подтверждение трюков */}
          <TabsContent value="tricks">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="bg-white/95">
                <CardHeader>
                  <CardTitle>Выбор персонажа</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {characters.map((char) => (
                    <div
                      key={char.id}
                      onClick={() => {
                        setSelectedCharacter(char);
                        setSelectedTricks([]);
                      }}
                      className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                        selectedCharacter?.id === char.id
                          ? 'border-green-500 bg-green-50'
                          : 'border-gray-300 hover:border-green-300'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="text-3xl">{SPORT_ICONS[char.sport_type]}</div>
                          <div>
                            <div className="font-semibold">{char.name}</div>
                            <div className="text-sm text-gray-600">{SPORT_NAMES[char.sport_type]}</div>
                          </div>
                        </div>
                        <Badge>Уровень {char.level}</Badge>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>

              <Card className="bg-white/95">
                <CardHeader>
                  <CardTitle>Подтвердить трюки</CardTitle>
                </CardHeader>
                <CardContent>
                  {selectedCharacter ? (
                    <div className="space-y-4">
                      <div className="p-4 bg-green-50 rounded-lg mb-4">
                        <div className="text-sm text-gray-600 mb-1">Персонаж:</div>
                        <div className="font-bold text-lg">{selectedCharacter.name}</div>
                        <div className="text-sm text-gray-600">
                          {SPORT_NAMES[selectedCharacter.sport_type]}
                        </div>
                      </div>

                      <div className="space-y-2 max-h-96 overflow-y-auto">
                        {characterTricks.map((trick) => (
                          <div
                            key={trick.id}
                            onClick={() => toggleTrickSelection(trick.id)}
                            className={`p-3 rounded-lg border-2 cursor-pointer transition-all ${
                              selectedTricks.includes(trick.id)
                                ? 'border-green-500 bg-green-50'
                                : 'border-gray-300 hover:border-green-300'
                            }`}
                          >
                            <div className="flex items-center justify-between">
                              <div>
                                <div className="font-semibold">{trick.name}</div>
                                <div className="text-sm text-gray-600">{trick.description}</div>
                              </div>
                              <div className="text-right text-sm">
                                <Badge className={DIFFICULTY_COLORS[trick.difficulty]}>
                                  {DIFFICULTY_NAMES[trick.difficulty]}
                                </Badge>
                                <div className="text-xs mt-1">
                                  +{trick.experience_reward} XP, +{trick.kinetics_reward} 💰
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>

                      {selectedTricks.length > 0 && (
                        <div className="p-4 bg-blue-50 rounded-lg">
                          <div className="text-sm font-semibold mb-2">
                            Выбрано трюков: {selectedTricks.length}
                          </div>
                          <div className="text-xs text-gray-600">
                            Персонаж получит опыт и кинетики за каждый подтверждённый трюк
                          </div>
                        </div>
                      )}

                      <Button
                        onClick={handleConfirmTricks}
                        className="w-full bg-gradient-to-r from-green-600 to-teal-600 hover:from-green-700 hover:to-teal-700"
                        size="lg"
                        disabled={selectedTricks.length === 0}
                      >
                        <Icon name="Check" className="w-5 h-5 mr-2" />
                        Подтвердить {selectedTricks.length} трюков
                      </Button>
                    </div>
                  ) : (
                    <p className="text-gray-500 text-center py-8">
                      Выберите персонажа
                    </p>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Все персонажи */}
          <TabsContent value="characters">
            <Card className="bg-white/95">
              <CardHeader>
                <CardTitle>Все персонажи</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {characters.map((char) => (
                    <div key={char.id} className="p-4 border-2 border-gray-300 rounded-lg">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="text-3xl">{SPORT_ICONS[char.sport_type]}</div>
                        <div>
                          <div className="font-bold">{char.name}</div>
                          <div className="text-sm text-gray-600">{SPORT_NAMES[char.sport_type]}</div>
                        </div>
                      </div>
                      <div className="space-y-1 text-sm">
                        <div className="flex justify-between">
                          <span>Уровень:</span>
                          <span className="font-semibold">{char.level}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Опыт:</span>
                          <span className="font-semibold">{char.experience} XP</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Кинетики:</span>
                          <span className="font-semibold">💰 {char.kinetics}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Баланс:</span>
                          <span className="font-semibold">{char.balance}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Скорость:</span>
                          <span className="font-semibold">{char.speed}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Смелость:</span>
                          <span className="font-semibold">{char.courage}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default KineticAdmin;
