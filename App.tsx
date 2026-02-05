import React, { useEffect, useState } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import { UserProfile } from './types';
import { supabase } from './supabaseClient';
import { PublicRoute } from './components/PublicRoute';


import { LoginPage } from './pages/LoginPage';
import { LandingPage } from './pages/LandingPage';
import { UserDashboard } from './pages/UserDashboard';
import { UserProfilePage } from './pages/UserProfilePage';
import { VotingPage } from './pages/VotingPage';
import { AdminDashboard } from './pages/AdminDashboard';
import { Navbar } from './components/Navbar';
import { ProtectedRoute } from './components/ProtectedRoute';

import {
  getUsers,
  updateUser as updateUserStorage,
  updateVotes,
} from './services/storage';

const STORAGE_KEY = 'currentUser';

const App: React.FC = () => {
  const navigate = useNavigate();

  const [currentUser, setCurrentUser] = useState<UserProfile | null>(null);
  const [allUsers, setAllUsers] = useState<UserProfile[]>([]);

  // ========================
  // FETCH USERS
  // ========================
  const fetchUsers = async () => {
    const users = await getUsers();
    setAllUsers(users);
  };

  // ========================
  // INIT APP (AUTO LOGIN)
  // ========================
  useEffect(() => {
    const init = async () => {
      await fetchUsers();

      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed: UserProfile = JSON.parse(saved);
        setCurrentUser({
          ...parsed,
          votesGiven: parsed.votesGiven ?? [],
          matches: parsed.matches ?? [],
        });
      }
    };

    init();
  }, []);

  // ========================
  // DELETE USER (ADMIN)
  // ========================
  const handleDeleteUser = async (id: string) => {
    if (!confirm('Remove participant from event?')) return;

    const { error } = await supabase.from('users').delete().eq('id', id);
    if (error) {
      console.error('Delete user error:', error);
      return;
    }

    fetchUsers();
  };

  // ========================
  // LOGIN / LOGOUT
  // ========================
  const handleLogin = (user: UserProfile) => {
    const safeUser: UserProfile = {
      ...user,
      votesGiven: user.votesGiven ?? [],
      matches: user.matches ?? [],
    };

    localStorage.setItem(STORAGE_KEY, JSON.stringify(safeUser));
    setCurrentUser(safeUser);

    navigate(user.role === 'ADMIN' ? '/admin' : '/dashboard');
  };

  const handleLogout = () => {
    localStorage.removeItem(STORAGE_KEY);
    setCurrentUser(null);
    navigate('/');
  };

  // ========================
  // UPDATE USER PROFILE
  // ========================
  const handleUpdateUser = async (updatedUser: UserProfile) => {
    await updateUserStorage(updatedUser);
    await fetchUsers();

    if (currentUser?.id === updatedUser.id) {
      const safeUser = {
        ...updatedUser,
        votesGiven: updatedUser.votesGiven ?? [],
        matches: updatedUser.matches ?? [],
      };

      setCurrentUser(safeUser);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(safeUser));
    }
  };

  // ========================
  // ADD USER (ADMIN)
  // ========================
  const handleAddUser = async (template: Partial<UserProfile>) => {
    const id = crypto.randomUUID();
    const token = Math.random()
      .toString(36)
      .substring(2, 10)
      .toUpperCase();

    await supabase.from('users').insert([
      {
        id,
        username: template.username,
        password: template.password || '123',
        qr_token: token,
        role: 'USER',
        name: template.name || 'New Participant',
        gender: template.gender || 'Pria',
        bio: template.bio || '',
        photo_url: `/images/${template.username}.jpg`,
        ig_handle: template.igHandle || '',
        job: template.job || '',
        age: template.age || 20,
        votes_given: [],
        matches: [],
      },
    ]);

    await fetchUsers();
    alert(`User added.\nQR Token: ${token}`);
  };

  // ========================
  // VOTE + MATCH
  // ========================
  const handleVote = async (candidateId: string) => {
    if (!currentUser) return;

    const votesGiven = currentUser.votesGiven ?? [];
    if (votesGiven.length >= 3 || votesGiven.includes(candidateId)) return;

    const updatedVotes = [...votesGiven, candidateId];
    await updateVotes(currentUser.id, updatedVotes);

    const candidate = allUsers.find(u => u.id === candidateId);
    if (!candidate) return;

    const isMatch = candidate.votesGiven?.includes(currentUser.id);

    if (isMatch) {
      await supabase.from('users').update({
        matches: [...(currentUser.matches ?? []), candidateId],
      }).eq('id', currentUser.id);

      await supabase.from('users').update({
        matches: [...(candidate.matches ?? []), currentUser.id],
      }).eq('id', candidateId);

      alert(`💖 MATCH! Kamu & ${candidate.name.split(' ')[0]} cocok!`);
    }

    const updatedUser = {
      ...currentUser,
      votesGiven: updatedVotes,
      matches: isMatch
        ? [...(currentUser.matches ?? []), candidateId]
        : currentUser.matches,
    };

    setCurrentUser(updatedUser);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedUser));
    await fetchUsers();
  };

  // ========================
  // RESET VOTES (ADMIN)
  // ========================
  const handleResetVotes = async () => {
    await supabase
      .from('users')
      .update({ votes_given: [], matches: [] })
      .neq('id', '');

    localStorage.removeItem(STORAGE_KEY);
    setCurrentUser(null);
    navigate('/');
  };

  // ========================
  // RENDER
  // ========================
  return (
    <div className="min-h-screen bg-[#fafafa]">
      {currentUser && (
        <Navbar
          user={currentUser}
          onLogout={handleLogout}
        />
      )}

      <Routes>
        <Route path="/" element={<LandingPage />} />
        {/* <Route path="/login" element={<LoginPage onLogin={handleLogin} />} /> */}
        <Route
  path="/login"
  element={
    <PublicRoute user={currentUser}>
      <LoginPage onLogin={handleLogin} />
    </PublicRoute>
  }
/>


        <Route
          path="/dashboard"
          element={
            <ProtectedRoute user={currentUser}>
              <UserDashboard user={currentUser!} allUsers={allUsers} />
            </ProtectedRoute>
          }
        />

        <Route
          path="/profile"
          element={
            <ProtectedRoute user={currentUser}>
              <UserProfilePage user={currentUser!} onUpdate={handleUpdateUser} />
            </ProtectedRoute>
          }
        />

        <Route
          path="/voting"
          element={
            <ProtectedRoute user={currentUser}>
              <VotingPage
                currentUser={currentUser!}
                candidates={allUsers}
                onVote={handleVote}
              />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin"
          element={
            <ProtectedRoute user={currentUser}>
              <AdminDashboard
                users={allUsers}
                onDeleteUser={handleDeleteUser}
                onAddUser={handleAddUser}
                onResetVotes={handleResetVotes}
              />
            </ProtectedRoute>
          }
        />
      </Routes>
    </div>
  );
};

export default App;
