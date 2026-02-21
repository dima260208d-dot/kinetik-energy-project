import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import Icon from '@/components/ui/icon';
import {
  Character, Accessory,
  HAIRSTYLES, HAIR_COLORS, BODY_TYPES, CUSTOMIZATION_PRICES, SPORT_NAMES, SPORT_ICONS, SportType
} from '@/types/kinetic';
import * as api from '@/services/kineticApi';
import { useToast } from '@/hooks/use-toast';

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

interface ShopModalProps {
  show: boolean;
  onClose: () => void;
  character?: Character | null;
  onCharacterUpdate?: (char: Character) => void;
}

const ShopModal = ({ show, onClose, character, onCharacterUpdate }: ShopModalProps) => {
  const { toast } = useToast();
  const [shopTab, setShopTab] = useState<'accessories' | 'customize' | 'sports'>('accessories');
  const [purchasing, setPurchasing] = useState(false);
  const [accessories, setAccessories] = useState<Accessory[]>([]);
  const [ownedItems, setOwnedItems] = useState<Set<string>>(new Set());

  const currentSports = character?.sport_types || [character?.sport_type || 'skate'];

  useEffect(() => {
    if (show && character) {
      api.getAccessories(character.id).then(setAccessories);
      api.getPurchasedItems(character.id).then(items => {
        const set = new Set(items.map((i: { item_type: string; item_value: string }) => `${i.item_type}:${i.item_value}`));
        setOwnedItems(set);
      });
    }
  }, [show, character?.id]);

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

  if (!show) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={onClose}>
      <Card className="max-w-4xl w-full max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-2xl">Магазин</CardTitle>
          <div className="flex items-center gap-3">
            {character && <Badge className="text-lg bg-yellow-100 text-yellow-800 border-yellow-300">{character.kinetics} кинетиков</Badge>}
            <Button variant="ghost" size="icon" onClick={onClose}><Icon name="X" className="w-5 h-5" /></Button>
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
  );
};

export default ShopModal;
