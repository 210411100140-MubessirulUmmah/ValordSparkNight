import { UserProfile } from '../types';

export const mapUserFromDB = (row: any): UserProfile => ({
  id: row.id,
  username: row.username,
  password: row.password,

  qrToken: row.qr_token,
  role: row.role,
  name: row.name,
  gender: row.gender,
  bio: row.bio,

  photoUrl: row.photo_url || '/images/Avatar.png',
  igHandle: row.ig_handle,
  job: row.job,
  age: row.age,

  votesGiven: row.votes_given ?? [],
  matches: row.matches ?? []
});

export const mapUserToDB = (user: UserProfile) => ({
  id: user.id,
  username: user.username,
  password: user.password,

  qr_token: user.qrToken,
  role: user.role,
  name: user.name,
  gender: user.gender,
  bio: user.bio,

  photo_url: user.photoUrl || '/images/Avatar.png',
  ig_handle: user.igHandle,
  job: user.job,
  age: user.age,

  votes_given: user.votesGiven,
  matches: user.matches
});
