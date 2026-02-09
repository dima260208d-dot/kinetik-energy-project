import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';
import { Trick, DIFFICULTY_NAMES, DIFFICULTY_COLORS } from '@/types/kinetic';
import { Badge } from '@/components/ui/badge';

interface CardBattleProps {
  tricks: Trick[];
  onComplete: (earnedKinetics: number) => void;
  onClose: () => void;
}

const CardBattle = ({ tricks, onComplete, onClose }: CardBattleProps) => {
  const [gameState, setGameState] = useState<'playing' | 'result'>('playing');
  const [playerHand, setPlayerHand] = useState<Trick[]>(getRandomCards(5));
  const [opponentHand] = useState<Trick[]>(getRandomCards(5));
  const [playerField, setPlayerField] = useState<Trick | null>(null);
  const [opponentField, setOpponentField] = useState<Trick | null>(null);
  const [playerScore, setPlayerScore] = useState(0);
  const [opponentScore, setOpponentScore] = useState(0);
  const [round, setRound] = useState(1);

  function getRandomCards(count: number): Trick[] {
    const shuffled = [...tricks].sort(() => Math.random() - 0.5);
    return shuffled.slice(0, count);
  }

  const getCardPower = (trick: Trick): number => {
    const difficultyPower = {
      'novice': 1,
      'amateur': 2,
      'pro': 3,
      'legend': 4
    };
    return (difficultyPower[trick.difficulty] || 1) * 10 + trick.experience_reward;
  };

  const playCard = (trick: Trick) => {
    const newPlayerHand = playerHand.filter(t => t.id !== trick.id);
    setPlayerHand(newPlayerHand);
    setPlayerField(trick);

    const opponentCardIndex = Math.floor(Math.random() * opponentHand.length);
    const opponentCard = opponentHand[opponentCardIndex];
    setOpponentField(opponentCard);

    setTimeout(() => {
      const playerPower = getCardPower(trick);
      const opponentPower = getCardPower(opponentCard);

      let newPlayerScore = playerScore;
      let newOpponentScore = opponentScore;

      if (playerPower > opponentPower) {
        newPlayerScore = playerScore + 1;
        setPlayerScore(newPlayerScore);
      } else if (opponentPower > playerPower) {
        newOpponentScore = opponentScore + 1;
        setOpponentScore(newOpponentScore);
      }

      if (round >= 5) {
        setTimeout(() => {
          setGameState('result');
        }, 1000);
      } else {
        setTimeout(() => {
          setRound(round + 1);
          setPlayerField(null);
          setOpponentField(null);
        }, 1000);
      }
    }, 1500);
  };

  const finishGame = () => {
    const won = playerScore > opponentScore;
    const earnedKinetics = won ? 80 : 30;
    onComplete(earnedKinetics);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
      <Card className="max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>🃏 Карточная битва</CardTitle>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <Icon name="X" className="w-5 h-5" />
          </Button>
        </CardHeader>
        <CardContent>
          {gameState === 'playing' && (
            <div>
              {/* Счёт */}
              <div className="flex justify-between items-center mb-6">
                <div className="text-center">
                  <div className="text-sm text-gray-600">Ты</div>
                  <div className="text-3xl font-bold text-blue-600">{playerScore}</div>
                </div>
                <div className="text-xl font-bold">Раунд {round}/5</div>
                <div className="text-center">
                  <div className="text-sm text-gray-600">Противник</div>
                  <div className="text-3xl font-bold text-red-600">{opponentScore}</div>
                </div>
              </div>

              {/* Поле противника */}
              <div className="mb-6">
                <div className="text-center text-sm text-gray-600 mb-2">Карта противника</div>
                <div className="flex justify-center">
                  {opponentField ? (
                    <div className="p-4 bg-gradient-to-br from-red-100 to-orange-100 border-2 border-red-300 rounded-lg w-48">
                      <div className="font-bold text-lg mb-2">{opponentField.name}</div>
                      <Badge className={DIFFICULTY_COLORS[opponentField.difficulty]}>
                        {DIFFICULTY_NAMES[opponentField.difficulty]}
                      </Badge>
                      <div className="text-2xl font-bold mt-2 text-red-600">
                        ⚡ {getCardPower(opponentField)}
                      </div>
                    </div>
                  ) : (
                    <div className="w-48 h-32 bg-gray-200 rounded-lg flex items-center justify-center border-2 border-dashed border-gray-400">
                      <span className="text-gray-400">?</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Поле игрока */}
              <div className="mb-6">
                <div className="text-center text-sm text-gray-600 mb-2">Твоя карта</div>
                <div className="flex justify-center">
                  {playerField ? (
                    <div className="p-4 bg-gradient-to-br from-blue-100 to-purple-100 border-2 border-blue-300 rounded-lg w-48">
                      <div className="font-bold text-lg mb-2">{playerField.name}</div>
                      <Badge className={DIFFICULTY_COLORS[playerField.difficulty]}>
                        {DIFFICULTY_NAMES[playerField.difficulty]}
                      </Badge>
                      <div className="text-2xl font-bold mt-2 text-blue-600">
                        ⚡ {getCardPower(playerField)}
                      </div>
                    </div>
                  ) : (
                    <div className="w-48 h-32 bg-gray-100 rounded-lg flex items-center justify-center border-2 border-dashed border-gray-300">
                      <span className="text-gray-400">Выбери карту</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Рука игрока */}
              <div>
                <div className="text-center text-sm text-gray-600 mb-3">Твои карты</div>
                <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                  {playerHand.map((trick) => (
                    <button
                      key={trick.id}
                      onClick={() => playCard(trick)}
                      disabled={playerField !== null}
                      className="p-3 bg-gradient-to-br from-purple-100 to-blue-100 border-2 border-purple-300 rounded-lg hover:border-purple-500 hover:scale-105 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <div className="font-bold text-sm mb-1">{trick.name}</div>
                      <Badge className={`${DIFFICULTY_COLORS[trick.difficulty]} text-xs`}>
                        {DIFFICULTY_NAMES[trick.difficulty]}
                      </Badge>
                      <div className="text-xl font-bold mt-1 text-purple-600">
                        ⚡ {getCardPower(trick)}
                      </div>
                    </button>
                  ))}
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
                  Награда: +{playerScore > opponentScore ? 80 : 30} 💰
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

export default CardBattle;