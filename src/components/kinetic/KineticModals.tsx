import { Character } from '@/types/kinetic';
import ShopModal from './modals/ShopModal';
import GamesModal from './modals/GamesModal';
import TournamentsModal from './modals/TournamentsModal';
import ProModal from './modals/ProModal';

interface KineticModalsProps {
  showShop: boolean;
  setShowShop: (show: boolean) => void;
  showGames: boolean;
  setShowGames: (show: boolean) => void;
  showTournaments: boolean;
  setShowTournaments: (show: boolean) => void;
  showPro: boolean;
  setShowPro: (show: boolean) => void;
  setActiveGame: (game: 'simulator' | 'arena' | 'cards' | null) => void;
  character?: Character | null;
  onCharacterUpdate?: (char: Character) => void;
}

const KineticModals = ({
  showShop, setShowShop, showGames, setShowGames,
  showTournaments, setShowTournaments, showPro, setShowPro,
  setActiveGame, character, onCharacterUpdate
}: KineticModalsProps) => {
  return (
    <>
      <ShopModal
        show={showShop}
        onClose={() => setShowShop(false)}
        character={character}
        onCharacterUpdate={onCharacterUpdate}
      />
      <GamesModal
        show={showGames}
        onClose={() => setShowGames(false)}
        setActiveGame={setActiveGame}
      />
      <TournamentsModal
        show={showTournaments}
        onClose={() => setShowTournaments(false)}
        character={character}
        onCharacterUpdate={onCharacterUpdate}
      />
      <ProModal
        show={showPro}
        onClose={() => setShowPro(false)}
      />
    </>
  );
};

export default KineticModals;
