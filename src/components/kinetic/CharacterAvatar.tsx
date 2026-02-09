import { SportType, BODY_TYPES, HAIRSTYLES } from '@/types/kinetic';

interface CharacterAvatarProps {
  sportType: SportType;
  bodyType: number;
  hairstyle: number;
  hairColor: string;
  name: string;
  size?: 'sm' | 'md' | 'lg';
}

const CharacterAvatar = ({ sportType, bodyType, hairstyle, hairColor, name, size = 'md' }: CharacterAvatarProps) => {
  const sizeClasses = {
    sm: 'w-16 h-16',
    md: 'w-32 h-32',
    lg: 'w-64 h-64'
  };

  const bodyColors = {
    1: '#FFB3BA',
    2: '#BAE1FF', 
    3: '#FFFFBA',
    4: '#BAFFC9',
    5: '#FFD9BA'
  };
  
  const bodyColor = bodyColors[bodyType as keyof typeof bodyColors] || '#FFB3BA';
  
  const getAnimeHairstyle = () => {
    const hairBase = hairColor;
    const hairHighlight = `${hairColor}99`;
    
    switch(hairstyle) {
      case 1:
        return (
          <g>
            <path d="M 60 55 Q 50 40 60 35 Q 70 30 80 35 Q 85 30 90 30 Q 95 30 100 28 Q 105 30 110 30 Q 115 30 120 35 Q 130 30 140 35 Q 150 40 140 55 Z" fill={hairBase} />
            <ellipse cx="80" cy="40" rx="8" ry="12" fill={hairHighlight} opacity="0.5" />
            <ellipse cx="120" cy="40" rx="8" ry="12" fill={hairHighlight} opacity="0.5" />
          </g>
        );
      case 2:
        return (
          <g>
            <path d="M 100 20 L 90 60 L 95 65 L 100 50 L 105 65 L 110 60 Z" fill={hairBase} />
            <ellipse cx="100" cy="50" rx="40" ry="18" fill={hairBase} />
            <path d="M 100 25 L 95 55 L 100 52 L 105 55 Z" fill={hairHighlight} opacity="0.6" />
          </g>
        );
      case 3:
        return (
          <g>
            <ellipse cx="100" cy="55" rx="42" ry="25" fill={hairBase} />
            <rect x="58" y="65" width="12" height="30" rx="3" fill={hairBase} />
            <rect x="130" y="65" width="12" height="30" rx="3" fill={hairBase} />
            <path d="M 75 45 Q 70 50 75 55" stroke={hairHighlight} strokeWidth="4" fill="none" opacity="0.5" />
            <path d="M 125 45 Q 130 50 125 55" stroke={hairHighlight} strokeWidth="4" fill="none" opacity="0.5" />
          </g>
        );
      case 4:
        return (
          <g>
            <ellipse cx="100" cy="55" rx="42" ry="32" fill={hairBase} />
            <path d="M 65 70 Q 60 90 65 110 Q 68 95 70 75" fill={hairBase} />
            <path d="M 135 70 Q 140 90 135 110 Q 132 95 130 75" fill={hairBase} />
            <path d="M 85 48 Q 90 52 95 48" stroke={hairHighlight} strokeWidth="3" fill="none" opacity="0.5" />
            <path d="M 105 48 Q 110 52 115 48" stroke={hairHighlight} strokeWidth="3" fill="none" opacity="0.5" />
          </g>
        );
      case 5:
        return (
          <g>
            <ellipse cx="100" cy="60" rx="44" ry="32" fill={hairBase} />
            <circle cx="70" cy="70" r="10" fill={hairBase} />
            <circle cx="82" cy="75" r="10" fill={hairBase} />
            <circle cx="118" cy="75" r="10" fill={hairBase} />
            <circle cx="130" cy="70" r="10" fill={hairBase} />
            <ellipse cx="72" cy="68" rx="5" ry="8" fill={hairHighlight} opacity="0.5" />
            <ellipse cx="128" cy="68" rx="5" ry="8" fill={hairHighlight} opacity="0.5" />
          </g>
        );
      case 8:
        return (
          <g>
            <circle cx="100" cy="50" r="48" fill={hairBase} />
            <ellipse cx="85" cy="45" rx="15" ry="20" fill={hairHighlight} opacity="0.4" />
            <ellipse cx="115" cy="45" rx="15" ry="20" fill={hairHighlight} opacity="0.4" />
          </g>
        );
      case 9:
        return (
          <g>
            <ellipse cx="100" cy="55" rx="40" ry="28" fill={hairBase} />
            <ellipse cx="100" cy="40" rx="18" ry="50" fill={hairBase} transform="rotate(25 100 40)" />
            <path d="M 95 35 Q 100 30 105 35" stroke={hairHighlight} strokeWidth="4" fill="none" opacity="0.5" />
          </g>
        );
      case 10:
        return (
          <g>
            <ellipse cx="100" cy="55" rx="40" ry="25" fill={hairBase} />
            <path d="M 70 60 Q 65 65 68 75 Q 70 78 72 85" stroke={hairBase} strokeWidth="8" fill="none" strokeLinecap="round" />
            <path d="M 130 60 Q 135 65 132 75 Q 130 78 128 85" stroke={hairBase} strokeWidth="8" fill="none" strokeLinecap="round" />
            <ellipse cx="90" cy="50" rx="8" ry="12" fill={hairHighlight} opacity="0.5" />
            <ellipse cx="110" cy="50" rx="8" ry="12" fill={hairHighlight} opacity="0.5" />
          </g>
        );
      default:
        return (
          <g>
            <ellipse cx="100" cy="55" rx="40" ry="25" fill={hairBase} />
            <path d="M 80 48 Q 85 52 90 48" stroke={hairHighlight} strokeWidth="3" fill="none" opacity="0.5" />
            <path d="M 110 48 Q 115 52 120 48" stroke={hairHighlight} strokeWidth="3" fill="none" opacity="0.5" />
          </g>
        );
    }
  };
  
  return (
    <div className="relative">
      <svg viewBox="0 0 200 200" className={sizeClasses[size]} xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id={`grad-bg-${name}`} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#667eea" />
            <stop offset="100%" stopColor="#764ba2" />
          </linearGradient>
          <linearGradient id={`grad-body-${name}`} x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor={bodyColor} />
            <stop offset="100%" stopColor={bodyColor} stopOpacity="0.8" />
          </linearGradient>
          <filter id={`shadow-${name}`}>
            <feDropShadow dx="0" dy="3" stdDeviation="4" floodOpacity="0.3"/>
          </filter>
          <radialGradient id={`face-grad-${name}`}>
            <stop offset="0%" stopColor="#FFE4D6" />
            <stop offset="100%" stopColor="#FFD1BA" />
          </radialGradient>
        </defs>

        <circle cx="100" cy="100" r="100" fill={`url(#grad-bg-${name})`} />

        <g filter={`url(#shadow-${name})`}>
          <ellipse cx="100" cy="155" rx="45" ry="50" fill={`url(#grad-body-${name})`} />
          
          <ellipse cx="68" cy="160" rx="14" ry="38" fill="#FFE4D6" />
          <ellipse cx="132" cy="160" rx="14" ry="38" fill="#FFE4D6" />
          <circle cx="68" cy="190" r="11" fill="#FFE4D6" />
          <circle cx="132" cy="190" r="11" fill="#FFE4D6" />

          <ellipse cx="100" cy="95" rx="38" ry="42" fill={`url(#face-grad-${name})`} />

          <ellipse cx="100" cy="115" rx="40" ry="22" fill={`url(#grad-body-${name})`} />

          {getAnimeHairstyle()}

          <ellipse cx="83" cy="88" rx="8" ry="12" fill="#2d3748" />
          <ellipse cx="117" cy="88" rx="8" ry="12" fill="#2d3748" />
          
          <ellipse cx="85" cy="85" rx="4" ry="6" fill="white" />
          <ellipse cx="119" cy="85" rx="4" ry="6" fill="white" />
          <circle cx="86" cy="84" r="2" fill="white" />
          <circle cx="120" cy="84" r="2" fill="white" />

          <path d="M 75 80 Q 80 78 85 80" stroke="#6B4423" strokeWidth="2.5" fill="none" strokeLinecap="round" />
          <path d="M 115 80 Q 120 78 125 80" stroke="#6B4423" strokeWidth="2.5" fill="none" strokeLinecap="round" />

          <ellipse cx="100" cy="98" rx="4" ry="5" fill="#FFB8A6" />
          <path d="M 100 98 L 100 103" stroke="#FFB8A6" strokeWidth="1.5" />

          <path d="M 88 108 Q 100 114 112 108" stroke="#FF6B9D" strokeWidth="3" fill="none" strokeLinecap="round" />
          <ellipse cx="100" cy="113" rx="8" ry="4" fill="#FF6B9D" opacity="0.3" />

          <ellipse cx="72" cy="95" rx="8" ry="5" fill="#FFB8A6" opacity="0.6" />
          <ellipse cx="128" cy="95" rx="8" ry="5" fill="#FFB8A6" opacity="0.6" />

          <circle cx="90" cy="92" r="1.5" fill="white" opacity="0.8" />
          <circle cx="110" cy="92" r="1.5" fill="white" opacity="0.8" />
        </g>

        <text x="100" y="188" fontSize="28" textAnchor="middle" opacity="0.95">
          {sportType === 'skate' && '🛹'}
          {sportType === 'rollers' && '🛼'}
          {sportType === 'bmx' && '🚴‍♂️'}
          {sportType === 'scooter' && '🛴'}
          {sportType === 'bike' && '🚲'}
        </text>
      </svg>
    </div>
  );
};

export default CharacterAvatar;
