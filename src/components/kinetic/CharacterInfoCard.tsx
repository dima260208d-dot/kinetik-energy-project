import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Character, SPORT_NAMES, SPORT_ICONS, SportType } from '@/types/kinetic';

interface CharacterInfoCardProps {
  character: Character;
  getExperienceForNextLevel: (level: number) => number;
}

const CharacterInfoCard = ({ character, getExperienceForNextLevel }: CharacterInfoCardProps) => {
  const sports = (character.sport_types && character.sport_types.length > 0) ? character.sport_types : [character.sport_type];

  return (
    <Card className="lg:col-span-2 bg-white/95 backdrop-blur-md">
      <CardContent className="pt-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="text-4xl">{SPORT_ICONS[character.sport_type]}</div>
              <div>
                <div className="text-2xl font-bold">{character.name}</div>
                <div className="flex gap-1 flex-wrap">
                  {sports.map((s: string) => (
                    <Badge key={s} variant="outline" className="text-xs">
                      {SPORT_ICONS[s as SportType] || '🏃'} {SPORT_NAMES[s as SportType] || s}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2 mb-2 flex-wrap">
              <Badge className="text-lg px-3 py-1">Уровень {character.level}</Badge>
              <span className="text-lg font-semibold text-yellow-600">💰 {character.kinetics}</span>
            </div>
            {(character.trainer_name || character.age) && (
              <div className="flex items-center gap-3 text-sm text-gray-600 mt-2">
                {character.trainer_name && <span>👨‍🏫 Тренер: <strong>{character.trainer_name}</strong></span>}
                {character.age && <span>📅 Возраст: <strong>{character.age}</strong></span>}
              </div>
            )}
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
              {[
                { label: '⚖️ Баланс', value: character.balance, color: 'bg-green-500' },
                { label: '⚡ Скорость', value: character.speed, color: 'bg-blue-500' },
                { label: '🔥 Смелость', value: character.courage, color: 'bg-red-500' },
              ].map(stat => (
                <div key={stat.label} className="flex justify-between items-center p-2 bg-gray-50 rounded">
                  <span className="font-semibold">{stat.label}</span>
                  <div className="flex items-center gap-2">
                    <div className="w-24 bg-gray-200 rounded-full h-2">
                      <div className={`${stat.color} h-2 rounded-full`} style={{ width: `${stat.value}%` }} />
                    </div>
                    <span className="font-bold text-lg">{stat.value}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default CharacterInfoCard;
