export type ReactionType = 'superb' | 'ok' | 'fine' | 'bad' | 'want_to_try' | 'no_interest';

export interface Restaurant {
  id: string;
  name: string;
  cuisine: string; // e.g. "川菜", "日料", "汉堡", "粉面"
  desc: string;
  rating: number;
  avgPrice: number;
  distance: number; // in meters (<= 1000)
  deliveryTime: number; // in minutes (<= 40)
  emoji: string;
  coordinates: { x: number; y: number }; // X, Y offset from center (Fuxing SOHO: 0,0) (-100 to 100)
  famousDish: string;
  famousDishes?: string[];
  memeComment: string; // Playful startup/meme review
}

export type UserStatus = 'clear' | 'spicy' | 'no_queue';

export interface Friend {
  id: string;
  name: string;
  avatar: string;
  department: string;
  role: 'Intern' | 'Full-time';
  personality: string[];
  favoriteRestaurantIds: string[];
  statusSignal: boolean;
}

export interface GroupMeal {
  id: string;
  creator: Friend;
  restaurant: Restaurant;
  time: string;
  members: Friend[];
  maxMembers: number;
}

export interface AACalculatorItem {
  id: string;
  name: string;
  price: number;
}

export interface AAPlayer {
  id: string;
  name: string;
  items: AACalculatorItem[];
}
