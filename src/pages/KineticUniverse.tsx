import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';
import Navigation from '@/components/Navigation';
import AnimatedCharacter from '@/components/kinetic/AnimatedCharacter';
import CharacterInfoCard from '@/components/kinetic/CharacterInfoCard';
import KineticTabs from '@/components/kinetic/KineticTabs';
import KineticModals from '@/components/kinetic/KineticModals';
import NotificationBell from '@/components/kinetic/NotificationBell';
import TrickSimulator from '@/components/kinetic/games/TrickSimulator';
import TournamentArena from '@/components/kinetic/games/TournamentArena';
import CardBattle from '@/components/kinetic/games/CardBattle';
import { Character, Trick, CharacterTrick } from '@/types/kinetic';
import { useToast } from '@/hooks/use-toast';
import { fireConfetti } from '@/utils/confetti';
import * as api from '@/services/kineticApi';

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
  const [celebrating, setCelebrating] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    if (!user?.id) return;
    try {
      const char = await api.getMyCharacter(user.id);
      if (!char) {
        navigate('/character-creation');
        return;
      }
      setCharacter(char);

      const [allChars, sportTricks, mastered] = await Promise.all([
        api.getAllCharacters(),
        api.getTricks(char.sport_type),
        api.getMasteredTricks(char.id),
      ]);
      setCharacters(allChars);
      setTricks(sportTricks);
      setMasteredTricks(mastered);
    } catch {
      toast({ title: 'Ошибка загрузки', description: 'Не удалось загрузить данные', variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  const celebrate = () => {
    setCelebrating(true);
    fireConfetti();
    setTimeout(() => setCelebrating(false), 3000);
  };

  const getExperienceForNextLevel = (level: number) => level * 100;

  const getTricksByCategory = (category: string) => tricks.filter(t => t.category === category);

  const isTrickMastered = (trickId: number) => masteredTricks.some(mt => mt.trick_id === trickId);

  const getTrickProgress = () => {
    const total = tricks.length;
    const mastered = tricks.filter(t => isTrickMastered(t.id)).length;
    return total > 0 ? (mastered / total) * 100 : 0;
  };

  const handleGameComplete = async (earnedXP: number = 0, earnedKinetics: number = 0, won: boolean = true) => {
    if (!character) return;
    try {
      const gameName = activeGame || 'game';
      const result = await api.gameComplete(character.id, earnedXP, earnedKinetics, gameName, won);
      const prevLevel = character.level;
      setCharacter(result.character);

      const allChars = await api.getAllCharacters();
      setCharacters(allChars);

      if (won) {
        celebrate();
      }

      if (result.character.level > prevLevel) {
        celebrate();
        toast({ title: '🎉 Новый уровень!', description: `Ты достиг ${result.character.level} уровня!` });
      }

      toast({
        title: won ? 'Победа!' : 'Хорошая попытка!',
        description: `+${earnedXP} XP, +${earnedKinetics} 💰`
      });

      if (result.new_achievements?.length > 0) {
        result.new_achievements.forEach((ach: { name: string; reward_kinetics: number }) => {
          toast({ title: `🏆 ${ach.name}!`, description: `Награда: +${ach.reward_kinetics} 💰` });
        });
      }
    } catch {
      toast({ title: 'Ошибка', description: 'Не удалось сохранить результат', variant: 'destructive' });
    }
    setActiveGame(null);
    setShowGames(false);
  };

  const handleCharacterUpdate = (updatedChar: Character) => {
    setCharacter(updatedChar);
    celebrate();
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
          <div className="flex items-center gap-2">
            <NotificationBell characterId={character.id} />
            <Navigation currentPage="dashboard" />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          <div>
            <AnimatedCharacter
              sportType={character.sport_type}
              bodyType={character.body_type}
              hairstyle={character.hairstyle}
              hairColor={character.hair_color}
              name={character.name}
              level={character.level}
              avatarUrl={character.avatar_url}
              celebrating={celebrating}
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
              <div className="text-sm">PRO</div>
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
          character={character}
          onCharacterUpdate={handleCharacterUpdate}
        />

        {activeGame === 'simulator' && (
          <TrickSimulator
            tricks={tricks}
            onComplete={handleGameComplete}
            onClose={() => setActiveGame(null)}
          />
        )}
        {activeGame === 'arena' && (
          <TournamentArena
            tricks={tricks}
            character={character}
            onComplete={handleGameComplete}
            onClose={() => setActiveGame(null)}
          />
        )}
        {activeGame === 'cards' && (
          <CardBattle
            tricks={tricks}
            character={character}
            onComplete={handleGameComplete}
            onClose={() => setActiveGame(null)}
          />
        )}
      </div>
    </div>
  );
};

export default KineticUniverse;
