import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';

interface GamesModalProps {
  show: boolean;
  onClose: () => void;
  setActiveGame: (game: 'simulator' | 'arena' | 'cards' | null) => void;
}

const GamesModal = ({ show, onClose, setActiveGame }: GamesModalProps) => {
  if (!show) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={onClose}>
      <Card className="max-w-4xl w-full max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-2xl">Мини-игры</CardTitle>
          <Button variant="ghost" size="icon" onClick={onClose}><Icon name="X" className="w-5 h-5" /></Button>
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
                  <p className="text-sm text-gray-600 mb-2">{g.desc}</p>
                  <p className="text-sm text-green-600 font-semibold">Награда: {g.reward}</p>
                </div>
                <Button onClick={() => { setActiveGame(g.key); onClose(); }} className={`w-full bg-gradient-to-r ${g.color}`}>
                  <Icon name="Play" className="w-4 h-4 mr-2" />Играть
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default GamesModal;
