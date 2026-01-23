import React, { useState, useEffect } from 'react';
import { UserProfile } from './types';
import { supabase } from './supabaseClient';

import { LoginPage } from './pages/LoginPage';
import { LandingPage } from './pages/LandingPage';
import { UserDashboard } from './pages/UserDashboard';
import { UserProfilePage } from './pages/UserProfilePage';
import { VotingPage } from './pages/VotingPage';
import { AdminDashboard } from './pages/AdminDashboard';
import { Navbar } from './components/Navbar';

import {
  getUsers,
  updateUser as updateUserStorage,
  updateVotes,
} from './services/storage';

const App: React.FC = () => {
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(null);
  const [allUsers, setAllUsers] = useState<UserProfile[]>([]);
  const [currentPage, setCurrentPage] = useState<
    | 'landing'
    | 'login'
    | 'dashboard'
    | 'profile'
    | 'voting'
    | 'admin-dashboard'
  >('landing');

  // ========================
  // FETCH USERS
  // ========================
  const fetchUsers = async () => {
    const users = await getUsers();
    setAllUsers(users);
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // ========================
  // LOGIN / LOGOUT
  // ========================
  const handleLogin = (user: UserProfile) => {
    const safeUser: UserProfile = {
      ...user,
      votesGiven: user.votesGiven ?? [],
      matches: user.matches ?? [],
    };

    setCurrentUser(safeUser);
    setCurrentPage(user.role === 'ADMIN' ? 'admin-dashboard' : 'dashboard');
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setCurrentPage('landing');
  };

  // ========================
  // UPDATE USER PROFILE
  // ========================
  const handleUpdateUser = async (updatedUser: UserProfile) => {
    try {
      await updateUserStorage(updatedUser);
      await fetchUsers();

      if (currentUser?.id === updatedUser.id) {
        setCurrentUser({
          ...updatedUser,
          votesGiven: updatedUser.votesGiven ?? [],
          matches: updatedUser.matches ?? [],
        });
      }
    } catch (err) {
      console.error('Update user failed:', err);
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

    const { error } = await supabase.from('users').insert([
      {
        id,
        username: template.username,
        password: template.password || '123',
        qr_token: token,
        role: 'USER',
        name: template.name || 'New Participant',
        gender: template.gender || 'Pria',
        bio: template.bio || 'Mencari percikan di Chindo Swipe!',
        photo_url: `https://picsum.photos/seed/${id}/400/400`,
        ig_handle: template.igHandle || '',
        job: template.job || '',
        age: template.age || 20,
        votes_given: [],
        matches: [],
      },
    ]);

    if (error) {
      console.error('Add user error:', error);
      return;
    }

    await fetchUsers();
    alert(`User added.\nQR Token: ${token}`);
  };

  // ========================
  // VOTE + MATCH (🔥 FIX UTAMA)
  // ========================
  const handleVote = async (candidateId: string) => {
    if (!currentUser) return;

    const votesGiven = currentUser.votesGiven ?? [];

    if (votesGiven.length >= 3) {
      alert('Tiket swipe habis (Max 3)');
      return;
    }

    if (votesGiven.includes(candidateId)) return;

    const updatedVotes = [...votesGiven, candidateId];

    try {
      // 1️⃣ simpan vote user sekarang
      await updateVotes(currentUser.id, updatedVotes);

      // 2️⃣ cari kandidat
      const candidate = allUsers.find(u => u.id === candidateId);
      if (!candidate) return;

      // 3️⃣ cek mutual like
      const isMatch = candidate.votesGiven?.includes(currentUser.id);

      if (isMatch) {
        const newCurrentMatches = [
          ...(currentUser.matches ?? []),
          candidateId,
        ];

        const newCandidateMatches = [
          ...(candidate.matches ?? []),
          currentUser.id,
        ];

        // 4️⃣ update matches ke DB
        await supabase
          .from('users')
          .update({ matches: newCurrentMatches })
          .eq('id', currentUser.id);

        await supabase
          .from('users')
          .update({ matches: newCandidateMatches })
          .eq('id', candidateId);

        alert(`💖 MATCH! Kamu & ${candidate.name.split(' ')[0]} cocok!`);
      }

      // 5️⃣ update local state
      setCurrentUser({
        ...currentUser,
        votesGiven: updatedVotes,
        matches: isMatch
          ? [...(currentUser.matches ?? []), candidateId]
          : currentUser.matches,
      });

      await fetchUsers();
    } catch (err) {
      console.error('Vote failed:', err);
    }
  };

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
  // RESET VOTES (ADMIN)
  // ========================
  const handleResetVotes = async () => {
    if (!confirm('Reset ALL voting data?')) return;

    const { error } = await supabase
      .from('users')
      .update({ votes_given: [], matches: [] })
      .neq('id', '');

    if (error) {
      console.error('Reset votes error:', error);
      return;
    }

    fetchUsers();
    setCurrentUser(null);
    setCurrentPage('landing');
  };

  // ========================
  // RENDER
  // ========================
  const renderPage = () => {
    if (currentPage === 'landing' && !currentUser)
      return <LandingPage onStart={() => setCurrentPage('login')} />;

    if (!currentUser)
      return <LoginPage onLogin={handleLogin} allUsers={allUsers} />;

    switch (currentPage) {
      case 'dashboard':
        return (
          <UserDashboard
            user={currentUser}
            allUsers={allUsers}
            onNavigate={setCurrentPage}
          />
        );
      case 'profile':
        return (
          <UserProfilePage
            user={currentUser}
            onUpdate={handleUpdateUser}
          />
        );
      case 'voting':
        return (
          <VotingPage
            currentUser={currentUser}
            candidates={allUsers}
            onVote={handleVote}
          />
        );
      case 'admin-dashboard':
        return (
          <AdminDashboard
            users={allUsers}
            onDeleteUser={handleDeleteUser}
            onResetVotes={handleResetVotes}
            onAddUser={handleAddUser}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-[#fafafa]">
      {currentPage !== 'landing' && (
        <Navbar
          user={currentUser}
          onLogout={handleLogout}
          onNavigate={setCurrentPage}
          activePage={currentPage}
        />
      )}
      <main>{renderPage()}</main>
    </div>
  );
};

export default App;
