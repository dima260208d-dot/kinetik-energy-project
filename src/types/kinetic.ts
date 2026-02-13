export type SportType = 'skate' | 'rollers' | 'bmx' | 'scooter' | 'bike';
export type RidingStyle = 'aggressive' | 'technical' | 'freestyle';
export type TrickCategory = 'balance' | 'spins' | 'jumps' | 'slides' | 'flips';
export type TrickDifficulty = 'novice' | 'amateur' | 'pro' | 'legend';
export type ItemType = 'outfit' | 'equipment' | 'booster' | 'animation' | 'accessory';
export type ItemRarity = 'common' | 'rare' | 'epic' | 'legendary';

export interface Character {
  id: number;
  user_id: string;
  name: string;
  sport_type: SportType;
  sport_types: string[];
  riding_style: RidingStyle;
  level: number;
  experience: number;
  balance: number;
  speed: number;
  courage: number;
  body_type: number;
  hairstyle: number;
  hair_color: string;
  avatar_url?: string;
  outfit_id?: number;
  kinetics: number;
  premium_currency: number;
  is_pro: boolean;
  pro_expires_at?: string;
  games_won: number;
  games_played: number;
  age?: number;
  trainer_name?: string;
  created_at: string;
  updated_at: string;
}

export interface Trick {
  id: number;
  name: string;
  sport_type: SportType;
  category: TrickCategory;
  difficulty: TrickDifficulty;
  experience_reward: number;
  kinetics_reward: number;
  description?: string;
  created_at: string;
}

export interface CharacterTrick {
  id: number;
  character_id: number;
  trick_id: number;
  confirmed_by?: string;
  confirmed_at: string;
  trick?: Trick;
}

export interface PurchasedItem {
  id: number;
  character_id: number;
  item_type: string;
  item_value: string;
  item_name: string;
  cost: number;
  purchased_at: string;
}

export interface InventoryItem {
  id: number;
  character_id: number;
  item_type: ItemType;
  item_name: string;
  item_rarity?: ItemRarity;
  stats?: Record<string, unknown>;
  is_equipped: boolean;
  acquired_at: string;
}

export interface KineticsTransaction {
  id: number;
  character_id: number;
  amount: number;
  transaction_type: 'earn' | 'spend';
  source: string;
  description?: string;
  created_by?: string;
  created_at: string;
}

export interface CharacterNotification {
  id: number;
  character_id: number;
  title: string;
  message: string;
  notification_type: string;
  is_read: boolean;
  data?: string;
  created_at: string;
}

export interface Achievement {
  id: number;
  name: string;
  description: string;
  icon?: string;
  requirement_type: string;
  requirement_value: number;
  reward_kinetics: number;
  reward_item_id?: number;
  is_earned?: boolean;
  earned_at?: string;
  progress?: number;
  created_at: string;
}

export interface Tournament {
  id: number;
  week_start: string;
  week_end: string;
  month_key: string;
  status: string;
  entry_fee: number;
  created_at: string;
}

export interface TournamentEntry {
  id: number;
  tournament_id: number;
  character_id: number;
  score: number;
  games_score: number;
  tricks_score: number;
  training_score: number;
  rank?: number;
  joined_at: string;
  character_name?: string;
  avatar_url?: string;
  sport_type?: string;
  level?: number;
}

export interface TrainingVisit {
  id: number;
  character_id: number;
  visit_date: string;
  confirmed_by?: string;
  notes?: string;
  created_at: string;
}

export interface PublicProfile {
  character: Character;
  stats: {
    tricks_learned: number;
    achievements_earned: number;
    training_visits: number;
    tournament_history: Array<{
      score: number;
      rank: number;
      week_start: string;
      week_end: string;
    }>;
  };
}

export interface CharacterAchievement {
  id: number;
  character_id: number;
  achievement_id: number;
  earned_at: string;
  achievement?: Achievement;
}

export interface LeaderboardEntry {
  character_id: number;
  character_name: string;
  avatar_url?: string;
  sport_type?: string;
  level?: number;
  score: number;
  games_score?: number;
  tricks_score?: number;
  training_score?: number;
  rank?: number;
}

export interface Friendship {
  id: number;
  character_id: number;
  friend_character_id: number;
  status: 'pending' | 'accepted' | 'blocked';
  created_at: string;
  friend?: Character;
}

export interface Clan {
  id: number;
  name: string;
  description?: string;
  leader_character_id: number;
  max_members: number;
  created_at: string;
  members?: ClanMember[];
}

export interface ClanMember {
  id: number;
  clan_id: number;
  character_id: number;
  role: 'leader' | 'member';
  joined_at: string;
  character?: Character;
}

export interface DailyQuest {
  id: number;
  name: string;
  description: string;
  quest_type: string;
  requirement_value: number;
  reward_kinetics: number;
  reward_experience: number;
  is_active: boolean;
  created_at: string;
}

export interface CharacterQuest {
  id: number;
  character_id: number;
  quest_id: number;
  progress: number;
  completed: boolean;
  quest_date: string;
  completed_at?: string;
  quest?: DailyQuest;
}

export const SPORT_NAMES: Record<SportType, string> = {
  skate: 'Скейтборд',
  rollers: 'Ролики',
  bmx: 'BMX',
  scooter: 'Трюковой самокат',
  bike: 'Велосипед'
};

export const SPORT_ICONS: Record<SportType, string> = {
  skate: '🛹',
  rollers: '🛼',
  bmx: '🚴‍♂️',
  scooter: '🛴',
  bike: '🚲'
};

export const RIDING_STYLE_NAMES: Record<RidingStyle, string> = {
  aggressive: 'Агрессивный',
  technical: 'Технический',
  freestyle: 'Фристайл'
};

export const CATEGORY_NAMES: Record<TrickCategory, string> = {
  balance: 'Баланс',
  spins: 'Вращения',
  jumps: 'Прыжки',
  slides: 'Слайды',
  flips: 'Флипы'
};

export const DIFFICULTY_NAMES: Record<TrickDifficulty, string> = {
  novice: 'Новичок',
  amateur: 'Любитель',
  pro: 'Профи',
  legend: 'Легенда'
};

export const DIFFICULTY_COLORS: Record<TrickDifficulty, string> = {
  novice: 'bg-green-100 text-green-800 border-green-300',
  amateur: 'bg-blue-100 text-blue-800 border-blue-300',
  pro: 'bg-purple-100 text-purple-800 border-purple-300',
  legend: 'bg-orange-100 text-orange-800 border-orange-300'
};

export const HAIR_COLORS = [
  { name: 'Чёрный', value: '#000000' },
  { name: 'Коричневый', value: '#4A2511' },
  { name: 'Русый', value: '#8B7355' },
  { name: 'Блонд', value: '#F5E5B8' },
  { name: 'Рыжий', value: '#C73E1D' },
  { name: 'Красный', value: '#FF0000' },
  { name: 'Синий', value: '#0000FF' },
  { name: 'Зелёный', value: '#00FF00' },
  { name: 'Фиолетовый', value: '#9B59B6' },
  { name: 'Розовый', value: '#FF69B4' },
  { name: 'Белый', value: '#FFFFFF' },
  { name: 'Серый', value: '#808080' },
  { name: 'Бирюзовый', value: '#40E0D0' },
  { name: 'Оранжевый', value: '#FFA500' },
  { name: 'Жёлтый', value: '#FFD700' }
];

export const BODY_TYPES = [
  { id: 1, name: 'Худощавый', description: 'Лёгкий и быстрый' },
  { id: 2, name: 'Атлетический', description: 'Сбалансированный' },
  { id: 3, name: 'Мускулистый', description: 'Сильный и выносливый' },
  { id: 4, name: 'Коренастый', description: 'Устойчивый' },
  { id: 5, name: 'Подтянутый', description: 'Гибкий и ловкий' }
];

export const HAIRSTYLES = [
  { id: 1, name: 'Короткая стрижка' },
  { id: 2, name: 'Ирокез' },
  { id: 3, name: 'Андеркат' },
  { id: 4, name: 'Длинные волосы' },
  { id: 5, name: 'Дреды' },
  { id: 6, name: 'Помпадур' },
  { id: 7, name: 'Каре' },
  { id: 8, name: 'Афро' },
  { id: 9, name: 'Хвост' },
  { id: 10, name: 'Косички' }
];

export interface Accessory {
  id: number;
  name: string;
  description?: string;
  icon: string;
  item_type: string;
  rarity: ItemRarity;
  price: number;
  is_available: boolean;
  owned?: boolean;
  equipped?: boolean;
}

export const SHOP_ACCESSORIES = [
  { id: 'cap_cool', name: 'Крутая кепка', price: 200, icon: '🧢', rarity: 'rare' as ItemRarity, type: 'accessory' },
  { id: 'sneakers_style', name: 'Стильные кроссовки', price: 500, icon: '👟', rarity: 'epic' as ItemRarity, type: 'accessory' },
  { id: 'helmet_safe', name: 'Защитный шлем', price: 300, icon: '⛑️', rarity: 'common' as ItemRarity, type: 'accessory' },
  { id: 'board_graffiti', name: 'Граффити доска', price: 1000, icon: '🎨', rarity: 'legendary' as ItemRarity, type: 'accessory' },
  { id: 'booster_xp', name: 'Бустер опыта x2', price: 150, icon: '⚡', rarity: 'rare' as ItemRarity, type: 'booster' },
  { id: 'aura_neon', name: 'Аура неона', price: 750, icon: '💫', rarity: 'epic' as ItemRarity, type: 'accessory' },
  { id: 'gloves_pro', name: 'Про перчатки', price: 250, icon: '🧤', rarity: 'rare' as ItemRarity, type: 'accessory' },
  { id: 'sunglasses', name: 'Солнцезащитные очки', price: 180, icon: '🕶️', rarity: 'common' as ItemRarity, type: 'accessory' },
];

export const CUSTOMIZATION_PRICES: Record<string, number> = {
  hairstyle: 30,
  hair_color: 20,
  body_type: 50,
  name: 50,
  add_sport: 100,
};