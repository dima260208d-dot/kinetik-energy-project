import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import Icon from '@/components/ui/icon';

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
  setActiveGame
}: KineticModalsProps) => {
  return (
    <>
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
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-6 bg-gradient-to-br from-green-50 to-teal-50 rounded-lg border-2 border-green-300 hover:border-green-500 transition-all">
                  <div className="text-center mb-4">
                    <div className="text-6xl mb-2">🎯</div>
                    <div className="font-bold text-lg">Трюковой симулятор</div>
                    <p className="text-sm text-gray-600">Повтори последовательность кнопок</p>
                  </div>
                  <div className="text-center text-sm text-green-600 mb-3">
                    Награда: +50 XP
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
                    Награда: +100 💰
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
                    Награда: +80 💰
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
    </>
  );
};

export default KineticModals;