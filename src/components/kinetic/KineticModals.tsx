import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import Icon from '@/components/ui/icon';
import {
  Character, Accessory, Tournament, TournamentEntry, LeaderboardEntry, PublicProfile,
  HAIRSTYLES, HAIR_COLORS, BODY_TYPES, CUSTOMIZATION_PRICES, SPORT_NAMES, SPORT_ICONS, SportType
} from '@/types/kinetic';
import * as api from '@/services/kineticApi';
import { useToast } from '@/hooks/use-toast';

interface KineticModalsProps {
  showShop: boolean;
  setShowShop: (show: boolean) => void;
  showGames: boolean;
  setShowGames: (show: boolean) => void;
  showTournaments: boolean;
  setShowTournaments: (show: boolean) => void;
  showPro: boolean;
  setShowPro: (show: boolean) => void;
  setActiveGame: (game: 'simulator' | 'arena' | 'cards' | null) => void;
  character?: Character | null;
  onCharacterUpdate?: (char: Character) => void;
}

const RARITY_COLORS: Record<string, string> = {
  legendary: 'bg-orange-500 text-white',
  epic: 'bg-purple-500 text-white',
  rare: 'bg-blue-500 text-white',
  common: 'bg-gray-500 text-white',
};
const RARITY_NAMES: Record<string, string> = {
  legendary: 'Легендарный',
  epic: 'Эпический',
  rare: 'Редкий',
  common: 'Обычный',
};

const KineticModals = ({
  showShop, setShowShop, showGames, setShowGames,
  showTournaments, setShowTournaments, showPro, setShowPro,
  setActiveGame, character, onCharacterUpdate
}: KineticModalsProps) => {
  const { toast } = useToast();
  const [shopTab, setShopTab] = useState<'accessories' | 'customize' | 'sports'>('accessories');
  const [purchasing, setPurchasing] = useState(false);
  const [accessories, setAccessories] = useState<Accessory[]>([]);
  const [ownedItems, setOwnedItems] = useState<Set<string>>(new Set());
  const [tournament, setTournament] = useState<Tournament | null>(null);
  const [entries, setEntries] = useState<TournamentEntry[]>([]);
  const [leaderTab, setLeaderTab] = useState<'weekly' | 'monthly'>('weekly');
  const [leaders, setLeaders] = useState<LeaderboardEntry[]>([]);
  const [profileChar, setProfileChar] = useState<PublicProfile | null>(null);
  const [showProfile, setShowProfile] = useState(false);

  useEffect(() => {
    if (showShop && character) {
      api.getAccessories(character.id).then(setAccessories);
      api.getPurchasedItems(character.id).then(items => {
        const set = new Set(items.map((i: { item_type: string; item_value: string }) => `${i.item_type}:${i.item_value}`));
        setOwnedItems(set);
      });
    }
  }, [showShop, character?.id]);

  useEffect(() => {
    if (showTournaments) {
      api.getCurrentTournament().then(d => {
        setTournament(d.tournament);
        setEntries(d.entries);
      });
      api.getLeaderboard(leaderTab).then(setLeaders);
    }
  }, [showTournaments, leaderTab]);

  const isOwned = (type: string, value: string | number) => ownedItems.has(`${type}:${value}`);

  const handlePurchase = async (itemType: string, itemValue: string | number, cost: number, label: string) => {
    if (!character) return;
    const owned = isOwned(itemType, itemValue);
    if (!owned && character.kinetics < cost) {
      toast({ title: 'Недостаточно кинетиков', description: `Нужно ${cost}, у вас ${character.kinetics}`, variant: 'destructive' });
      return;
    }
    setPurchasing(true);
    try {
      const result = await api.purchaseCustomization(character.id, itemType, itemValue, cost);
      onCharacterUpdate?.(result.character);
      if (result.was_free) {
        toast({ title: 'Применено!', description: `${label} (уже куплено)` });
      } else {
        toast({ title: 'Куплено и применено!', description: `${label} за ${cost} кинетиков` });
        setOwnedItems(prev => new Set(prev).add(`${itemType}:${itemValue}`));
      }
    } catch {
      toast({ title: 'Ошибка', description: 'Не удалось купить', variant: 'destructive' });
    }
    setPurchasing(false);
  };

  const handleBuyAccessory = async (acc: Accessory) => {
    if (!character) return;
    if (acc.owned) {
      toast({ title: 'Уже куплено', description: `${acc.name} уже у вас!` });
      return;
    }
    if (character.kinetics < acc.price) {
      toast({ title: 'Недостаточно кинетиков', description: `Нужно ${acc.price}, у вас ${character.kinetics}`, variant: 'destructive' });
      return;
    }
    setPurchasing(true);
    try {
      const result = await api.buyAccessory(character.id, acc.id);
      onCharacterUpdate?.(result.character);
      setAccessories(prev => prev.map(a => a.id === acc.id ? { ...a, owned: true } : a));
      toast({ title: `${acc.name} куплено!`, description: `За ${acc.price} кинетиков` });
    } catch {
      toast({ title: 'Ошибка', description: 'Не удалось купить', variant: 'destructive' });
    }
    setPurchasing(false);
  };

  const handleAddSport = async (sport: SportType) => {
    if (!character) return;
    const cost = CUSTOMIZATION_PRICES.sport_type;
    if (character.kinetics < cost) {
      toast({ title: 'Недостаточно кинетиков', description: `Нужно ${cost}, у вас ${character.kinetics}`, variant: 'destructive' });
      return;
    }
    setPurchasing(true);
    try {
      const result = await api.addSport(character.id, sport, cost);
      onCharacterUpdate?.(result.character);
      toast({ title: 'Новый спорт добавлен!', description: `${SPORT_NAMES[sport]} за ${cost} кинетиков. Новые трюки уже ждут!` });
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : '';
      if (msg.includes('sport_already_added')) {
        toast({ title: 'Уже добавлен', description: 'Этот вид спорта уже есть' });
      } else {
        toast({ title: 'Ошибка', description: 'Не удалось добавить спорт', variant: 'destructive' });
      }
    }
    setPurchasing(false);
  };

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

  const formatDate = (d: string) => new Date(d).toLocaleDateString('ru-RU');

  const myEntry = entries.find(e => e.character_id === character?.id);
  const currentSports = character?.sport_types || [character?.sport_type || 'skate'];

  return (
    <>
      {showShop && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={() => setShowShop(false)}>
          <Card className="max-w-4xl w-full max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-2xl">Магазин</CardTitle>
              <div className="flex items-center gap-3">
                {character && <Badge className="text-lg bg-yellow-100 text-yellow-800 border-yellow-300">{character.kinetics} кинетиков</Badge>}
                <Button variant="ghost" size="icon" onClick={() => setShowShop(false)}><Icon name="X" className="w-5 h-5" /></Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex gap-2 mb-4">
                <Button variant={shopTab === 'accessories' ? 'default' : 'outline'} onClick={() => setShopTab('accessories')} size="sm">🎒 Аксессуары</Button>
                <Button variant={shopTab === 'customize' ? 'default' : 'outline'} onClick={() => setShopTab('customize')} size="sm">✂️ Изменить персонажа</Button>
                <Button variant={shopTab === 'sports' ? 'default' : 'outline'} onClick={() => setShopTab('sports')} size="sm">🏆 Добавить спорт</Button>
              </div>

              {shopTab === 'accessories' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {accessories.map(acc => (
                    <div key={acc.id} className={`p-4 border-2 rounded-lg transition-all ${acc.owned ? 'border-green-400 bg-green-50' : 'border-purple-300 hover:border-purple-500'}`}>
                      <div className="text-center mb-3">
                        <div className="text-5xl mb-2">{acc.icon}</div>
                        <div className="font-bold">{acc.name}</div>
                        {acc.description && <div className="text-xs text-gray-500">{acc.description}</div>}
                        <Badge className={RARITY_COLORS[acc.rarity] || 'bg-gray-500 text-white'}>{RARITY_NAMES[acc.rarity] || acc.rarity}</Badge>
                      </div>
                      {acc.owned ? (
                        <Button className="w-full bg-green-600" size="sm" disabled>Куплено</Button>
                      ) : (
                        <Button className="w-full" size="sm" disabled={purchasing} onClick={() => handleBuyAccessory(acc)}>
                          Купить за {acc.price} кинетиков
                        </Button>
                      )}
                    </div>
                  ))}
                  {accessories.length === 0 && <p className="text-gray-500 text-center col-span-2 py-8">Загрузка...</p>}
                </div>
              )}

              {shopTab === 'customize' && character && (
                <div className="space-y-6">
                  <div>
                    <h3 className="font-bold text-lg mb-3">💇 Причёска — {CUSTOMIZATION_PRICES.hairstyle} кинетиков</h3>
                    <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
                      {HAIRSTYLES.map(h => {
                        const owned = isOwned('hairstyle', h.id);
                        const active = character.hairstyle === h.id;
                        return (
                          <button key={h.id} disabled={active || purchasing}
                            onClick={() => handlePurchase('hairstyle', h.id, CUSTOMIZATION_PRICES.hairstyle, h.name)}
                            className={`p-3 rounded-lg border-2 text-sm transition-all ${active ? 'border-green-500 bg-green-50 opacity-60' : owned ? 'border-blue-400 bg-blue-50 hover:border-blue-500' : 'border-gray-300 hover:border-purple-400 hover:bg-purple-50'}`}>
                            <div className="text-2xl mb-1">💇</div>
                            <div className="font-semibold text-xs">{h.name}</div>
                            {active && <div className="text-xs text-green-600">Текущая</div>}
                            {owned && !active && <div className="text-xs text-blue-600">Куплено</div>}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  <div>
                    <h3 className="font-bold text-lg mb-3">🎨 Цвет волос — {CUSTOMIZATION_PRICES.hair_color} кинетиков</h3>
                    <div className="grid grid-cols-5 md:grid-cols-8 gap-2">
                      {HAIR_COLORS.map(c => {
                        const owned = isOwned('hair_color', c.value);
                        const active = character.hair_color === c.value;
                        return (
                          <button key={c.value} disabled={active || purchasing}
                            onClick={() => handlePurchase('hair_color', c.value, CUSTOMIZATION_PRICES.hair_color, c.name)}
                            className={`p-2 rounded-lg border-2 text-center transition-all ${active ? 'border-green-500 ring-2 ring-green-300' : owned ? 'border-blue-400 ring-1 ring-blue-200' : 'border-gray-300 hover:border-purple-400'}`}>
                            <div className="w-8 h-8 rounded-full mx-auto border-2 border-gray-200" style={{ backgroundColor: c.value }} />
                            <div className="text-[10px] mt-1 truncate">{c.name}</div>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  <div>
                    <h3 className="font-bold text-lg mb-3">🏋️ Телосложение — {CUSTOMIZATION_PRICES.body_type} кинетиков</h3>
                    <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
                      {BODY_TYPES.map(b => {
                        const owned = isOwned('body_type', b.id);
                        const active = character.body_type === b.id;
                        return (
                          <button key={b.id} disabled={active || purchasing}
                            onClick={() => handlePurchase('body_type', b.id, CUSTOMIZATION_PRICES.body_type, b.name)}
                            className={`p-3 rounded-lg border-2 text-sm transition-all ${active ? 'border-green-500 bg-green-50 opacity-60' : owned ? 'border-blue-400 bg-blue-50' : 'border-gray-300 hover:border-purple-400 hover:bg-purple-50'}`}>
                            <div className="text-2xl mb-1">🏋️</div>
                            <div className="font-semibold text-xs">{b.name}</div>
                            <div className="text-[10px] text-gray-500">{b.description}</div>
                            {active && <div className="text-xs text-green-600">Текущий</div>}
                            {owned && !active && <div className="text-xs text-blue-600">Куплено</div>}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                  <p className="text-xs text-gray-500 text-center">Купленные варианты можно переключать бесплатно</p>
                </div>
              )}

              {shopTab === 'sports' && character && (
                <div>
                  <p className="text-sm text-gray-600 mb-4">Добавьте новый вид спорта к уже имеющимся. Старые трюки сохранятся, а новые трюки станут доступны в паспорте.</p>
                  <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                    {(Object.entries(SPORT_NAMES) as [SportType, string][]).map(([sport, name]) => {
                      const has = currentSports.includes(sport);
                      return (
                        <button key={sport} disabled={has || purchasing}
                          onClick={() => handleAddSport(sport)}
                          className={`p-4 rounded-lg border-2 text-sm transition-all ${has ? 'border-green-500 bg-green-50 opacity-60' : 'border-gray-300 hover:border-purple-400 hover:bg-purple-50'}`}>
                          <div className="text-3xl mb-1">{SPORT_ICONS[sport]}</div>
                          <div className="font-semibold text-xs">{name}</div>
                          {has ? <div className="text-xs text-green-600 mt-1">Есть</div> : <div className="text-xs text-gray-500 mt-1">{CUSTOMIZATION_PRICES.sport_type} кинетиков</div>}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      )}

      {showGames && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={() => setShowGames(false)}>
          <Card className="max-w-4xl w-full max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-2xl">Мини-игры</CardTitle>
              <Button variant="ghost" size="icon" onClick={() => setShowGames(false)}><Icon name="X" className="w-5 h-5" /></Button>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {[
                  { key: 'simulator' as const, icon: '🎯', name: 'Трюковой симулятор', desc: 'Повтори последовательность кнопок', reward: 'XP + кинетики', color: 'from-green-600 to-teal-600' },
                  { key: 'arena' as const, icon: '⚔️', name: 'Турнирная арена', desc: 'Сражайся 1 на 1', reward: '+50 XP, +100 кинетиков', color: 'from-orange-600 to-red-600' },
                  { key: 'cards' as const, icon: '🃏', name: 'Карточная битва', desc: 'Используй карты трюков', reward: '+40 XP, +80 кинетиков', color: 'from-purple-600 to-pink-600' },
                ].map(g => (
                  <div key={g.key} className="p-6 bg-gradient-to-br from-gray-50 to-white rounded-lg border-2 border-gray-200 hover:border-gray-400 transition-all">
                    <div className="text-center mb-4">
                      <div className="text-6xl mb-2">{g.icon}</div>
                      <div className="font-bold text-lg">{g.name}</div>
                      <p className="text-sm text-gray-600">{g.desc}</p>
                    </div>
                    <div className="text-center text-sm text-green-600 mb-3">Награда: {g.reward}</div>
                    <Button onClick={() => { setActiveGame(g.key); setShowGames(false); }} className={`w-full bg-gradient-to-r ${g.color}`}>
                      <Icon name="Play" className="w-4 h-4 mr-2" />Играть
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {showTournaments && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={() => setShowTournaments(false)}>
          <Card className="max-w-3xl w-full max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-2xl">Турниры и лидерборды</CardTitle>
              <Button variant="ghost" size="icon" onClick={() => setShowTournaments(false)}><Icon name="X" className="w-5 h-5" /></Button>
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
      )}

      {showPro && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={() => setShowPro(false)}>
          <Card className="max-w-2xl w-full" onClick={(e) => e.stopPropagation()}>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-2xl">PRO подписка</CardTitle>
              <Button variant="ghost" size="icon" onClick={() => setShowPro(false)}><Icon name="X" className="w-5 h-5" /></Button>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <div className="text-6xl mb-4">👑</div>
                <h3 className="text-2xl font-bold mb-2">PRO-статус</h3>
                <p className="text-gray-600 mb-6">Двойной опыт, эксклюзивные предметы, VIP-доступ к турнирам</p>
                <Button size="lg" disabled className="bg-gradient-to-r from-yellow-500 to-orange-500">Скоро</Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

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

export default KineticModals;
