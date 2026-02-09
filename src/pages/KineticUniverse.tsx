import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';
import Navigation from '@/components/Navigation';
import CharacterPreview from '@/components/kinetic/CharacterPreview';
import CharacterInfoCard from '@/components/kinetic/CharacterInfoCard';
import KineticTabs from '@/components/kinetic/KineticTabs';
import KineticModals from '@/components/kinetic/KineticModals';
import TrickSimulator from '@/components/kinetic/games/TrickSimulator';
import TournamentArena from '@/components/kinetic/games/TournamentArena';
import CardBattle from '@/components/kinetic/games/CardBattle';
import { Character, Trick, CharacterTrick } from '@/types/kinetic';
import { useToast } from '@/hooks/use-toast';

const KineticUniverse = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [character, setCharacter] = useState<Character | null>(null);
  const [characters, setCharacters] = useState<Character[]>([]);
  const [tricks, setTricks] = useState<Trick[]>([]);
  const [masteredTricks, setMasteredTricks] = useState<CharacterTrick[]>([]);
  const [loading, setLoading] = useState(true);
  const [showShop, setShowShop] = useState(false);
  const [showGames, setShowGames] = useState(false);
  const [showTournaments, setShowTournaments] = useState(false);
  const [showPro, setShowPro] = useState(false);
  const [activeGame, setActiveGame] = useState<'simulator' | 'arena' | 'cards' | null>(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    const stored = localStorage.getItem('kinetic_universe_data');
    const data = stored ? JSON.parse(stored) : { characters: [], masteredTricks: [] };

    const userCharacter = data.characters?.find((c: Character) => c.user_id === user?.id);
    
    if (!userCharacter) {
      navigate('/character-creation');
      return;
    }

    setCharacter(userCharacter);
    setCharacters(data.characters || []);
    setMasteredTricks(data.masteredTricks?.filter((mt: CharacterTrick) => mt.character_id === userCharacter.id) || []);
    
    loadTricksForSport(userCharacter.sport_type);
    setLoading(false);
  };

  const loadTricksForSport = (sportType: string) => {
    const mockTricks: Trick[] = [
      { id: 1, name: 'Ollie', sport_type: 'skate', category: 'jumps', difficulty: 'novice', experience_reward: 50, kinetics_reward: 10, description: 'Базовый прыжок', created_at: '' },
      { id: 2, name: 'Kickflip', sport_type: 'skate', category: 'flips', difficulty: 'amateur', experience_reward: 100, kinetics_reward: 20, description: 'Вращение доски', created_at: '' },
      { id: 3, name: 'Heelflip', sport_type: 'skate', category: 'flips', difficulty: 'amateur', experience_reward: 100, kinetics_reward: 20, description: 'Вращение пяткой', created_at: '' },
      { id: 4, name: 'Pop Shove-It', sport_type: 'skate', category: 'spins', difficulty: 'novice', experience_reward: 60, kinetics_reward: 12, description: 'Вращение доски 180', created_at: '' },
      { id: 5, name: 'Frontside 180', sport_type: 'skate', category: 'spins', difficulty: 'amateur', experience_reward: 80, kinetics_reward: 15, description: 'Разворот лицом', created_at: '' },
      { id: 6, name: 'Backside 180', sport_type: 'skate', category: 'spins', difficulty: 'amateur', experience_reward: 80, kinetics_reward: 15, description: 'Разворот спиной', created_at: '' },
      { id: 7, name: 'Boardslide', sport_type: 'skate', category: 'slides', difficulty: 'pro', experience_reward: 150, kinetics_reward: 30, description: 'Скольжение по грани', created_at: '' },
      { id: 8, name: '50-50 Grind', sport_type: 'skate', category: 'slides', difficulty: 'pro', experience_reward: 150, kinetics_reward: 30, description: 'Грайнд на подвесках', created_at: '' },
      { id: 9, name: 'Manual', sport_type: 'skate', category: 'balance', difficulty: 'novice', experience_reward: 40, kinetics_reward: 8, description: 'Баланс на задних колёсах', created_at: '' },
      { id: 10, name: 'Drop-in', sport_type: 'skate', category: 'jumps', difficulty: 'amateur', experience_reward: 90, kinetics_reward: 18, description: 'Заезд в рампу', created_at: '' },
    ];

    setTricks(mockTricks.filter(t => t.sport_type === sportType));
  };

  const getExperienceForNextLevel = (level: number) => {
    return level * 100;
  };

  const getTricksByCategory = (category: string) => {
    return tricks.filter(t => t.category === category);
  };

  const isTrickMastered = (trickId: number) => {
    return masteredTricks.some(mt => mt.trick_id === trickId);
  };

  const getTrickProgress = () => {
    const total = tricks.length;
    const mastered = tricks.filter(t => isTrickMastered(t.id)).length;
    return total > 0 ? (mastered / total) * 100 : 0;
  };

  const handleGameComplete = (earnedXP: number = 0, earnedKinetics: number = 0, won: boolean = true) => {
    if (!character) return;

    const stored = localStorage.getItem('kinetic_universe_data');
    const data = stored ? JSON.parse(stored) : { characters: [], masteredTricks: [] };
    
    const updatedCharacters = data.characters.map((c: Character) => {
      if (c.id === character.id) {
        const newExp = c.experience + earnedXP;
        const newLevel = Math.min(Math.floor(newExp / 100) + 1, 100);
        return { 
          ...c, 
          experience: newExp,
          level: newLevel,
          kinetics: c.kinetics + earnedKinetics 
        };
      }
      return c;
    });

    data.characters = updatedCharacters;
    localStorage.setItem('kinetic_universe_data', JSON.stringify(data));
    
    const updatedChar = updatedCharacters.find((c: Character) => c.id === character.id);
    setCharacter(updatedChar);
    setCharacters(updatedCharacters);

    toast({
      title: won ? 'Игра завершена!' : 'Хорошая попытка!',
      description: `+${earnedXP} XP, +${earnedKinetics} 💰`
    });

    setActiveGame(null);
    setShowGames(false);
  };

  if (loading || !character) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center">
        <div className="text-white text-xl">Загрузка...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 p-4">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold text-white flex items-center gap-2">
              🌌 Kinetic Universe
            </h1>
            <p className="text-blue-200">Добро пожаловать, {character.name}!</p>
          </div>
          <Navigation currentPage="dashboard" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          <div>
            <CharacterPreview
              sportType={character.sport_type}
              bodyType={character.body_type}
              hairstyle={character.hairstyle}
              hairColor={character.hair_color}
              name={character.name}
              level={character.level}
            />
          </div>

          <CharacterInfoCard
            character={character}
            getExperienceForNextLevel={getExperienceForNextLevel}
          />
        </div>

        <KineticTabs
          character={character}
          characters={characters}
          tricks={tricks}
          getTricksByCategory={getTricksByCategory}
          isTrickMastered={isTrickMastered}
          getTrickProgress={getTrickProgress}
        />

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
          <Button onClick={() => setShowShop(true)} className="h-20 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700">
            <div className="text-center">
              <Icon name="Sparkles" className="w-6 h-6 mx-auto mb-1" />
              <div className="text-sm">Магазин</div>
            </div>
          </Button>
          <Button onClick={() => setShowGames(true)} className="h-20 bg-gradient-to-r from-green-600 to-teal-600 hover:from-green-700 hover:to-teal-700">
            <div className="text-center">
              <Icon name="Gamepad2" className="w-6 h-6 mx-auto mb-1" />
              <div className="text-sm">Мини-игры</div>
            </div>
          </Button>
          <Button onClick={() => setShowTournaments(true)} className="h-20 bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700">
            <div className="text-center">
              <Icon name="Trophy" className="w-6 h-6 mx-auto mb-1" />
              <div className="text-sm">Турниры</div>
            </div>
          </Button>
          <Button onClick={() => setShowPro(true)} className="h-20 bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-700 hover:to-purple-700">
            <div className="text-center">
              <Icon name="Crown" className="w-6 h-6 mx-auto mb-1" />
              <div className="text-sm">Kinetic Pro</div>
            </div>
          </Button>
        </div>

        <KineticModals
          showShop={showShop}
          setShowShop={setShowShop}
          showGames={showGames}
          setShowGames={setShowGames}
          showTournaments={showTournaments}
          setShowTournaments={setShowTournaments}
          showPro={showPro}
          setShowPro={setShowPro}
          setActiveGame={setActiveGame}
        />

        {activeGame === 'simulator' && (
          <TrickSimulator
            tricks={tricks}
            onComplete={(xp, kinetics) => handleGameComplete(xp, kinetics, true)}
            onClose={() => setActiveGame(null)}
          />
        )}

        {activeGame === 'arena' && (
          <TournamentArena
            tricks={tricks}
            playerName={character.name}
            onComplete={(won, kinetics) => handleGameComplete(0, kinetics, won)}
            onClose={() => setActiveGame(null)}
          />
        )}

        {activeGame === 'cards' && (
          <CardBattle
            tricks={tricks}
            onComplete={(kinetics) => handleGameComplete(0, kinetics, true)}
            onClose={() => setActiveGame(null)}
          />
        )}


      </div>
    </div>
  );
};

export default KineticUniverse;