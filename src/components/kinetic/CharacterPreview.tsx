import { SPORT_ICONS, BODY_TYPES, HAIRSTYLES, HAIR_COLORS, SportType } from '@/types/kinetic';
import CharacterAvatar from './CharacterAvatar';

interface CharacterPreviewProps {
  sportType: SportType;
  bodyType: number;
  hairstyle: number;
  hairColor: string;
  name?: string;
  level?: number;
}

const CharacterPreview = ({ sportType, bodyType, hairstyle, hairColor, name, level = 1 }: CharacterPreviewProps) => {
  const bodyTypeName = BODY_TYPES.find(bt => bt.id === bodyType)?.name || 'Атлетический';
  const hairstyleName = HAIRSTYLES.find(hs => hs.id === hairstyle)?.name || 'Короткая';
  const hairColorName = HAIR_COLORS.find(hc => hc.value === hairColor)?.name || 'Чёрный';

  return (
    <div className="relative">
      {/* Карточка персонажа */}
      <div className="bg-gradient-to-br from-purple-100 to-blue-100 rounded-2xl p-6 border-4 border-purple-400 shadow-2xl">
        {/* Голова и тело */}
        <div className="relative flex flex-col items-center">
          {/* Имя персонажа */}
          {name && (
            <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-white px-4 py-2 rounded-full shadow-lg border-2 border-purple-400">
              <span className="font-bold text-purple-700">{name}</span>
            </div>
          )}

          {/* Аватар персонажа */}
          <div className="mb-6">
            <CharacterAvatar
              sportType={sportType}
              bodyType={bodyType}
              hairstyle={hairstyle}
              hairColor={hairColor}
              name={name || 'Персонаж'}
              size="lg"
            />
          </div>

          {/* Спортивный инвентарь */}
          <div className="mt-4 text-6xl animate-bounce">
            {SPORT_ICONS[sportType]}
          </div>
        </div>

        {/* Характеристики */}
        <div className="mt-6 grid grid-cols-3 gap-2 text-center">
          <div className="bg-white/80 rounded-lg p-2">
            <div className="text-2xl">⚖️</div>
            <div className="text-xs font-semibold">Баланс</div>
          </div>
          <div className="bg-white/80 rounded-lg p-2">
            <div className="text-2xl">⚡</div>
            <div className="text-xs font-semibold">Скорость</div>
          </div>
          <div className="bg-white/80 rounded-lg p-2">
            <div className="text-2xl">🔥</div>
            <div className="text-xs font-semibold">Смелость</div>
          </div>
        </div>

        {/* Описание */}
        <div className="mt-4 text-center text-sm">
          <div className="bg-white/80 rounded-lg p-3">
            <div className="font-semibold text-purple-700">Характеристики</div>
            <div className="text-xs text-gray-600 mt-1">
              Цвет волос: <span className="font-semibold">{hairColorName}</span>
            </div>
            <div className="text-xs text-gray-600">
              Телосложение: <span className="font-semibold">{bodyTypeName}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Уровень персонажа */}
      {level && (
        <div className="absolute -top-4 -right-4 w-16 h-16 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center border-4 border-white shadow-xl">
          <div className="text-center">
            <div className="text-xs font-bold text-white">LVL</div>
            <div className="text-xl font-bold text-white">{level}</div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CharacterPreview;