import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';
import { Trick } from '@/types/kinetic';

interface TrickSimulatorProps {
  tricks: Trick[];
  onComplete: (earnedXP: number, earnedKinetics: number) => void;
  onClose: () => void;
}

const TrickSimulator = ({ tricks, onComplete, onClose }: TrickSimulatorProps) => {
  const [currentTrick, setCurrentTrick] = useState<Trick | null>(null);
  const [sequence, setSequence] = useState<string[]>([]);
  const [playerSequence, setPlayerSequence] = useState<string[]>([]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [gameState, setGameState] = useState<'ready' | 'showing' | 'playing' | 'success' | 'fail'>('ready');
  const [score, setScore] = useState(0);
  const [round, setRound] = useState(1);

  const buttons = ['⬆️', '⬇️', '⬅️', '➡️', '🔄'];

  useEffect(() => {
    if (tricks.length > 0) {
      selectRandomTrick();
    }
  }, []);

  const selectRandomTrick = () => {
    const randomTrick = tricks[Math.floor(Math.random() * tricks.length)];
    setCurrentTrick(randomTrick);
  };

  const startGame = () => {
    // Генерируем случайную последовательность кнопок
    const length = Math.min(3 + round, 7);
    const newSequence = Array.from({ length }, () => buttons[Math.floor(Math.random() * buttons.length)]);
    setSequence(newSequence);
    setPlayerSequence([]);
    setGameState('showing');
    showSequence(newSequence);
  };

  const showSequence = async (seq: string[]) => {
    for (let i = 0; i < seq.length; i++) {
      await new Promise(resolve => setTimeout(resolve, 600));
      // Показываем кнопку (подсветка реализована через CSS)
    }
    setGameState('playing');
  };

  const handleButtonClick = (button: string) => {
    if (gameState !== 'playing') return;

    const newPlayerSequence = [...playerSequence, button];
    setPlayerSequence(newPlayerSequence);

    // Проверяем правильность нажатия
    if (button !== sequence[playerSequence.length]) {
      setGameState('fail');
      return;
    }

    // Если последовательность завершена
    if (newPlayerSequence.length === sequence.length) {
      setGameState('success');
      const earnedXP = (currentTrick?.experience_reward || 50) * round;
      const earnedKinetics = (currentTrick?.kinetics_reward || 10) * round;
      setScore(score + earnedXP);
      
      setTimeout(() => {
        setRound(round + 1);
        setGameState('ready');
        selectRandomTrick();
      }, 2000);
    }
  };

  const finishGame = () => {
    const earnedXP = score;
    const earnedKinetics = Math.floor(score / 5);
    onComplete(earnedXP, earnedKinetics);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
      <Card className="max-w-2xl w-full">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>🎯 Трюковой симулятор</CardTitle>
          <Button variant="ghost" size="icon" onClick={finishGame}>
            <Icon name="X" className="w-5 h-5" />
          </Button>
        </CardHeader>
        <CardContent>
          <div className="text-center mb-6">
            <div className="text-sm text-gray-600 mb-2">Раунд {round}</div>
            <div className="text-2xl font-bold mb-2">
              {currentTrick ? currentTrick.name : 'Загрузка...'}
            </div>
            <div className="text-lg text-purple-600">Очки: {score}</div>
          </div>

          {gameState === 'ready' && (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">🎮</div>
              <div className="text-xl font-bold mb-4">Готов повторить трюк?</div>
              <p className="text-gray-600 mb-6">
                Запомни последовательность кнопок и повтори её!
              </p>
              <Button onClick={startGame} size="lg" className="bg-gradient-to-r from-green-600 to-teal-600">
                Начать раунд {round}
              </Button>
            </div>
          )}

          {gameState === 'showing' && (
            <div className="text-center py-12">
              <div className="text-xl font-bold mb-4">Запоминай последовательность!</div>
              <div className="flex justify-center gap-2 mb-6">
                {sequence.map((btn, idx) => (
                  <div
                    key={idx}
                    className={`text-4xl p-4 rounded-lg border-2 ${
                      idx === playerSequence.length ? 'border-yellow-400 bg-yellow-50 animate-pulse' : 'border-gray-300'
                    }`}
                  >
                    {btn}
                  </div>
                ))}
              </div>
            </div>
          )}

          {gameState === 'playing' && (
            <div>
              <div className="text-center mb-6">
                <div className="text-lg mb-4">Повтори последовательность!</div>
                <div className="flex justify-center gap-2 mb-6">
                  {sequence.map((btn, idx) => (
                    <div
                      key={idx}
                      className={`text-3xl p-3 rounded-lg border-2 ${
                        idx < playerSequence.length
                          ? playerSequence[idx] === btn
                            ? 'border-green-400 bg-green-50'
                            : 'border-red-400 bg-red-50'
                          : 'border-gray-300 bg-gray-50'
                      }`}
                    >
                      {idx < playerSequence.length ? playerSequence[idx] : '?'}
                    </div>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-5 gap-3">
                {buttons.map((btn) => (
                  <Button
                    key={btn}
                    onClick={() => handleButtonClick(btn)}
                    className="h-20 text-3xl bg-gradient-to-br from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600"
                  >
                    {btn}
                  </Button>
                ))}
              </div>
            </div>
          )}

          {gameState === 'success' && (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">🎉</div>
              <div className="text-2xl font-bold mb-2 text-green-600">Отлично!</div>
              <p className="text-gray-600">
                +{(currentTrick?.experience_reward || 50) * round} XP
              </p>
            </div>
          )}

          {gameState === 'fail' && (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">😢</div>
              <div className="text-2xl font-bold mb-2 text-red-600">Ошибка!</div>
              <p className="text-gray-600 mb-6">Попробуй снова</p>
              <Button onClick={() => setGameState('ready')} size="lg">
                Попробовать ещё раз
              </Button>
            </div>
          )}

          <div className="mt-6 text-center">
            <Button onClick={finishGame} variant="outline">
              Завершить игру
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default TrickSimulator;
