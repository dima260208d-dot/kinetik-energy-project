import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import Icon from '@/components/ui/icon';
import { useToast } from '@/hooks/use-toast';
import { 
  SportType, 
  RidingStyle, 
  SPORT_NAMES, 
  SPORT_ICONS, 
  RIDING_STYLE_NAMES,
  BODY_TYPES,
  HAIRSTYLES,
  HAIR_COLORS
} from '@/types/kinetic';
import CharacterPreview from '@/components/kinetic/CharacterPreview';

const CharacterCreation = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [step, setStep] = useState(1);
  const [characterName, setCharacterName] = useState('');
  const [sportType, setSportType] = useState<SportType | ''>('');
  const [ridingStyle, setRidingStyle] = useState<RidingStyle | ''>('');
  const [bodyType, setBodyType] = useState(1);
  const [hairstyle, setHairstyle] = useState(1);
  const [hairColor, setHairColor] = useState('#000000');

  const handleCreateCharacter = async () => {
    if (!characterName.trim()) {
      toast({
        title: 'Ошибка',
        description: 'Введите имя персонажа',
        variant: 'destructive'
      });
      return;
    }

    if (!sportType || !ridingStyle) {
      toast({
        title: 'Ошибка',
        description: 'Выберите вид спорта и стиль катания',
        variant: 'destructive'
      });
      return;
    }

    const characterData = {
      name: characterName,
      sport_type: sportType,
      riding_style: ridingStyle,
      body_type: bodyType,
      hairstyle: hairstyle,
      hair_color: hairColor
    };

    const stored = localStorage.getItem('kinetic_universe_data');
    const data = stored ? JSON.parse(stored) : { characters: [] };

    const newCharacter = {
      id: Date.now(),
      user_id: user?.id || '',
      ...characterData,
      level: 1,
      experience: 0,
      balance: 1,
      speed: 1,
      courage: 1,
      kinetics: 100,
      premium_currency: 0,
      is_pro: false,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    data.characters = data.characters || [];
    data.characters.push(newCharacter);
    localStorage.setItem('kinetic_universe_data', JSON.stringify(data));

    toast({
      title: 'Персонаж создан!',
      description: `Добро пожаловать в Kinetic Universe, ${characterName}!`
    });

    navigate('/kinetic-universe');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Заголовок */}
        <div className="text-center mb-8 pt-8">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-2">
            🌌 Kinetic Universe 🌌
          </h1>
          <p className="text-xl text-blue-200">Создай своего персонажа</p>
        </div>

        {/* Прогресс */}
        <div className="mb-8">
          <div className="flex justify-between items-center max-w-2xl mx-auto">
            {[1, 2, 3].map((s) => (
              <div key={s} className="flex items-center flex-1">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${
                    s <= step
                      ? 'bg-gradient-to-r from-purple-500 to-blue-500 text-white'
                      : 'bg-gray-600 text-gray-300'
                  }`}
                >
                  {s}
                </div>
                {s < 3 && (
                  <div
                    className={`flex-1 h-1 mx-2 ${
                      s < step ? 'bg-gradient-to-r from-purple-500 to-blue-500' : 'bg-gray-600'
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
          <div className="flex justify-between max-w-2xl mx-auto mt-2 text-sm text-white">
            <span>Основное</span>
            <span className="ml-8">Спорт</span>
            <span>Внешность</span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Превью персонажа */}
          <div className="order-2 lg:order-1">
            <div className="sticky top-4">
              <h3 className="text-white text-xl font-bold mb-4 text-center">Твой персонаж</h3>
              {sportType && (
                <CharacterPreview
                  sportType={sportType as SportType}
                  bodyType={bodyType}
                  hairstyle={hairstyle}
                  hairColor={hairColor}
                  name={characterName || 'Твой герой'}
                />
              )}
              {!sportType && (
                <div className="bg-white/90 rounded-2xl p-8 text-center">
                  <div className="text-6xl mb-4">🌟</div>
                  <p className="text-gray-600">Выбери вид спорта, чтобы увидеть своего персонажа</p>
                </div>
              )}
            </div>
          </div>

          {/* Форма создания */}
          <Card className="bg-white/95 backdrop-blur-md shadow-2xl order-1 lg:order-2">
            <CardHeader>
              <CardTitle className="text-2xl">
                {step === 1 && '📝 Основная информация'}
                {step === 2 && '🏆 Выбери свой путь'}
                {step === 3 && '✨ Кастомизация'}
              </CardTitle>
              <CardDescription>
                {step === 1 && 'Как будут звать твоего персонажа?'}
                {step === 2 && 'Выбери вид спорта и стиль катания'}
                {step === 3 && 'Создай уникальный образ'}
              </CardDescription>
            </CardHeader>

            <CardContent>
            {/* Шаг 1: Имя */}
            {step === 1 && (
              <div className="space-y-4">
                <div>
                  <Label htmlFor="name" className="text-lg">Имя персонажа</Label>
                  <Input
                    id="name"
                    value={characterName}
                    onChange={(e) => setCharacterName(e.target.value)}
                    placeholder="Введи имя..."
                    maxLength={20}
                    className="text-lg mt-2"
                  />
                  <p className="text-sm text-gray-500 mt-1">
                    Максимум 20 символов. После создания изменить можно будет за 50 кинетиков.
                  </p>
                </div>
              </div>
            )}

            {/* Шаг 2: Спорт и стиль */}
            {step === 2 && (
              <div className="space-y-6">
                <div>
                  <Label className="text-lg mb-3 block">Вид спорта</Label>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {(Object.keys(SPORT_NAMES) as SportType[]).map((sport) => (
                      <button
                        key={sport}
                        onClick={() => setSportType(sport)}
                        className={`p-4 rounded-lg border-2 transition-all ${
                          sportType === sport
                            ? 'border-purple-500 bg-purple-50 shadow-lg scale-105'
                            : 'border-gray-300 hover:border-purple-300 hover:bg-gray-50'
                        }`}
                      >
                        <div className="text-4xl mb-2">{SPORT_ICONS[sport]}</div>
                        <div className="font-semibold">{SPORT_NAMES[sport]}</div>
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <Label className="text-lg mb-3 block">Стиль катания</Label>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    {(Object.keys(RIDING_STYLE_NAMES) as RidingStyle[]).map((style) => (
                      <button
                        key={style}
                        onClick={() => setRidingStyle(style)}
                        className={`p-4 rounded-lg border-2 transition-all ${
                          ridingStyle === style
                            ? 'border-blue-500 bg-blue-50 shadow-lg'
                            : 'border-gray-300 hover:border-blue-300 hover:bg-gray-50'
                        }`}
                      >
                        <div className="font-semibold text-lg mb-1">
                          {RIDING_STYLE_NAMES[style]}
                        </div>
                        <div className="text-sm text-gray-600">
                          {style === 'aggressive' && 'Смелость +2'}
                          {style === 'technical' && 'Баланс +2'}
                          {style === 'freestyle' && 'Скорость +2'}
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Шаг 3: Внешность */}
            {step === 3 && (
              <div className="space-y-6">
                <div>
                  <Label className="text-lg mb-3 block">Тип телосложения</Label>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {BODY_TYPES.map((type) => (
                      <button
                        key={type.id}
                        onClick={() => setBodyType(type.id)}
                        className={`p-4 rounded-lg border-2 text-left transition-all ${
                          bodyType === type.id
                            ? 'border-green-500 bg-green-50 shadow-lg'
                            : 'border-gray-300 hover:border-green-300 hover:bg-gray-50'
                        }`}
                      >
                        <div className="font-semibold">{type.name}</div>
                        <div className="text-sm text-gray-600">{type.description}</div>
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <Label className="text-lg mb-3 block">Причёска</Label>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                    {HAIRSTYLES.map((style) => (
                      <button
                        key={style.id}
                        onClick={() => setHairstyle(style.id)}
                        className={`p-3 rounded-lg border-2 text-sm transition-all ${
                          hairstyle === style.id
                            ? 'border-orange-500 bg-orange-50'
                            : 'border-gray-300 hover:border-orange-300'
                        }`}
                      >
                        {style.name}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <Label className="text-lg mb-3 block">Цвет волос</Label>
                  <div className="grid grid-cols-3 md:grid-cols-5 gap-2">
                    {HAIR_COLORS.map((color) => (
                      <button
                        key={color.value}
                        onClick={() => setHairColor(color.value)}
                        className={`p-3 rounded-lg border-2 transition-all ${
                          hairColor === color.value
                            ? 'border-purple-500 shadow-lg scale-105'
                            : 'border-gray-300'
                        }`}
                      >
                        <div
                          className="w-full h-8 rounded mb-1"
                          style={{ backgroundColor: color.value }}
                        />
                        <div className="text-xs text-center">{color.name}</div>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Навигация */}
            <div className="flex justify-between mt-8 pt-6 border-t">
              {step > 1 && (
                <Button
                  onClick={() => setStep(step - 1)}
                  variant="outline"
                  size="lg"
                >
                  <Icon name="ChevronLeft" className="w-5 h-5 mr-2" />
                  Назад
                </Button>
              )}
              
              {step < 3 ? (
                <Button
                  onClick={() => setStep(step + 1)}
                  className="ml-auto bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
                  size="lg"
                  disabled={step === 1 && !characterName.trim()}
                >
                  Далее
                  <Icon name="ChevronRight" className="w-5 h-5 ml-2" />
                </Button>
              ) : (
                <Button
                  onClick={handleCreateCharacter}
                  className="ml-auto bg-gradient-to-r from-green-600 to-teal-600 hover:from-green-700 hover:to-teal-700"
                  size="lg"
                >
                  <Icon name="Rocket" className="w-5 h-5 mr-2" />
                  Создать персонажа
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
        </div>

        {/* Подсказка */}
        <div className="text-center mt-6 text-white/80 text-sm">
          <Icon name="Info" className="w-4 h-4 inline mr-1" />
          После создания персонажа изменить внешность можно будет за 50 кинетиков
        </div>
      </div>
    </div>
  );
};

export default CharacterCreation;