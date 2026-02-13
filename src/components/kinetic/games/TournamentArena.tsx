import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';
import { Trick, Character } from '@/types/kinetic';

interface TournamentArenaProps {
  tricks: Trick[];
  character: Character;
  onComplete: (earnedXP: number, earnedKinetics: number, won: boolean) => void;
  onClose: () => void;
}

const TournamentArena = ({ tricks, character, onComplete, onClose }: TournamentArenaProps) => {
  const [gameState, setGameState] = useState<'prepare' | 'battle' | 'result'>('prepare');
  const [playerScore, setPlayerScore] = useState(0);
  const [opponentScore, setOpponentScore] = useState(0);
  const [round, setRound] = useState(1);
  const [selectedTrick, setSelectedTrick] = useState<Trick | null>(null);
  const [opponentTrick, setOpponentTrick] = useState<Trick | null>(null);
  const playerTricks = tricks.length > 0 ? tricks.slice(0, Math.min(5, tricks.length)) : [];

  const opponentName = 'Макс Скейтер';

  const handleTrickSelect = (trick: Trick) => {
    setSelectedTrick(trick);
    const randomOpponentTrick = tricks[Math.floor(Math.random() * tricks.length)];
    setOpponentTrick(randomOpponentTrick);
    setGameState('battle');

    setTimeout(() => {
      const playerPoints = trick.experience_reward;
      const opponentPoints = randomOpponentTrick.experience_reward;

      let newPlayerScore = playerScore;
      let newOpponentScore = opponentScore;

      if (playerPoints > opponentPoints) {
        newPlayerScore = playerScore + 1;
        setPlayerScore(newPlayerScore);
      } else if (opponentPoints > playerPoints) {
        newOpponentScore = opponentScore + 1;
        setOpponentScore(newOpponentScore);
      }

      if (round >= 3) {
        setTimeout(() => {
          setGameState('result');
        }, 1500);
      } else {
        setTimeout(() => {
          setRound(round + 1);
          setGameState('prepare');
          setSelectedTrick(null);
          setOpponentTrick(null);
        }, 1500);
      }
    }, 2000);
  };

  const finishGame = () => {
    const won = playerScore > opponentScore;
    const earnedXP = won ? 50 : 20;
    const earnedKinetics = won ? 100 : 50;
    onComplete(earnedXP, earnedKinetics, won);
  };

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
      <Card className="max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>⚔️ Турнирная арена</CardTitle>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <Icon name="X" className="w-5 h-5" />
          </Button>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-4 mb-6">
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <div className="font-bold text-lg">{character.name}</div>
              <div className="text-4xl font-bold text-blue-600">{playerScore}</div>
            </div>
            <div className="flex items-center justify-center text-2xl font-bold">
              VS
            </div>
            <div className="text-center p-4 bg-red-50 rounded-lg">
              <div className="font-bold text-lg">{opponentName}</div>
              <div className="text-4xl font-bold text-red-600">{opponentScore}</div>
            </div>
          </div>

          <div className="text-center mb-6">
            <div className="text-xl font-bold">Раунд {round}/3</div>
          </div>

          {gameState === 'prepare' && (
            <div>
              <div className="text-center mb-6">
                <div className="text-lg font-bold mb-2">Выбери свой трюк!</div>
                <p className="text-sm text-gray-600">Чем сложнее трюк, тем больше очков</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {playerTricks.map((trick) => (
                  <button
                    key={trick.id}
                    onClick={() => handleTrickSelect(trick)}
                    className="p-4 border-2 border-purple-300 rounded-lg hover:border-purple-500 hover:bg-purple-50 transition-all text-left"
                  >
                    <div className="font-bold text-lg mb-1">{trick.name}</div>
                    <div className="text-sm text-gray-600 mb-2">{trick.description}</div>
                    <div className="flex justify-between items-center">
                      <span className="text-xs bg-purple-100 px-2 py-1 rounded">{trick.difficulty}</span>
                      <span className="font-bold text-purple-600">+{trick.experience_reward} очков</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {gameState === 'battle' && (
            <div className="text-center py-12">
              <div className="text-6xl mb-6 animate-bounce">⚔️</div>
              <div className="text-2xl font-bold mb-8">Битва трюков!</div>

              <div className="grid grid-cols-2 gap-6 max-w-2xl mx-auto">
                <div className="p-6 bg-blue-50 rounded-lg border-2 border-blue-300">
                  <div className="font-bold mb-2">{character.name}</div>
                  <div className="text-2xl mb-2">{selectedTrick?.name}</div>
                  <div className="text-3xl font-bold text-blue-600">
                    {selectedTrick?.experience_reward}
                  </div>
                </div>

                <div className="p-6 bg-red-50 rounded-lg border-2 border-red-300">
                  <div className="font-bold mb-2">{opponentName}</div>
                  <div className="text-2xl mb-2">{opponentTrick?.name}</div>
                  <div className="text-3xl font-bold text-red-600">
                    {opponentTrick?.experience_reward}
                  </div>
                </div>
              </div>
            </div>
          )}

          {gameState === 'result' && (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">
                {playerScore > opponentScore ? '🏆' : playerScore < opponentScore ? '😢' : '🤝'}
              </div>
              <div className="text-3xl font-bold mb-4">
                {playerScore > opponentScore ? 'Победа!' : playerScore < opponentScore ? 'Поражение' : 'Ничья'}
              </div>
              <div className="text-xl mb-6">
                Итоговый счёт: {playerScore} - {opponentScore}
              </div>
              <div className="mb-6">
                <p className="text-gray-600">
                  Награда: +{playerScore > opponentScore ? 50 : 20} XP, +{playerScore > opponentScore ? 100 : 50} 💰
                </p>
              </div>
              <Button onClick={finishGame} size="lg" className="bg-gradient-to-r from-green-600 to-teal-600">
                Забрать награду
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default TournamentArena;
