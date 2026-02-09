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
    
    const bodyColors = {
      1: '#4299e1',
      2: '#48bb78', 
      3: '#ed8936',
      4: '#9f7aea',
      5: '#f56565'
    };
    
    const bodyColor = bodyColors[bodyType as keyof typeof bodyColors] || '#4299e1';
    
    const hairstyleShape = () => {
      switch(hairstyle) {
        case 1:
          return <ellipse cx="100" cy="60" rx="38" ry="20" fill={hairColorHex} />;
        case 2:
          return (
            <>
              <path d="M 100 40 L 90 70 L 110 70 Z" fill={hairColorHex} />
              <ellipse cx="100" cy="55" rx="35" ry="15" fill={hairColorHex} />
            </>
          );
        case 3:
          return (
            <>
              <ellipse cx="100" cy="62" rx="38" ry="22" fill={hairColorHex} />
              <rect x="62" y="75" width="15" height="25" fill={hairColorHex} />
              <rect x="123" y="75" width="15" height="25" fill={hairColorHex} />
            </>
          );
        case 4:
          return (
            <>
              <ellipse cx="100" cy="60" rx="38" ry="30" fill={hairColorHex} />
              <path d="M 70 80 Q 65 100 70 120 Q 75 100 75 80" fill={hairColorHex} />
              <path d="M 130 80 Q 135 100 130 120 Q 125 100 125 80" fill={hairColorHex} />
            </>
          );
        case 5:
          return (
            <>
              <ellipse cx="100" cy="65" rx="40" ry="30" fill={hairColorHex} />
              <circle cx="75" cy="75" r="8" fill={hairColorHex} />
              <circle cx="85" cy="80" r="8" fill={hairColorHex} />
              <circle cx="115" cy="80" r="8" fill={hairColorHex} />
              <circle cx="125" cy="75" r="8" fill={hairColorHex} />
            </>
          );
        case 8:
          return (
            <>
              <ellipse cx="100" cy="55" rx="45" ry="35" fill={hairColorHex} />
              <circle cx="100" cy="55" r="45" fill={hairColorHex} />
            </>
          );
        case 9:
          return (
            <>
              <ellipse cx="100" cy="60" rx="38" ry="25" fill={hairColorHex} />
              <ellipse cx="100" cy="50" rx="15" ry="45" fill={hairColorHex} transform="rotate(20 100 50)" />
            </>
          );
        default:
          return <ellipse cx="100" cy="60" rx="38" ry="25" fill={hairColorHex} />;
      }
    };
    
    return (
      <svg viewBox="0 0 200 200" className={sizeClasses[size]} xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id={`grad-${name}`} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#667eea" />
            <stop offset="100%" stopColor="#764ba2" />
          </linearGradient>
          <filter id={`shadow-${name}`}>
            <feDropShadow dx="0" dy="2" stdDeviation="3" floodOpacity="0.3"/>
          </filter>
        </defs>

        <circle cx="100" cy="100" r="100" fill={`url(#grad-${name})`} />

        <g filter={`url(#shadow-${name})`}>
          <ellipse cx="100" cy="150" rx="50" ry="55" fill={bodyColor} />
          
          <ellipse cx="65" cy="155" rx="15" ry="40" fill={skinTone} />
          <ellipse cx="135" cy="155" rx="15" ry="40" fill={skinTone} />
          <circle cx="65" cy="185" r="12" fill={skinTone} />
          <circle cx="135" cy="185" r="12" fill={skinTone} />

          <circle cx="100" cy="85" r="40" fill={skinTone} />

          <ellipse cx="100" cy="100" rx="42" ry="25" fill={bodyColor} />

          {hairstyleShape()}

          <ellipse cx="85" cy="82" rx="5" ry="8" fill="#2d3748" />
          <ellipse cx="115" cy="82" rx="5" ry="8" fill="#2d3748" />
          <circle cx="87" cy="79" r="2.5" fill="white" />
          <circle cx="117" cy="79" r="2.5" fill="white" />

          <ellipse cx="85" cy="75" rx="8" ry="3" fill="#2d3748" opacity="0.3" />
          <ellipse cx="115" cy="75" rx="8" ry="3" fill="#2d3748" opacity="0.3" />

          <circle cx="100" cy="92" r="3" fill="#d69e7d" />

          <path d="M 88 100 Q 100 108 112 100" stroke="#2d3748" strokeWidth="3" fill="none" strokeLinecap="round" />

          <ellipse cx="78" cy="88" rx="6" ry="4" fill="#ff6b9d" opacity="0.5" />
          <ellipse cx="122" cy="88" rx="6" ry="4" fill="#ff6b9d" opacity="0.5" />
        </g>

        <text x="100" y="185" fontSize="32" textAnchor="middle" opacity="0.9">
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