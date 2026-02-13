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
import * as api from '@/services/kineticApi';

const KineticAdmin = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [characters, setCharacters] = useState<Character[]>([]);
  const [tricks, setTricks] = useState<Trick[]>([]);
  const [selectedCharacter, setSelectedCharacter] = useState<Character | null>(null);
  const [kineticsAmount, setKineticsAmount] = useState(0);
  const [kineticsReason, setKineticsReason] = useState('');
  const [selectedTricks, setSelectedTricks] = useState<number[]>([]);
  const [isDeduct, setIsDeduct] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [chars, allTricks] = await Promise.all([
        api.getAllCharacters(),
        api.getTricks(''),
      ]);
      setCharacters(chars);
      setTricks(allTricks);
    } catch {
      toast({ title: 'Ошибка', description: 'Не удалось загрузить данные', variant: 'destructive' });
    }
  };

  const handleKinetics = async () => {
    if (!selectedCharacter || kineticsAmount <= 0) {
      toast({ title: 'Ошибка', description: 'Выберите персонажа и укажите количество', variant: 'destructive' });
      return;
    }

    const amount = isDeduct ? -kineticsAmount : kineticsAmount;
    const source = isDeduct ? 'admin_deduct' : 'admin_grant';
    const desc = kineticsReason || (isDeduct ? 'Списание кинетиков' : 'Начисление кинетиков');

    try {
      const result = await api.addKinetics(selectedCharacter.id, amount, source, desc, user?.id);
      setSelectedCharacter(result.character);
      setKineticsAmount(0);
      setKineticsReason('');
      await loadData();

      toast({
        title: isDeduct ? 'Списано!' : 'Начислено!',
        description: `${isDeduct ? 'Списано' : 'Начислено'} ${kineticsAmount} кинетиков у ${selectedCharacter.name}`
      });
    } catch {
      toast({ title: 'Ошибка', description: 'Не удалось выполнить операцию', variant: 'destructive' });
    }
  };

  const handleConfirmTricks = async () => {
    if (!selectedCharacter || selectedTricks.length === 0) {
      toast({ title: 'Ошибка', description: 'Выберите персонажа и трюки', variant: 'destructive' });
      return;
    }

    try {
      const result = await api.confirmTricks(selectedCharacter.id, selectedTricks, user?.id);
      setSelectedTricks([]);
      await loadData();

      toast({
        title: 'Трюки подтверждены!',
        description: `+${result.total_exp} опыта, +${result.total_kinetics} кинетиков`
      });
    } catch {
      toast({ title: 'Ошибка', description: 'Не удалось подтвердить трюки', variant: 'destructive' });
    }
  };

  const toggleTrickSelection = (trickId: number) => {
    setSelectedTricks(prev =>
      prev.includes(trickId) ? prev.filter(id => id !== trickId) : [...prev, trickId]
    );
  };

  const characterTricks = selectedCharacter
    ? tricks.filter(t => t.sport_type === selectedCharacter.sport_type)
    : [];

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 p-4">
      <div className="max-w-7xl mx-auto">
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
            <TabsTrigger value="kinetics">💰 Кинетики</TabsTrigger>
            <TabsTrigger value="tricks">✅ Подтверждение трюков</TabsTrigger>
            <TabsTrigger value="characters">👥 Все персонажи</TabsTrigger>
          </TabsList>

          <TabsContent value="kinetics">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="bg-white/95">
                <CardHeader>
                  <CardTitle>Выбор персонажа</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3 max-h-[500px] overflow-y-auto">
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
                  <CardTitle>Управление кинетиками</CardTitle>
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

                      <div className="flex gap-2">
                        <Button
                          variant={!isDeduct ? 'default' : 'outline'}
                          onClick={() => setIsDeduct(false)}
                          className={!isDeduct ? 'bg-green-600 hover:bg-green-700 flex-1' : 'flex-1'}
                        >
                          <Icon name="Plus" className="w-4 h-4 mr-1" />
                          Начислить
                        </Button>
                        <Button
                          variant={isDeduct ? 'default' : 'outline'}
                          onClick={() => setIsDeduct(true)}
                          className={isDeduct ? 'bg-red-600 hover:bg-red-700 flex-1' : 'flex-1'}
                        >
                          <Icon name="Minus" className="w-4 h-4 mr-1" />
                          Списать
                        </Button>
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
                            {amount}
                          </Button>
                        ))}
                      </div>

                      <div>
                        <Label>Причина (необязательно)</Label>
                        <Input
                          value={kineticsReason}
                          onChange={(e) => setKineticsReason(e.target.value)}
                          placeholder="За что начисляем/списываем..."
                          className="mt-2"
                        />
                      </div>

                      <Button
                        onClick={handleKinetics}
                        className={`w-full ${isDeduct
                          ? 'bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-700 hover:to-orange-700'
                          : 'bg-gradient-to-r from-green-600 to-teal-600 hover:from-green-700 hover:to-teal-700'
                        }`}
                        size="lg"
                        disabled={kineticsAmount <= 0}
                      >
                        <Icon name={isDeduct ? "Minus" : "Plus"} className="w-5 h-5 mr-2" />
                        {isDeduct ? 'Списать' : 'Начислить'} {kineticsAmount} кинетиков
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

          <TabsContent value="tricks">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="bg-white/95">
                <CardHeader>
                  <CardTitle>Выбор персонажа</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3 max-h-[500px] overflow-y-auto">
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
                        <div className="text-sm text-gray-600">{SPORT_NAMES[selectedCharacter.sport_type]}</div>
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
                        </div>
                      )}

                      <Button
                        onClick={handleConfirmTricks}
                        className="w-full bg-gradient-to-r from-green-600 to-teal-600"
                        size="lg"
                        disabled={selectedTricks.length === 0}
                      >
                        <Icon name="Check" className="w-5 h-5 mr-2" />
                        Подтвердить {selectedTricks.length} трюков
                      </Button>
                    </div>
                  ) : (
                    <p className="text-gray-500 text-center py-8">Выберите персонажа</p>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="characters">
            <Card className="bg-white/95">
              <CardHeader>
                <CardTitle>Все персонажи ({characters.length})</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {characters.map((char, idx) => (
                    <div key={char.id} className="p-4 rounded-lg border-2 border-gray-200 bg-white">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div className="text-2xl font-bold text-gray-400 w-8">
                            {idx + 1}.
                          </div>
                          {char.avatar_url ? (
                            <img src={char.avatar_url} alt={char.name} className="w-12 h-12 rounded-full object-cover border-2 border-purple-300" />
                          ) : (
                            <div className="text-3xl">{SPORT_ICONS[char.sport_type]}</div>
                          )}
                          <div>
                            <div className="font-bold text-lg">{char.name}</div>
                            <div className="text-sm text-gray-600">
                              {SPORT_NAMES[char.sport_type]} · Уровень {char.level}
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-lg font-bold text-purple-600">{char.experience} XP</div>
                          <div className="text-sm text-yellow-600">💰 {char.kinetics}</div>
                        </div>
                      </div>
                    </div>
                  ))}
                  {characters.length === 0 && (
                    <div className="text-center py-12 text-gray-500">
                      <p>Ещё нет зарегистрированных персонажей</p>
                    </div>
                  )}
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
