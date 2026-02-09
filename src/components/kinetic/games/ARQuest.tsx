import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import Icon from '@/components/ui/icon';

interface ARQuestProps {
  onComplete: (earnedKinetics: number) => void;
  onClose: () => void;
}

const ARQuest = ({ onComplete, onClose }: ARQuestProps) => {
  const [gameState, setGameState] = useState<'intro' | 'scanning' | 'found' | 'complete'>('intro');
  const [code, setCode] = useState('');
  const [foundArtifacts, setFoundArtifacts] = useState(0);
  const [currentLocation, setCurrentLocation] = useState(0);

  const locations = [
    { name: 'Рампа', code: 'RAMP2025', artifact: '🏔️ Золотая рампа', reward: 20 },
    { name: 'Зона для скейтов', code: 'SKATE2025', artifact: '🛹 Легендарный скейт', reward: 25 },
    { name: 'Батутная зона', code: 'JUMP2025', artifact: '🦘 Прыжковый значок', reward: 20 },
    { name: 'Зона отдыха', code: 'REST2025', artifact: '⭐ Звезда энергии', reward: 15 },
    { name: 'Ресепшн', code: 'HELLO2025', artifact: '👑 Корона чемпиона', reward: 30 }
  ];

  const handleCodeSubmit = () => {
    const location = locations[currentLocation];
    
    if (code.toUpperCase() === location.code) {
      setGameState('found');
      setFoundArtifacts(foundArtifacts + 1);
      
      setTimeout(() => {
        if (currentLocation < locations.length - 1) {
          setCurrentLocation(currentLocation + 1);
          setGameState('scanning');
          setCode('');
        } else {
          setGameState('complete');
        }
      }, 3000);
    } else {
      alert('Неправильный код! Попробуй ещё раз');
    }
  };

  const finishQuest = () => {
    const totalReward = locations.slice(0, foundArtifacts).reduce((sum, loc) => sum + loc.reward, 0);
    onComplete(totalReward);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
      <Card className="max-w-2xl w-full">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>📱 AR-квесты</CardTitle>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <Icon name="X" className="w-5 h-5" />
          </Button>
        </CardHeader>
        <CardContent>
          {gameState === 'intro' && (
            <div className="text-center py-8">
              <div className="text-6xl mb-6">📱</div>
              <div className="text-2xl font-bold mb-4">Добро пожаловать в AR-квест!</div>
              <p className="text-gray-600 mb-6 max-w-md mx-auto">
                Исследуй клуб Kinetic Kids и находи QR-коды в разных зонах. 
                Сканируй их и собери все артефакты!
              </p>
              <div className="mb-6">
                <div className="text-sm text-gray-600 mb-2">Найдено артефактов:</div>
                <div className="text-3xl font-bold text-purple-600">{foundArtifacts}/{locations.length}</div>
              </div>
              <Button onClick={() => setGameState('scanning')} size="lg" className="bg-gradient-to-r from-blue-600 to-purple-600">
                Начать квест
              </Button>
            </div>
          )}

          {gameState === 'scanning' && (
            <div className="py-6">
              <div className="text-center mb-6">
                <div className="text-lg font-bold mb-2">
                  Локация {currentLocation + 1}/{locations.length}
                </div>
                <div className="text-2xl font-bold text-purple-600 mb-4">
                  📍 {locations[currentLocation].name}
                </div>
              </div>

              <div className="mb-6 p-6 bg-gradient-to-br from-blue-50 to-purple-50 rounded-lg border-2 border-purple-300">
                <div className="text-center mb-4">
                  <div className="text-6xl mb-4 animate-pulse">📷</div>
                  <p className="text-gray-600">Найди QR-код в зоне "{locations[currentLocation].name}"</p>
                </div>
              </div>

              <div className="mb-4">
                <div className="text-sm text-gray-600 mb-2">Введи код с QR-кода:</div>
                <Input
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  placeholder="Например: RAMP2025"
                  className="text-lg text-center uppercase"
                  maxLength={10}
                />
              </div>

              <Button 
                onClick={handleCodeSubmit} 
                className="w-full" 
                size="lg"
                disabled={code.length < 4}
              >
                Проверить код
              </Button>

              <div className="mt-4 text-center text-sm text-gray-500">
                <p>💡 Подсказка: Коды находятся на стенах в каждой зоне клуба</p>
              </div>
            </div>
          )}

          {gameState === 'found' && (
            <div className="text-center py-12">
              <div className="text-6xl mb-4 animate-bounce">✨</div>
              <div className="text-3xl font-bold mb-4 text-green-600">Артефакт найден!</div>
              <div className="text-5xl mb-4">{locations[currentLocation].artifact}</div>
              <div className="text-xl text-purple-600 mb-2">
                +{locations[currentLocation].reward} 💰
              </div>
              <p className="text-gray-600">
                Найдено {foundArtifacts}/{locations.length} артефактов
              </p>
            </div>
          )}

          {gameState === 'complete' && (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">🎉</div>
              <div className="text-3xl font-bold mb-4 text-purple-600">Квест завершён!</div>
              <div className="text-xl mb-6">
                Ты собрал все {foundArtifacts} артефактов!
              </div>
              <div className="mb-6">
                <div className="text-sm text-gray-600 mb-2">Твои артефакты:</div>
                <div className="flex flex-wrap justify-center gap-2 mb-4">
                  {locations.map((loc, idx) => (
                    <div key={idx} className="text-3xl">
                      {loc.artifact}
                    </div>
                  ))}
                </div>
                <div className="text-2xl font-bold text-green-600">
                  Общая награда: +{locations.reduce((sum, loc) => sum + loc.reward, 0)} 💰
                </div>
              </div>
              <Button onClick={finishQuest} size="lg" className="bg-gradient-to-r from-green-600 to-teal-600">
                Забрать награду
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ARQuest;
