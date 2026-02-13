import funcUrls from '../../backend/func2url.json';
import { Achievement, CharacterNotification, KineticsTransaction } from '@/types/kinetic';

const API_URL = funcUrls['kinetic-api'];

const SPORT_AVATARS: Record<string, string> = {
  skate: 'https://cdn.poehali.dev/projects/0c4f37be-1173-4603-b652-9ad25c1071b9/files/f84de1b3-c449-41d4-ae13-02c551d8ff9f.jpg',
  rollers: 'https://cdn.poehali.dev/projects/0c4f37be-1173-4603-b652-9ad25c1071b9/files/84387cf9-6400-4cd1-86f6-07f70e7b14c3.jpg',
  bmx: 'https://cdn.poehali.dev/projects/0c4f37be-1173-4603-b652-9ad25c1071b9/files/d799a9a2-36ea-4c3f-8b8b-4ea2b81789f8.jpg',
  scooter: 'https://cdn.poehali.dev/projects/0c4f37be-1173-4603-b652-9ad25c1071b9/files/f591c071-da0e-4dc8-b60f-1e187ca6aacf.jpg',
  bike: 'https://cdn.poehali.dev/projects/0c4f37be-1173-4603-b652-9ad25c1071b9/files/85a72636-b6aa-46f1-9e7a-809ff8336c0e.jpg',
};

export function getAvatarForSport(sportType: string): string {
  return SPORT_AVATARS[sportType] || SPORT_AVATARS.skate;
}

async function request(method: string, params: Record<string, string> = {}, body?: Record<string, unknown>, extraHeaders?: Record<string, string>) {
  const url = new URL(API_URL);
  Object.entries(params).forEach(([k, v]) => url.searchParams.set(k, v));

  const res = await fetch(url.toString(), {
    method,
    headers: {
      'Content-Type': 'application/json',
      ...extraHeaders,
    },
    body: body ? JSON.stringify(body) : undefined,
  });

  const data = await res.json();
  if (!res.ok && res.status !== 404) {
    throw new Error(data.error || 'API Error');
  }
  return { status: res.status, data };
}

export async function getMyCharacter(userId: string) {
  const { status, data } = await request('GET', { action: 'my_character', user_id: userId });
  if (status === 404) return null;
  return data.character;
}

export async function getAllCharacters() {
  const { data } = await request('GET', { action: 'all_characters' });
  return data.characters || [];
}

export async function getTricks(sportType: string) {
  const { data } = await request('GET', { action: 'tricks', sport_type: sportType });
  return data.tricks || [];
}

export async function getMasteredTricks(characterId: number) {
  const { data } = await request('GET', { action: 'mastered_tricks', character_id: String(characterId) });
  return data.mastered_tricks || [];
}

export async function createCharacter(characterData: {
  user_id: string;
  name: string;
  sport_type: string;
  riding_style?: string;
  body_type?: number;
  hairstyle?: number;
  hair_color?: string;
  avatar_url?: string;
}) {
  const { data } = await request('POST', {}, { ...characterData, action: 'create_character' });
  return data.character;
}

export async function updateCharacter(characterId: number, fields: Record<string, unknown>) {
  const { data } = await request('POST', {}, { ...fields, character_id: characterId, action: 'update_character' });
  return data.character;
}

export async function addKinetics(characterId: number, amount: number, source: string, description: string, createdBy?: string) {
  const { data } = await request('POST', {}, {
    action: 'add_kinetics',
    character_id: characterId,
    amount,
    source,
    description,
    created_by: createdBy,
  });
  return data;
}

export async function confirmTricks(characterId: number, trickIds: number[], confirmedBy?: string) {
  const { data } = await request('POST', {}, {
    action: 'confirm_tricks',
    character_id: characterId,
    trick_ids: trickIds,
    confirmed_by: confirmedBy,
  });
  return data;
}

export async function gameComplete(characterId: number, earnedXp: number, earnedKinetics: number, gameName: string, won: boolean = true, score: number = 0) {
  const { data } = await request('POST', {}, {
    action: 'game_complete',
    character_id: characterId,
    earned_xp: earnedXp,
    earned_kinetics: earnedKinetics,
    game_name: gameName,
    won,
    score,
  });
  return data;
}

export async function getTransactions(characterId: number): Promise<KineticsTransaction[]> {
  const { data } = await request('GET', { action: 'transactions', character_id: String(characterId) });
  return data.transactions || [];
}

export async function getNotifications(characterId: number): Promise<{ notifications: CharacterNotification[]; unread_count: number }> {
  const { data } = await request('GET', { action: 'notifications', character_id: String(characterId) });
  return { notifications: data.notifications || [], unread_count: data.unread_count || 0 };
}

export async function markNotificationsRead(characterId: number, notificationIds?: number[]) {
  const { data } = await request('POST', {}, {
    action: 'mark_notifications_read',
    character_id: characterId,
    notification_ids: notificationIds,
  });
  return data;
}

export async function getAchievements(characterId: number): Promise<Achievement[]> {
  const { data } = await request('GET', { action: 'achievements', character_id: String(characterId) });
  return data.achievements || [];
}

export async function purchaseCustomization(characterId: number, itemType: string, itemValue: string | number, cost: number) {
  const { data } = await request('POST', {}, {
    action: 'purchase_customization',
    character_id: characterId,
    item_type: itemType,
    item_value: itemValue,
    cost,
  });
  return data;
}

export default {
  getMyCharacter,
  getAllCharacters,
  getTricks,
  getMasteredTricks,
  createCharacter,
  updateCharacter,
  addKinetics,
  confirmTricks,
  gameComplete,
  getTransactions,
  getNotifications,
  markNotificationsRead,
  getAchievements,
  purchaseCustomization,
  getAvatarForSport,
};
