import { useState, useEffect } from 'react';
import { SportType, SPORT_NAMES, BODY_TYPES, HAIRSTYLES } from '@/types/kinetic';

interface CharacterAvatarProps {
  sportType: SportType;
  bodyType: number;
  hairstyle: number;
  hairColor: string;
  name: string;
  size?: 'sm' | 'md' | 'lg';
}

const CharacterAvatar = ({ sportType, bodyType, hairstyle, hairColor, name, size = 'md' }: CharacterAvatarProps) => {
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const sizeClasses = {
    sm: 'w-16 h-16',
    md: 'w-32 h-32',
    lg: 'w-64 h-64'
  };

  useEffect(() => {
    generateCharacterImage();
  }, [sportType, bodyType, hairstyle, hairColor]);

  const generateCharacterImage = async () => {
    setLoading(true);
    setError(false);

    try {
      const bodyTypeName = BODY_TYPES.find(bt => bt.id === bodyType)?.name || 'атлетический';
      const hairstyleName = HAIRSTYLES.find(hs => hs.id === hairstyle)?.name || 'короткая стрижка';
      const sportName = SPORT_NAMES[sportType];

      // Создаём детальный промпт для генерации
      const prompt = `Cartoon style character avatar for ${name}, a young athlete doing ${sportName}. ${bodyTypeName} body type, ${hairstyleName} hairstyle with ${hairColor} hair color. Friendly, energetic expression. Simple background. Digital art, vibrant colors, kid-friendly style.`;

      // Пытаемся сгенерировать изображение
      // В реальности здесь был бы вызов API для генерации
      // Пока используем заглушку
      
      // Имитация загрузки
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Используем заглушку - можно заменить на реальную генерацию
      setImageUrl(null);
      setError(true);
      
    } catch (err) {
      console.error('Error generating character image:', err);
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  // Пока нет сгенерированного изображения, показываем SVG-аватар
  const getSvgAvatar = () => {
    const hairColorHex = hairColor;
    const skinTone = '#FFD1A3';
    
    return (
      <svg viewBox="0 0 200 200" className={sizeClasses[size]} xmlns="http://www.w3.org/2000/svg">
        {/* Фон */}
        <circle cx="100" cy="100" r="100" fill={`url(#grad-${name})`} />
        <defs>
          <linearGradient id={`grad-${name}`} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#667eea" />
            <stop offset="100%" stopColor="#764ba2" />
          </linearGradient>
        </defs>

        {/* Тело */}
        <ellipse cx="100" cy="140" rx="45" ry="50" fill="#4299e1" />
        
        {/* Руки */}
        <ellipse cx="70" cy="150" rx="12" ry="35" fill={skinTone} />
        <ellipse cx="130" cy="150" rx="12" ry="35" fill={skinTone} />

        {/* Голова */}
        <circle cx="100" cy="80" r="35" fill={skinTone} />

        {/* Волосы */}
        <ellipse cx="100" cy="60" rx="38" ry="25" fill={hairColorHex} />
        <path d="M 65 65 Q 60 50 70 45 Q 80 40 90 45 Q 100 35 110 45 Q 120 40 130 45 Q 140 50 135 65 Z" fill={hairColorHex} />

        {/* Лицо */}
        {/* Глаза */}
        <ellipse cx="88" cy="78" rx="4" ry="6" fill="#2d3748" />
        <ellipse cx="112" cy="78" rx="4" ry="6" fill="#2d3748" />
        <circle cx="89" cy="76" r="2" fill="white" />
        <circle cx="113" cy="76" r="2" fill="white" />

        {/* Нос */}
        <ellipse cx="100" cy="88" rx="2" ry="3" fill="#d69e7d" />

        {/* Улыбка */}
        <path d="M 90 95 Q 100 100 110 95" stroke="#2d3748" strokeWidth="2" fill="none" strokeLinecap="round" />

        {/* Спортивный инвентарь (иконка) */}
        <text x="100" y="175" fontSize="24" textAnchor="middle" fill="white">
          {sportType === 'skate' && '🛹'}
          {sportType === 'rollers' && '🛼'}
          {sportType === 'bmx' && '🚴‍♂️'}
          {sportType === 'scooter' && '🛴'}
          {sportType === 'bike' && '🚲'}
        </text>
      </svg>
    );
  };

  if (loading) {
    return (
      <div className={`${sizeClasses[size]} bg-gradient-to-br from-purple-200 to-blue-200 rounded-full flex items-center justify-center animate-pulse`}>
        <span className="text-2xl">✨</span>
      </div>
    );
  }

  if (error || !imageUrl) {
    return (
      <div className="relative">
        {getSvgAvatar()}
      </div>
    );
  }

  return (
    <div className={`${sizeClasses[size]} rounded-full overflow-hidden border-4 border-purple-400 shadow-lg`}>
      <img src={imageUrl} alt={name} className="w-full h-full object-cover" />
    </div>
  );
};

export default CharacterAvatar;
