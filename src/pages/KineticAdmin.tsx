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
import PublicProfileModal from '@/components/kinetic/PublicProfileModal';
import { useToast } from '@/hooks/use-toast';
import { Character, Trick, KineticsTransaction, TrainingVisit, SPORT_NAMES, SPORT_ICONS, SportType, DIFFICULTY_NAMES, DIFFICULTY_COLORS } from '@/types/kinetic';
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
  const [trainingVisits, setTrainingVisits] = useState<TrainingVisit[]>([]);
  const [loadingTx, setLoadingTx] = useState(false);
  const [trainerInput, setTrainerInput] = useState('');
  const [ageInput, setAgeInput] = useState('');
  const [trainingDate, setTrainingDate] = useState(new Date().toISOString().split('T')[0]);
  const [trainingNotes, setTrainingNotes] = useState('');
  const [profileCharId, setProfileCharId] = useState<number | null>(null);

  useEffect(() => { loadData(); }, []);

  useEffect(() => {
    if (selectedCharacter) {
      loadCharacterData(selectedCharacter.id);
      setTrainerInput(selectedCharacter.trainer_name || '');
      setAgeInput(selectedCharacter.age ? String(selectedCharacter.age) : '');
    }
  }, [selectedCharacter?.id]);

  const loadData = async () => {
    try {
      const [chars, allTricks] = await Promise.all([api.getAllCharacters(), api.getTricks('')]);
      setCharacters(chars);
      setTricks(allTricks);
    } catch {
      toast({ title: 'Ошибка', variant: 'destructive' });
    }
  };

  const loadCharacterData = async (charId: number) => {
    setLoadingTx(true);
    try {
      const [txs, visits] = await Promise.all([
        api.getTransactions(charId),
        api.getTrainingVisits(charId),
      ]);
      setTransactions(txs);
      setTrainingVisits(visits);
    } catch {
      setTransactions([]);
      setTrainingVisits([]);
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
      await loadCharacterData(selectedCharacter.id);
      toast({ title: isDeduct ? 'Списано!' : 'Начислено!', description: `${isDeduct ? 'Списано' : 'Начислено'} ${kineticsAmount} у ${selectedCharacter.name}` });
    } catch {
      toast({ title: 'Ошибка', variant: 'destructive' });
    }
  };

  const handleConfirmTricks = async () => {
    if (!selectedCharacter || selectedTricks.length === 0) return;
    try {
      const result = await api.confirmTricks(selectedCharacter.id, selectedTricks, user?.id);
      setSelectedTricks([]);
      await loadData();
      await loadCharacterData(selectedCharacter.id);
      toast({ title: 'Трюки подтверждены!', description: `+${result.total_exp} XP, +${result.total_kinetics} 💰` });
    } catch {
      toast({ title: 'Ошибка', variant: 'destructive' });
    }
  };

  const handleSetTrainer = async () => {
    if (!selectedCharacter) return;
    try {
      const result = await api.setTrainer(selectedCharacter.id, trainerInput);
      setSelectedCharacter(result.character);
      await loadData();
      toast({ title: 'Тренер обновлён', description: trainerInput || 'Тренер убран' });
    } catch {
      toast({ title: 'Ошибка', variant: 'destructive' });
    }
  };

  const handleSetAge = async () => {
    if (!selectedCharacter) return;
    try {
      const result = await api.setAge(selectedCharacter.id, parseInt(ageInput) || 0);
      setSelectedCharacter(result.character);
      await loadData();
      toast({ title: 'Возраст обновлён' });
    } catch {
      toast({ title: 'Ошибка', variant: 'destructive' });
    }
  };

  const handleAddTraining = async () => {
    if (!selectedCharacter || !trainingDate) return;
    try {
      await api.addTrainingVisit(selectedCharacter.id, trainingDate, user?.id, trainingNotes);
      setTrainingNotes('');
      await loadCharacterData(selectedCharacter.id);
      toast({ title: 'Тренировка засчитана!', description: `${trainingDate} для ${selectedCharacter.name}` });
    } catch {
      toast({ title: 'Ошибка', variant: 'destructive' });
    }
  };

  const toggleTrickSelection = (trickId: number) => {
    setSelectedTricks(prev => prev.includes(trickId) ? prev.filter(id => id !== trickId) : [...prev, trickId]);
  };

  const characterTricks = selectedCharacter
    ? tricks.filter(t => {
        const sports = selectedCharacter.sport_types || [selectedCharacter.sport_type];
        return sports.includes(t.sport_type);
      })
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
            <h1 className="text-3xl font-bold text-white flex items-center gap-2">⚙️ Kinetic Universe — Админ-панель</h1>
            <p className="text-blue-200">Управление персонажами, тренировками и турнирами</p>
          </div>
          <Navigation currentPage="dashboard" />
        </div>

        <Tabs defaultValue="kinetics" className="space-y-4">
          <TabsList className="bg-white/90 flex-wrap">
            <TabsTrigger value="kinetics">💰 Кинетики</TabsTrigger>
            <TabsTrigger value="tricks">✅ Трюки</TabsTrigger>
            <TabsTrigger value="training">🏋️ Тренировки</TabsTrigger>
            <TabsTrigger value="settings">⚙️ Настройки</TabsTrigger>
            <TabsTrigger value="characters">👥 Персонажи</TabsTrigger>
          </TabsList>

          {/* Character selector */}
          <Card className="bg-white/95">
            <CardHeader><CardTitle>Выбор персонажа</CardTitle></CardHeader>
            <CardContent className="space-y-3 max-h-[300px] overflow-y-auto">
              {characters.map((char) => (
                <div key={char.id} onClick={() => setSelectedCharacter(char)}
                  className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${selectedCharacter?.id === char.id ? 'border-purple-500 bg-purple-50' : 'border-gray-300 hover:border-purple-300'}`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="text-3xl">{SPORT_ICONS[char.sport_type]}</div>
                      <div>
                        <div className="font-semibold">{char.name}</div>
                        <div className="text-sm text-gray-600">
                          {SPORT_NAMES[char.sport_type]}
                          {char.trainer_name && <span className="ml-2">| Тренер: {char.trainer_name}</span>}
                          {char.age && <span className="ml-2">| {char.age} лет</span>}
                        </div>
                        <div className="text-xs text-gray-400">Аккаунт: {char.user_id}</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <Badge>Уровень {char.level}</Badge>
                      <div className="text-sm text-gray-600 mt-1">💰 {char.kinetics}</div>
                    </div>
                  </div>
                </div>
              ))}
              {characters.length === 0 && <p className="text-gray-500 text-center py-8">Персонажи не найдены</p>}
            </CardContent>
          </Card>

          <TabsContent value="kinetics">
            <Card className="bg-white/95">
              <CardHeader><CardTitle>Управление кинетиками</CardTitle></CardHeader>
              <CardContent>
                {selectedCharacter ? (
                  <div className="space-y-4">
                    <div className="p-4 bg-purple-50 rounded-lg">
                      <div className="font-bold text-lg">{selectedCharacter.name}</div>
                      <div className="text-sm text-gray-600">Баланс: <span className="font-semibold">{selectedCharacter.kinetics} 💰</span></div>
                    </div>
                    <div className="flex gap-2">
                      <Button variant={!isDeduct ? 'default' : 'outline'} onClick={() => setIsDeduct(false)} className={!isDeduct ? 'bg-green-600 hover:bg-green-700 flex-1' : 'flex-1'}>
                        <Icon name="Plus" className="w-4 h-4 mr-1" /> Начислить
                      </Button>
                      <Button variant={isDeduct ? 'default' : 'outline'} onClick={() => setIsDeduct(true)} className={isDeduct ? 'bg-red-600 hover:bg-red-700 flex-1' : 'flex-1'}>
                        <Icon name="Minus" className="w-4 h-4 mr-1" /> Списать
                      </Button>
                    </div>
                    <div>
                      <Label>Количество</Label>
                      <Input type="number" min="1" value={kineticsAmount || ''} onChange={e => setKineticsAmount(parseInt(e.target.value) || 0)} placeholder="Количество кинетиков" />
                    </div>
                    <div>
                      <Label>Причина</Label>
                      <Input value={kineticsReason} onChange={e => setKineticsReason(e.target.value)} placeholder="Причина (необязательно)" />
                    </div>
                    <Button onClick={handleKinetics} className={isDeduct ? 'w-full bg-red-600 hover:bg-red-700' : 'w-full bg-green-600 hover:bg-green-700'}>
                      {isDeduct ? 'Списать' : 'Начислить'} {kineticsAmount} кинетиков
                    </Button>

                    {!loadingTx && transactions.length > 0 && (
                      <div className="mt-4">
                        <h4 className="font-semibold mb-2">История транзакций:</h4>
                        <div className="space-y-1 max-h-[200px] overflow-y-auto">
                          {transactions.slice(0, 20).map(tx => (
                            <div key={tx.id} className="flex justify-between text-sm p-2 bg-gray-50 rounded">
                              <span className={tx.amount > 0 ? 'text-green-600' : 'text-red-600'}>{tx.amount > 0 ? '+' : ''}{tx.amount}</span>
                              <span className="text-gray-500 truncate max-w-[200px]">{tx.description || tx.source}</span>
                              <span className="text-gray-400 text-xs">{formatDate(tx.created_at)}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ) : <p className="text-gray-500 text-center py-8">Выберите персонажа</p>}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="tricks">
            <Card className="bg-white/95">
              <CardHeader><CardTitle>Подтверждение трюков</CardTitle></CardHeader>
              <CardContent>
                {selectedCharacter ? (
                  <div className="space-y-4">
                    <div className="p-4 bg-purple-50 rounded-lg">
                      <div className="font-bold">{selectedCharacter.name}</div>
                      <div className="text-sm text-gray-600">Виды спорта: {(selectedCharacter.sport_types || [selectedCharacter.sport_type]).map(s => SPORT_NAMES[s as SportType] || s).join(', ')}</div>
                    </div>
                    {selectedTricks.length > 0 && (
                      <Button onClick={handleConfirmTricks} className="w-full bg-green-600 hover:bg-green-700">
                        Подтвердить {selectedTricks.length} трюков
                      </Button>
                    )}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2 max-h-[400px] overflow-y-auto">
                      {characterTricks.map(trick => (
                        <div key={trick.id} onClick={() => toggleTrickSelection(trick.id)}
                          className={`p-3 rounded-lg border-2 cursor-pointer transition-all ${selectedTricks.includes(trick.id) ? 'border-green-500 bg-green-50' : 'border-gray-300 hover:border-purple-300'}`}
                        >
                          <div className="flex items-center justify-between">
                            <div>
                              <div className="font-semibold text-sm">{trick.name}</div>
                              <div className="text-xs text-gray-500">{SPORT_ICONS[trick.sport_type]} {SPORT_NAMES[trick.sport_type]}</div>
                            </div>
                            <div className="text-right">
                              <Badge className={`text-xs ${DIFFICULTY_COLORS[trick.difficulty]}`}>{DIFFICULTY_NAMES[trick.difficulty]}</Badge>
                              <div className="text-xs mt-1">+{trick.experience_reward} XP +{trick.kinetics_reward} 💰</div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : <p className="text-gray-500 text-center py-8">Выберите персонажа</p>}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="training">
            <Card className="bg-white/95">
              <CardHeader><CardTitle>🏋️ Тренировки</CardTitle></CardHeader>
              <CardContent>
                {selectedCharacter ? (
                  <div className="space-y-4">
                    <div className="p-4 bg-purple-50 rounded-lg">
                      <div className="font-bold">{selectedCharacter.name}</div>
                      <div className="text-sm text-gray-600">Всего тренировок: {trainingVisits.length}</div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label>Дата тренировки</Label>
                        <Input type="date" value={trainingDate} onChange={e => setTrainingDate(e.target.value)} />
                      </div>
                      <div>
                        <Label>Заметка (необязательно)</Label>
                        <Input value={trainingNotes} onChange={e => setTrainingNotes(e.target.value)} placeholder="Что делали..." />
                      </div>
                    </div>
                    <Button onClick={handleAddTraining} className="w-full bg-green-600 hover:bg-green-700">
                      Засчитать тренировку
                    </Button>

                    {trainingVisits.length > 0 && (
                      <div className="mt-4">
                        <h4 className="font-semibold mb-2">История тренировок:</h4>
                        <div className="space-y-1 max-h-[200px] overflow-y-auto">
                          {trainingVisits.map(v => (
                            <div key={v.id} className="flex justify-between text-sm p-2 bg-gray-50 rounded">
                              <span className="font-semibold">{new Date(v.visit_date).toLocaleDateString('ru-RU')}</span>
                              <span className="text-gray-500 truncate max-w-[200px]">{v.notes || '-'}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ) : <p className="text-gray-500 text-center py-8">Выберите персонажа</p>}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="settings">
            <Card className="bg-white/95">
              <CardHeader><CardTitle>⚙️ Настройки персонажа</CardTitle></CardHeader>
              <CardContent>
                {selectedCharacter ? (
                  <div className="space-y-6">
                    <div className="p-4 bg-purple-50 rounded-lg">
                      <div className="font-bold text-lg">{selectedCharacter.name}</div>
                      <div className="text-sm text-gray-600">
                        {selectedCharacter.trainer_name && <span>Тренер: {selectedCharacter.trainer_name} | </span>}
                        {selectedCharacter.age && <span>Возраст: {selectedCharacter.age} | </span>}
                        Аккаунт: {selectedCharacter.user_id}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>👨‍🏫 Тренер</Label>
                        <div className="flex gap-2">
                          <Input value={trainerInput} onChange={e => setTrainerInput(e.target.value)} placeholder="Имя тренера" />
                          <Button onClick={handleSetTrainer}>Сохранить</Button>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label>📅 Возраст</Label>
                        <div className="flex gap-2">
                          <Input type="number" min="3" max="99" value={ageInput} onChange={e => setAgeInput(e.target.value)} placeholder="Возраст" />
                          <Button onClick={handleSetAge}>Сохранить</Button>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h4 className="font-semibold mb-2">Информация</h4>
                      <div className="grid grid-cols-2 gap-3 text-sm">
                        <div className="p-3 bg-gray-50 rounded">
                          <span className="text-gray-500">Уровень:</span>
                          <span className="font-bold ml-2">{selectedCharacter.level}</span>
                        </div>
                        <div className="p-3 bg-gray-50 rounded">
                          <span className="text-gray-500">Кинетики:</span>
                          <span className="font-bold ml-2">{selectedCharacter.kinetics}</span>
                        </div>
                        <div className="p-3 bg-gray-50 rounded">
                          <span className="text-gray-500">Спорт:</span>
                          <span className="font-bold ml-2">{(selectedCharacter.sport_types || [selectedCharacter.sport_type]).map(s => SPORT_NAMES[s as SportType] || s).join(', ')}</span>
                        </div>
                        <div className="p-3 bg-gray-50 rounded">
                          <span className="text-gray-500">Аккаунт ID:</span>
                          <span className="font-bold ml-2 text-xs">{selectedCharacter.user_id}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : <p className="text-gray-500 text-center py-8">Выберите персонажа</p>}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="characters">
            <Card className="bg-white/95">
              <CardHeader><CardTitle>👥 Все персонажи</CardTitle></CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {characters.map(char => (
                    <div key={char.id} className="p-4 border rounded-lg flex items-center justify-between cursor-pointer hover:bg-gray-50"
                      onClick={() => setProfileCharId(char.id)}
                    >
                      <div className="flex items-center gap-3">
                        {char.avatar_url && <img src={char.avatar_url} className="w-12 h-12 rounded-full object-cover" alt="" />}
                        <div>
                          <div className="font-bold">{char.name}</div>
                          <div className="text-sm text-gray-600">
                            {(char.sport_types || [char.sport_type]).map((s: string) => `${SPORT_ICONS[s as SportType] || ''} ${SPORT_NAMES[s as SportType] || s}`).join(', ')}
                          </div>
                          <div className="text-xs text-gray-400">
                            {char.trainer_name && `Тренер: ${char.trainer_name} | `}
                            {char.age && `${char.age} лет | `}
                            Аккаунт: {char.user_id}
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <Badge>Уровень {char.level}</Badge>
                        <div className="text-sm mt-1">💰 {char.kinetics}</div>
                        <div className="text-xs text-gray-500">🎮 {char.games_played || 0} игр</div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {profileCharId && (
        <PublicProfileModal characterId={profileCharId} onClose={() => setProfileCharId(null)} />
      )}
    </div>
  );
};

export default KineticAdmin;
