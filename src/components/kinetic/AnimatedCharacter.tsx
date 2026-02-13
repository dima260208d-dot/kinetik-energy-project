import { useState, useEffect, useRef, useCallback } from 'react';
import { SPORT_ICONS, SportType, HAIRSTYLES, BODY_TYPES, HAIR_COLORS } from '@/types/kinetic';
import { getAvatarForSport } from '@/services/kineticApi';

interface AnimatedCharacterProps {
  sportType: SportType;
  bodyType: number;
  hairstyle: number;
  hairColor: string;
  name?: string;
  level?: number;
  avatarUrl?: string;
  celebrating?: boolean;
}

const AnimatedCharacter = ({ sportType, bodyType, hairstyle, hairColor, name, level = 1, avatarUrl, celebrating }: AnimatedCharacterProps) => {
  const avatar = avatarUrl || getAvatarForSport(sportType);
  const containerRef = useRef<HTMLDivElement>(null);
  const [eyeOffset, setEyeOffset] = useState({ x: 0, y: 0 });
  const [bounce, setBounce] = useState(false);

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const dx = e.clientX - centerX;
    const dy = e.clientY - centerY;
    const dist = Math.sqrt(dx * dx + dy * dy);
    const maxOffset = 6;
    const factor = Math.min(dist / 200, 1);
    setEyeOffset({
      x: (dx / (dist || 1)) * maxOffset * factor,
      y: (dy / (dist || 1)) * maxOffset * factor,
    });
  }, []);

  useEffect(() => {
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [handleMouseMove]);

  useEffect(() => {
    if (celebrating) {
      setBounce(true);
      const t = setTimeout(() => setBounce(false), 2000);
      return () => clearTimeout(t);
    }
  }, [celebrating]);

  const hairstyleName = HAIRSTYLES.find(h => h.id === hairstyle)?.name || '';
  const bodyName = BODY_TYPES.find(b => b.id === bodyType)?.name || '';
  const colorName = HAIR_COLORS.find(c => c.value === hairColor)?.name || '';

  return (
    <div className="relative" ref={containerRef}>
      <div className={`bg-gradient-to-br from-purple-100 to-blue-100 rounded-2xl p-6 border-4 border-purple-400 shadow-2xl ${celebrating ? 'animate-pulse' : ''}`}>
        <div className="relative flex flex-col items-center">
          {name && (
            <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-white px-4 py-2 rounded-full shadow-lg border-2 border-purple-400 z-10">
              <span className="font-bold text-purple-700">{name}</span>
            </div>
          )}

          <div className={`mb-4 mt-4 relative ${bounce ? 'animate-bounce' : ''}`}>
            <div className="w-48 h-48 rounded-2xl overflow-hidden border-4 border-white shadow-xl relative">
              <img
                src={avatar}
                alt={name || 'Персонаж'}
                className="w-full h-full object-cover character-idle"
              />
              <div
                className="absolute pointer-events-none"
                style={{
                  top: '28%',
                  left: '50%',
                  transform: `translate(-50%, -50%) translate(${eyeOffset.x}px, ${eyeOffset.y}px)`,
                  width: '60%',
                  height: '14%',
                  display: 'flex',
                  justifyContent: 'center',
                  gap: '18px',
                }}
              >
                <div className="w-3 h-3 bg-black rounded-full shadow-md opacity-60" />
                <div className="w-3 h-3 bg-black rounded-full shadow-md opacity-60" />
              </div>
            </div>

            <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 flex gap-1 opacity-40">
              <div className="w-1.5 h-1.5 bg-purple-400 rounded-full animate-ping" style={{ animationDelay: '0s' }} />
              <div className="w-1.5 h-1.5 bg-purple-400 rounded-full animate-ping" style={{ animationDelay: '0.5s' }} />
              <div className="w-1.5 h-1.5 bg-purple-400 rounded-full animate-ping" style={{ animationDelay: '1s' }} />
            </div>
          </div>

          <div className="text-5xl character-sport-icon">
            {SPORT_ICONS[sportType]}
          </div>
        </div>

        <div className="mt-4 grid grid-cols-3 gap-2 text-center text-xs">
          <div className="bg-white/80 rounded-lg p-2">
            <div className="text-lg">💇</div>
            <div className="font-semibold truncate">{hairstyleName}</div>
          </div>
          <div className="bg-white/80 rounded-lg p-2">
            <div className="w-5 h-5 rounded-full mx-auto border-2 border-gray-300" style={{ backgroundColor: hairColor }} />
            <div className="font-semibold truncate mt-1">{colorName}</div>
          </div>
          <div className="bg-white/80 rounded-lg p-2">
            <div className="text-lg">🏋️</div>
            <div className="font-semibold truncate">{bodyName}</div>
          </div>
        </div>
      </div>

      {level && (
        <div className={`absolute -top-4 -right-4 w-16 h-16 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center border-4 border-white shadow-xl ${bounce ? 'animate-spin' : ''}`}>
          <div className="text-center">
            <div className="text-xs font-bold text-white">LVL</div>
            <div className="text-xl font-bold text-white">{level}</div>
          </div>
        </div>
      )}

      <style>{`
        .character-idle {
          animation: characterIdle 3s ease-in-out infinite;
        }
        .character-sport-icon {
          animation: sportBounce 2s ease-in-out infinite;
        }
        @keyframes characterIdle {
          0%, 100% { transform: translateY(0) scale(1); }
          50% { transform: translateY(-4px) scale(1.01); }
        }
        @keyframes sportBounce {
          0%, 100% { transform: translateY(0) rotate(0deg); }
          25% { transform: translateY(-3px) rotate(-3deg); }
          75% { transform: translateY(-3px) rotate(3deg); }
        }
      `}</style>
    </div>
  );
};

export default AnimatedCharacter;
