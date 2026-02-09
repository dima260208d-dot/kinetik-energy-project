import { Card } from '@/components/ui/card';
import Icon from '@/components/ui/icon';
import { Trick, SPORT_NAMES } from '@/types/kinetic';

interface TrickPassportProps {
  sportType: 'skate' | 'rollers' | 'bmx' | 'scooter' | 'bike';
  tricks: Trick[];
  masteredTrickIds: number[];
}

const TrickPassport = ({ sportType, tricks, masteredTrickIds }: TrickPassportProps) => {
  const sportColors = {
    skate: { bg: 'bg-gradient-to-br from-teal-50 to-green-50', border: 'border-teal-500', text: 'text-teal-700', title: 'СКЕЙТ' },
    rollers: { bg: 'bg-gradient-to-br from-blue-50 to-teal-50', border: 'border-blue-500', text: 'text-blue-700', title: 'РОЛИКИ' },
    bmx: { bg: 'bg-gradient-to-br from-green-50 to-yellow-50', border: 'border-green-500', text: 'text-green-700', title: 'BMX' },
    scooter: { bg: 'bg-gradient-to-br from-orange-50 to-yellow-50', border: 'border-orange-500', text: 'text-orange-700', title: 'САМОКАТ' },
    bike: { bg: 'bg-gradient-to-br from-purple-50 to-pink-50', border: 'border-purple-500', text: 'text-purple-700', title: 'ВЕЛОСИПЕД' }
  };

  const colors = sportColors[sportType];

  return (
    <Card className={`${colors.bg} border-4 ${colors.border} shadow-2xl overflow-hidden relative`}>
      {/* Декоративные элементы по углам */}
      <div className="absolute top-0 left-0 w-16 h-16">
        <div className="absolute top-2 left-2 w-12 h-1 bg-yellow-500 rounded"></div>
        <div className="absolute top-4 left-2 w-12 h-1 bg-orange-500 rounded"></div>
        <div className="absolute top-6 left-2 w-8 h-1 bg-green-500 rounded"></div>
      </div>
      <div className="absolute top-0 right-0 w-16 h-16">
        <div className="absolute top-2 right-2 w-12 h-1 bg-blue-500 rounded"></div>
        <div className="absolute top-4 right-2 w-12 h-1 bg-purple-500 rounded"></div>
        <div className="absolute top-6 right-2 w-8 h-1 bg-teal-500 rounded"></div>
      </div>

      {/* Хедер */}
      <div className="text-center py-6 border-b-4 border-orange-400 bg-white/50">
        <div className="text-2xl md:text-3xl font-bold mb-1">
          <span className="text-orange-500">K</span>
          <span className="text-green-500">i</span>
          <span className="text-blue-500">n</span>
          <span className="text-purple-500">e</span>
          <span className="text-orange-500">t</span>
          <span className="text-teal-500">i</span>
          <span className="text-red-500">c</span>
          {' '}
          <span className="text-blue-600">K</span>
          <span className="text-green-600">i</span>
          <span className="text-orange-600">d</span>
          <span className="text-purple-600">s</span>
        </div>
        <div className={`text-xl md:text-2xl font-bold ${colors.text} border-t-2 border-b-2 ${colors.border} inline-block px-4 py-1 mt-2`}>
          Паспорт трюков — {colors.title}
        </div>
      </div>

      {/* Список трюков */}
      <div className="p-4 md:p-6">
        <div className="space-y-2">
          {tricks.map((trick, index) => {
            const isMastered = masteredTrickIds.includes(trick.id);
            return (
              <div 
                key={trick.id}
                className="flex items-center justify-between border-b-2 border-dashed border-gray-300 pb-2"
              >
                <div className="flex items-center gap-2 flex-1">
                  <span className="font-bold text-lg">{index + 1}.</span>
                  <span className="font-semibold text-base md:text-lg">{trick.name}</span>
                </div>
                <div 
                  className={`w-8 h-8 border-2 ${
                    isMastered ? `${colors.border} bg-white` : 'border-gray-400 bg-white'
                  } rounded`}
                >
                  {isMastered && (
                    <Icon name="Check" className={`w-full h-full ${colors.text} p-1`} />
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Футер */}
        <div className="mt-6 pt-4 border-t-2 border-green-400">
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <div className="font-semibold mb-1">ФИО старшего тренера:</div>
              <div className="border-b-2 border-gray-400 h-6"></div>
            </div>
            <div>
              <div className="flex items-center gap-4">
                <div>
                  <div className="font-semibold mb-1">Подпись:</div>
                  <div className="border-b-2 border-gray-400 h-6 w-24"></div>
                </div>
                <div>
                  <div className="font-semibold mb-1">Печать:</div>
                  <div className="w-12 h-12 border-2 border-gray-400 rounded-full"></div>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-4 text-center">
            <div className="flex items-center justify-center gap-1 text-teal-700 font-semibold">
              <span>⭐</span>
              <span>За выполнение всех трюков ученик получает награду</span>
              <span>⭐</span>
            </div>
            <div className="border-b-2 border-gray-400 h-6 mt-2 max-w-md mx-auto"></div>
            <div className="mt-3">
              <div className="font-semibold text-sm mb-1">Подпись директора:</div>
              <div className="border-b-2 border-gray-400 h-6 max-w-xs mx-auto"></div>
              <div className="w-12 h-12 border-2 border-gray-400 rounded-full mx-auto mt-2"></div>
            </div>
          </div>
        </div>
      </div>

      {/* Декоративные элементы внизу */}
      <div className="absolute bottom-0 left-0 w-full h-2 bg-gradient-to-r from-orange-400 via-green-400 to-blue-400"></div>
    </Card>
  );
};

export default TrickPassport;
