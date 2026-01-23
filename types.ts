export type Gender = 'Pria' | 'Wanita';
export type Role = 'ADMIN' | 'USER';

export interface UserProfile {
  id: string;
  username: string;
  password?: string;

  qrToken: string;
  role: Role;
  name: string;
  gender: Gender;
  bio: string;

  photoUrl: string;
  igHandle: string;
  job: string;
  age: number;

  votesGiven: string[];
  matches: string[];
}

export interface AuthState {
  currentUser: UserProfile | null;
  isAuthenticated: boolean;
}
