import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Character, SPORT_NAMES, SPORT_ICONS } from '@/types/kinetic';

interface CharacterInfoCardProps {
  character: Character;
  getExperienceForNextLevel: (level: number) => number;
}

const CharacterInfoCard = ({ character, getExperienceForNextLevel }: CharacterInfoCardProps) => {
  return (
    <Card className="lg:col-span-2 bg-white/95 backdrop-blur-md">
      <CardContent className="pt-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="text-4xl">{SPORT_ICONS[character.sport_type]}</div>
              <div>
                <div className="text-2xl font-bold">{character.name}</div>
                <div className="text-gray-600">{SPORT_NAMES[character.sport_type]}</div>
              </div>
            </div>
            <div className="flex items-center gap-2 mb-4">
              <Badge className="text-lg px-3 py-1">Уровень {character.level}</Badge>
              <span className="text-lg font-semibold text-yellow-600">
                💰 {character.kinetics}
              </span>
            </div>
          </div>

          <div>
            <div className="mb-4">
              <div className="text-sm text-gray-600 mb-2">Опыт до следующего уровня</div>
              <div className="w-full bg-gray-200 rounded-full h-4 mb-2">
                <div 
                  className="bg-gradient-to-r from-purple-500 to-blue-500 h-4 rounded-full transition-all"
                  style={{ width: `${(character.experience / getExperienceForNextLevel(character.level)) * 100}%` }}
                />
              </div>
              <div className="text-sm text-gray-600">
                {character.experience} / {getExperienceForNextLevel(character.level)} XP
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex justify-between items-center p-2 bg-gray-50 rounded">
                <span className="font-semibold">⚖️ Баланс</span>
                <div className="flex items-center gap-2">
                  <div className="w-24 bg-gray-200 rounded-full h-2">
                    <div className="bg-green-500 h-2 rounded-full" style={{ width: `${character.balance}%` }} />
                  </div>
                  <span className="font-bold text-lg">{character.balance}</span>
                </div>
              </div>
              <div className="flex justify-between items-center p-2 bg-gray-50 rounded">
                <span className="font-semibold">⚡ Скорость</span>
                <div className="flex items-center gap-2">
                  <div className="w-24 bg-gray-200 rounded-full h-2">
                    <div className="bg-blue-500 h-2 rounded-full" style={{ width: `${character.speed}%` }} />
                  </div>
                  <span className="font-bold text-lg">{character.speed}</span>
                </div>
              </div>
              <div className="flex justify-between items-center p-2 bg-gray-50 rounded">
                <span className="font-semibold">🔥 Смелость</span>
                <div className="flex items-center gap-2">
                  <div className="w-24 bg-gray-200 rounded-full h-2">
                    <div className="bg-red-500 h-2 rounded-full" style={{ width: `${character.courage}%` }} />
                  </div>
                  <span className="font-bold text-lg">{character.courage}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default CharacterInfoCard;
