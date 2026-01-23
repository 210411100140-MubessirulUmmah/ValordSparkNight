// storage.ts
import { supabase } from '../supabaseClient';
import { UserProfile } from '../types';
import { mapUserFromDB, mapUserToDB } from './userMapper';

/**
 * Ambil semua user
 */
export const getUsers = async (): Promise<UserProfile[]> => {
  const { data, error } = await supabase
    .from('users')
    .select('*');

  if (error) {
    console.error('getUsers error:', error);
    return [];
  }

  return data.map(mapUserFromDB);
};

/**
 * Update seluruh profile user (edit profil)
 */
export const updateUser = async (user: UserProfile) => {
  const { error } = await supabase
    .from('users')
    .update(mapUserToDB(user)) // semua field untuk profile edit
    .eq('id', user.id);

  if (error) {
    console.error('updateUser error:', error);
    throw error;
  }
};

/**
 * Update hanya votes user (safe untuk voting)
 */
export const updateVotes = async (userId: string, votesGiven: string[]) => {
  const { error } = await supabase
    .from('users')
    .update({ votes_given: votesGiven })
    .eq('id', userId);

  if (error) {
    console.error('updateVotes error:', error);
    throw error;
  }
};
