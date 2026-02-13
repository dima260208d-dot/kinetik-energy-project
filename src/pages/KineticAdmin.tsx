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
import { Character, Trick, KineticsTransaction, SPORT_NAMES, SPORT_ICONS, DIFFICULTY_NAMES, DIFFICULTY_COLORS } from '@/types/kinetic';
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
  const [transactions, setTransactions] = useState<KineticsTransaction[]>([]);
  const [loadingTx, setLoadingTx] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    if (selectedCharacter) {
      loadTransactions(selectedCharacter.id);
    }
  }, [selectedCharacter?.id]);

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

  const loadTransactions = async (charId: number) => {
    setLoadingTx(true);
    try {
      const txs = await api.getTransactions(charId);
      setTransactions(txs);
    } catch {
      setTransactions([]);
    }
    setLoadingTx(false);
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
      await loadTransactions(selectedCharacter.id);

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
      await loadTransactions(selectedCharacter.id);

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

  const formatDate = (dateStr: string) => {
    const d = new Date(dateStr);
    return d.toLocaleString('ru-RU', { day: '2-digit', month: '2-digit', year: '2-digit', hour: '2-digit', minute: '2-digit' });
  };

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
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
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

                      <div>
                        <Label>Причина</Label>
                        <Input
                          value={kineticsReason}
                          onChange={(e) => setKineticsReason(e.target.value)}
                          placeholder="Укажите причину..."
                          className="mt-2"
                        />
                      </div>

                      <Button
                        onClick={handleKinetics}
                        className={`w-full ${isDeduct ? 'bg-red-600 hover:bg-red-700' : 'bg-green-600 hover:bg-green-700'}`}
                        disabled={kineticsAmount <= 0}
                      >
                        {isDeduct ? 'Списать' : 'Начислить'} {kineticsAmount > 0 ? `${kineticsAmount} кинетиков` : ''}
                      </Button>
                    </div>
                  ) : (
                    <div className="text-center py-8 text-gray-500">
                      <Icon name="UserCircle" className="w-12 h-12 mx-auto mb-2 opacity-50" />
                      <p>Выберите персонажа слева</p>
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card className="bg-white/95">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Icon name="History" className="w-5 h-5" />
                    История операций
                  </CardTitle>
                </CardHeader>
                <CardContent className="max-h-[500px] overflow-y-auto">
                  {!selectedCharacter ? (
                    <p className="text-center py-8 text-gray-500">Выберите персонажа</p>
                  ) : loadingTx ? (
                    <p className="text-center py-8 text-gray-500">Загрузка...</p>
                  ) : transactions.length === 0 ? (
                    <p className="text-center py-8 text-gray-500">Операций пока нет</p>
                  ) : (
                    <div className="space-y-2">
                      {transactions.map(tx => (
                        <div
                          key={tx.id}
                          className={`p-3 rounded-lg border text-sm ${
                            tx.amount > 0
                              ? 'bg-green-50 border-green-200'
                              : 'bg-red-50 border-red-200'
                          }`}
                        >
                          <div className="flex items-center justify-between mb-1">
                            <span className={`font-bold ${tx.amount > 0 ? 'text-green-700' : 'text-red-700'}`}>
                              {tx.amount > 0 ? '+' : ''}{tx.amount} 💰
                            </span>
                            <span className="text-xs text-gray-500">{formatDate(tx.created_at)}</span>
                          </div>
                          <div className="text-gray-600 text-xs">
                            {tx.description || tx.source}
                          </div>
                          <div className="text-gray-400 text-[10px] mt-1">
                            Источник: {tx.source}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="tricks">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="bg-white/95">
                <CardHeader>
                  <CardTitle>Выбор персонажа для подтверждения</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3 max-h-[400px] overflow-y-auto">
                  {characters.map((char) => (
                    <div
                      key={char.id}
                      onClick={() => setSelectedCharacter(char)}
                      className={`p-3 rounded-lg border-2 cursor-pointer transition-all ${
                        selectedCharacter?.id === char.id
                          ? 'border-purple-500 bg-purple-50'
                          : 'border-gray-300 hover:border-purple-300'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className="text-2xl">{SPORT_ICONS[char.sport_type]}</div>
                        <div>
                          <div className="font-semibold">{char.name}</div>
                          <div className="text-sm text-gray-600">{SPORT_NAMES[char.sport_type]} | Уровень {char.level}</div>
                        </div>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>

              <Card className="bg-white/95">
                <CardHeader>
                  <CardTitle>
                    {selectedCharacter
                      ? `Трюки — ${SPORT_NAMES[selectedCharacter.sport_type]}`
                      : 'Выберите персонажа'}
                  </CardTitle>
                </CardHeader>
                <CardContent className="max-h-[500px] overflow-y-auto">
                  {selectedCharacter ? (
                    <>
                      <div className="space-y-2 mb-4">
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
                                <div className="flex items-center gap-2 mt-1">
                                  <Badge className={`${DIFFICULTY_COLORS[trick.difficulty]} text-xs`}>
                                    {DIFFICULTY_NAMES[trick.difficulty]}
                                  </Badge>
                                  <span className="text-xs text-gray-600">+{trick.experience_reward} XP | +{trick.kinetics_reward} 💰</span>
                                </div>
                              </div>
                              {selectedTricks.includes(trick.id) && (
                                <Icon name="CheckCircle2" className="w-6 h-6 text-green-600" />
                              )}
                            </div>
                          </div>
                        ))}
                      </div>

                      {selectedTricks.length > 0 && (
                        <Button onClick={handleConfirmTricks} className="w-full bg-green-600 hover:bg-green-700">
                          <Icon name="Check" className="w-4 h-4 mr-2" />
                          Подтвердить {selectedTricks.length} трюков
                        </Button>
                      )}
                    </>
                  ) : (
                    <p className="text-center py-8 text-gray-500">Выберите персонажа</p>
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
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {characters.map((char) => (
                    <div key={char.id} className="p-4 border-2 border-gray-200 rounded-lg">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="text-3xl">{SPORT_ICONS[char.sport_type]}</div>
                        <div>
                          <div className="font-bold text-lg">{char.name}</div>
                          <div className="text-sm text-gray-600">{SPORT_NAMES[char.sport_type]}</div>
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-2 text-sm">
                        <div className="bg-purple-50 p-2 rounded">
                          <div className="text-gray-600">Уровень</div>
                          <div className="font-bold">{char.level}</div>
                        </div>
                        <div className="bg-yellow-50 p-2 rounded">
                          <div className="text-gray-600">Кинетики</div>
                          <div className="font-bold">{char.kinetics} 💰</div>
                        </div>
                        <div className="bg-blue-50 p-2 rounded">
                          <div className="text-gray-600">Опыт</div>
                          <div className="font-bold">{char.experience} XP</div>
                        </div>
                        <div className="bg-green-50 p-2 rounded">
                          <div className="text-gray-600">Игры</div>
                          <div className="font-bold">{char.games_played || 0} / {char.games_won || 0} побед</div>
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
