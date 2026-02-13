import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import Icon from '@/components/ui/icon';
import { Character, HAIRSTYLES, HAIR_COLORS, BODY_TYPES, CUSTOMIZATION_PRICES, SPORT_NAMES, SportType } from '@/types/kinetic';
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

const KineticModals = ({
  showShop,
  setShowShop,
  showGames,
  setShowGames,
  showTournaments,
  setShowTournaments,
  showPro,
  setShowPro,
  setActiveGame,
  character,
  onCharacterUpdate
}: KineticModalsProps) => {
  const { toast } = useToast();
  const [shopTab, setShopTab] = useState<'items' | 'customize'>('items');
  const [purchasing, setPurchasing] = useState(false);

  const handlePurchase = async (itemType: string, itemValue: string | number, cost: number, label: string) => {
    if (!character) return;
    if (character.kinetics < cost) {
      toast({ title: 'Недостаточно кинетиков', description: `Нужно ${cost}, у вас ${character.kinetics}`, variant: 'destructive' });
      return;
    }
    setPurchasing(true);
    try {
      const result = await api.purchaseCustomization(character.id, itemType, itemValue, cost);
      onCharacterUpdate?.(result.character);
      toast({ title: 'Куплено!', description: `${label} за ${cost} 💰` });
    } catch {
      toast({ title: 'Ошибка', description: 'Не удалось купить', variant: 'destructive' });
    }
    setPurchasing(false);
  };

  return (
    <>
      {showShop && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={() => setShowShop(false)}>
          <Card className="max-w-4xl w-full max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-2xl">✨ Магазин</CardTitle>
              <div className="flex items-center gap-3">
                {character && (
                  <Badge className="text-lg bg-yellow-100 text-yellow-800 border-yellow-300">
                    💰 {character.kinetics}
                  </Badge>
                )}
                <Button variant="ghost" size="icon" onClick={() => setShowShop(false)}>
                  <Icon name="X" className="w-5 h-5" />
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex gap-2 mb-4">
                <Button
                  variant={shopTab === 'items' ? 'default' : 'outline'}
                  onClick={() => setShopTab('items')}
                  size="sm"
                >
                  🛍️ Предметы
                </Button>
                <Button
                  variant={shopTab === 'customize' ? 'default' : 'outline'}
                  onClick={() => setShopTab('customize')}
                  size="sm"
                >
                  ✂️ Изменить персонажа
                </Button>
              </div>

              {shopTab === 'items' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {[
                    { name: 'Крутая кепка', price: 200, icon: '🧢', rarity: 'rare' },
                    { name: 'Стильные кроссовки', price: 500, icon: '👟', rarity: 'epic' },
                    { name: 'Защитный шлем', price: 300, icon: '⛑️', rarity: 'common' },
                    { name: 'Граффити доска', price: 1000, icon: '🎨', rarity: 'legendary' },
                    { name: 'Бустер опыта x2', price: 150, icon: '⚡', rarity: 'rare' },
                    { name: 'Аура неона', price: 750, icon: '💫', rarity: 'epic' },
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
                      <Button className="w-full" size="sm" disabled>
                        Купить за {item.price} 💰 (скоро)
                      </Button>
                    </div>
                  ))}
                </div>
              )}

              {shopTab === 'customize' && character && (
                <div className="space-y-6">
                  <div>
                    <h3 className="font-bold text-lg mb-3">💇 Сменить причёску — {CUSTOMIZATION_PRICES.hairstyle} 💰</h3>
                    <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
                      {HAIRSTYLES.map(h => (
                        <button
                          key={h.id}
                          disabled={character.hairstyle === h.id || purchasing}
                          onClick={() => handlePurchase('hairstyle', h.id, CUSTOMIZATION_PRICES.hairstyle, h.name)}
                          className={`p-3 rounded-lg border-2 text-sm transition-all ${
                            character.hairstyle === h.id
                              ? 'border-green-500 bg-green-50 opacity-60'
                              : 'border-gray-300 hover:border-purple-400 hover:bg-purple-50'
                          }`}
                        >
                          <div className="text-2xl mb-1">💇</div>
                          <div className="font-semibold text-xs">{h.name}</div>
                          {character.hairstyle === h.id && <div className="text-xs text-green-600">Текущая</div>}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h3 className="font-bold text-lg mb-3">🎨 Сменить цвет волос — {CUSTOMIZATION_PRICES.hair_color} 💰</h3>
                    <div className="grid grid-cols-5 md:grid-cols-8 gap-2">
                      {HAIR_COLORS.map(c => (
                        <button
                          key={c.value}
                          disabled={character.hair_color === c.value || purchasing}
                          onClick={() => handlePurchase('hair_color', c.value, CUSTOMIZATION_PRICES.hair_color, c.name)}
                          className={`p-2 rounded-lg border-2 text-center transition-all ${
                            character.hair_color === c.value
                              ? 'border-green-500 ring-2 ring-green-300'
                              : 'border-gray-300 hover:border-purple-400'
                          }`}
                        >
                          <div
                            className="w-8 h-8 rounded-full mx-auto border-2 border-gray-200"
                            style={{ backgroundColor: c.value }}
                          />
                          <div className="text-[10px] mt-1 truncate">{c.name}</div>
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h3 className="font-bold text-lg mb-3">🏋️ Сменить телосложение — {CUSTOMIZATION_PRICES.body_type} 💰</h3>
                    <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
                      {BODY_TYPES.map(b => (
                        <button
                          key={b.id}
                          disabled={character.body_type === b.id || purchasing}
                          onClick={() => handlePurchase('body_type', b.id, CUSTOMIZATION_PRICES.body_type, b.name)}
                          className={`p-3 rounded-lg border-2 text-sm transition-all ${
                            character.body_type === b.id
                              ? 'border-green-500 bg-green-50 opacity-60'
                              : 'border-gray-300 hover:border-purple-400 hover:bg-purple-50'
                          }`}
                        >
                          <div className="text-2xl mb-1">🏋️</div>
                          <div className="font-semibold text-xs">{b.name}</div>
                          <div className="text-[10px] text-gray-500">{b.description}</div>
                          {character.body_type === b.id && <div className="text-xs text-green-600">Текущий</div>}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h3 className="font-bold text-lg mb-3">🔄 Сменить вид спорта — {CUSTOMIZATION_PRICES.sport_type} 💰</h3>
                    <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
                      {(Object.entries(SPORT_NAMES) as [SportType, string][]).map(([sport, name]) => (
                        <button
                          key={sport}
                          disabled={character.sport_type === sport || purchasing}
                          onClick={() => handlePurchase('sport_type', sport, CUSTOMIZATION_PRICES.sport_type, name)}
                          className={`p-3 rounded-lg border-2 text-sm transition-all ${
                            character.sport_type === sport
                              ? 'border-green-500 bg-green-50 opacity-60'
                              : 'border-gray-300 hover:border-purple-400 hover:bg-purple-50'
                          }`}
                        >
                          <div className="text-3xl mb-1">
                            {sport === 'skate' ? '🛹' : sport === 'rollers' ? '🛼' : sport === 'bmx' ? '🚴‍♂️' : sport === 'scooter' ? '🛴' : '🚲'}
                          </div>
                          <div className="font-semibold text-xs">{name}</div>
                          {character.sport_type === sport && <div className="text-xs text-green-600">Текущий</div>}
                        </button>
                      ))}
                    </div>
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
              <CardTitle className="text-2xl">🎮 Мини-игры</CardTitle>
              <Button variant="ghost" size="icon" onClick={() => setShowGames(false)}>
                <Icon name="X" className="w-5 h-5" />
              </Button>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-6 bg-gradient-to-br from-green-50 to-teal-50 rounded-lg border-2 border-green-300 hover:border-green-500 transition-all">
                  <div className="text-center mb-4">
                    <div className="text-6xl mb-2">🎯</div>
                    <div className="font-bold text-lg">Трюковой симулятор</div>
                    <p className="text-sm text-gray-600">Повтори последовательность кнопок</p>
                  </div>
                  <div className="text-center text-sm text-green-600 mb-3">
                    Награда: XP + 💰
                  </div>
                  <Button onClick={() => { setActiveGame('simulator'); setShowGames(false); }} className="w-full bg-gradient-to-r from-green-600 to-teal-600">
                    <Icon name="Play" className="w-4 h-4 mr-2" />
                    Играть
                  </Button>
                </div>

                <div className="p-6 bg-gradient-to-br from-orange-50 to-red-50 rounded-lg border-2 border-orange-300 hover:border-orange-500 transition-all">
                  <div className="text-center mb-4">
                    <div className="text-6xl mb-2">⚔️</div>
                    <div className="font-bold text-lg">Турнирная арена</div>
                    <p className="text-sm text-gray-600">Сражайся 1 на 1</p>
                  </div>
                  <div className="text-center text-sm text-orange-600 mb-3">
                    Победа: +50 XP, +100 💰
                  </div>
                  <Button onClick={() => { setActiveGame('arena'); setShowGames(false); }} className="w-full bg-gradient-to-r from-orange-600 to-red-600">
                    <Icon name="Play" className="w-4 h-4 mr-2" />
                    Играть
                  </Button>
                </div>

                <div className="p-6 bg-gradient-to-br from-purple-50 to-pink-50 rounded-lg border-2 border-purple-300 hover:border-purple-500 transition-all">
                  <div className="text-center mb-4">
                    <div className="text-6xl mb-2">🃏</div>
                    <div className="font-bold text-lg">Карточная битва</div>
                    <p className="text-sm text-gray-600">Используй карты трюков</p>
                  </div>
                  <div className="text-center text-sm text-purple-600 mb-3">
                    Победа: +40 XP, +80 💰
                  </div>
                  <Button onClick={() => { setActiveGame('cards'); setShowGames(false); }} className="w-full bg-gradient-to-r from-purple-600 to-pink-600">
                    <Icon name="Play" className="w-4 h-4 mr-2" />
                    Играть
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

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
                  <Button className="w-full bg-gradient-to-r from-orange-600 to-red-600" disabled>
                    Скоро
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {showPro && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={() => setShowPro(false)}>
          <Card className="max-w-2xl w-full" onClick={(e) => e.stopPropagation()}>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-2xl">👑 PRO подписка</CardTitle>
              <Button variant="ghost" size="icon" onClick={() => setShowPro(false)}>
                <Icon name="X" className="w-5 h-5" />
              </Button>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <div className="text-6xl mb-4">👑</div>
                <h3 className="text-2xl font-bold mb-4">PRO статус</h3>
                <div className="space-y-2 text-left max-w-md mx-auto mb-6">
                  <div className="flex items-center gap-2">
                    <Icon name="Check" className="w-5 h-5 text-green-600" />
                    <span>Двойной опыт за игры</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Icon name="Check" className="w-5 h-5 text-green-600" />
                    <span>Эксклюзивные предметы</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Icon name="Check" className="w-5 h-5 text-green-600" />
                    <span>Уникальная рамка аватара</span>
                  </div>
                </div>
                <Button disabled className="bg-gradient-to-r from-yellow-500 to-orange-500">
                  Скоро
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </>
  );
};

export default KineticModals;
