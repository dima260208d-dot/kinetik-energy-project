import { SPORT_ICONS, BODY_TYPES, HAIRSTYLES, HAIR_COLORS, SportType } from '@/types/kinetic';

interface CharacterPreviewProps {
  sportType: SportType;
  bodyType: number;
  hairstyle: number;
  hairColor: string;
  name?: string;
}

const CharacterPreview = ({ sportType, bodyType, hairstyle, hairColor, name }: CharacterPreviewProps) => {
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

          {/* Голова с причёской */}
          <div className="relative mb-4">
            {/* Причёска */}
            <div 
              className="absolute -top-8 left-1/2 transform -translate-x-1/2 w-32 h-16 rounded-t-full"
              style={{ backgroundColor: hairColor }}
            >
              <div className="text-center text-xs text-white/80 pt-1 font-semibold">
                {hairstyleName}
              </div>
            </div>
            
            {/* Лицо */}
            <div className="w-24 h-24 bg-gradient-to-br from-yellow-200 to-yellow-300 rounded-full border-4 border-white shadow-lg flex items-center justify-center">
              <div className="flex flex-col items-center gap-1">
                <div className="flex gap-3">
                  <div className="w-2 h-2 bg-black rounded-full"></div>
                  <div className="w-2 h-2 bg-black rounded-full"></div>
                </div>
                <div className="w-1 h-1 bg-black rounded-full"></div>
                <div className="w-4 h-2 bg-black rounded-b-full"></div>
              </div>
            </div>
          </div>

          {/* Тело */}
          <div className={`relative ${
            bodyType === 1 ? 'w-16' : 
            bodyType === 2 ? 'w-20' : 
            bodyType === 3 ? 'w-24' : 
            bodyType === 4 ? 'w-20' : 
            'w-18'
          } h-32 bg-gradient-to-br from-blue-400 to-blue-600 rounded-lg border-4 border-white shadow-lg`}>
            <div className="absolute top-2 left-1/2 transform -translate-x-1/2 text-white text-xs font-bold">
              {bodyTypeName}
            </div>
            {/* Руки */}
            <div className="absolute -left-4 top-4 w-3 h-16 bg-gradient-to-b from-yellow-200 to-yellow-300 rounded-full"></div>
            <div className="absolute -right-4 top-4 w-3 h-16 bg-gradient-to-b from-yellow-200 to-yellow-300 rounded-full"></div>
          </div>

          {/* Ноги */}
          <div className="flex gap-2 mt-2">
            <div className="w-5 h-20 bg-gradient-to-b from-blue-600 to-blue-800 rounded-lg"></div>
            <div className="w-5 h-20 bg-gradient-to-b from-blue-600 to-blue-800 rounded-lg"></div>
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
      <div className="absolute -top-4 -right-4 w-16 h-16 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center border-4 border-white shadow-xl">
        <div className="text-center">
          <div className="text-xs font-bold text-white">LVL</div>
          <div className="text-xl font-bold text-white">1</div>
        </div>
      </div>
    </div>
  );
};

export default CharacterPreview;
