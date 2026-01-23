import React from 'react';
import { UserProfile } from '../types';

interface UserDashboardProps {
  user: UserProfile;
  allUsers: UserProfile[];
  onNavigate: (page: string) => void;
}

export const UserDashboard: React.FC<UserDashboardProps> = ({
  user,
  allUsers,
  onNavigate,
}) => {
  // ======================
  // MATCH LOGIC (SUPABASE)
  // ======================
  const myMatches = allUsers.filter(u =>
    user.votesGiven?.includes(u.id) &&
    u.votesGiven?.includes(user.id)
  );

  return (
    <div className="max-w-7xl mx-auto py-12 px-6">
      {/* ===== PROFILE CARD ===== */}
      <div className="bg-white rounded-[3.5rem] p-10 shadow-[0_20px_80px_rgba(0,0,0,0.05)] border border-gray-100 mb-12 flex flex-col md:flex-row items-center gap-10 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-red-50 rounded-full blur-[100px] -mr-32 -mt-32"></div>

        <div className="relative group">
          <img
            src={user.photoUrl}
            alt={user.name}
            className="w-40 h-40 rounded-[2.5rem] object-cover ring-8 ring-red-50 shadow-2xl transition-transform duration-500 group-hover:scale-105"
          />
          <div className="absolute -bottom-2 -right-2 bg-yellow-400 text-red-900 w-10 h-10 rounded-full border-4 border-white shadow-lg flex items-center justify-center font-bold">
            ✓
          </div>
        </div>

        <div className="text-center md:text-left flex-1 relative z-10">
          <div className="inline-block px-3 py-1 rounded-lg bg-[#8B0000] text-yellow-400 text-[10px] font-black uppercase tracking-[0.2em] mb-3">
            Chindo Swipe Participant
          </div>

          <h1 className="text-4xl font-header text-gray-900 mb-2 tracking-tighter uppercase">
            Welcome, {user.name.split(' ')[0]}!
          </h1>

          <p className="text-gray-400 font-medium text-lg mb-6 leading-relaxed">
            Siap mencari "Spark" di malam Valentine PIK? Gunakan kesempatanmu dengan bijak.
          </p>

          <div className="flex flex-wrap gap-3 justify-center md:justify-start">
            <div className="bg-white border border-red-100 px-5 py-2.5 rounded-2xl shadow-sm flex items-center">
              <span className="text-[#8B0000] mr-2 font-bold">❤️</span>
              <span className="text-[10px] font-black uppercase tracking-widest text-gray-600">
                {3 - (user.votesGiven?.length || 0)} Swipes Left
              </span>
            </div>

            <div className="bg-white border border-red-100 px-5 py-2.5 rounded-2xl shadow-sm flex items-center">
              <span className="text-yellow-500 mr-2 font-bold">✨</span>
              <span className="text-[10px] font-black uppercase tracking-widest text-gray-600">
                {myMatches.length} Matches Found
              </span>
            </div>
          </div>
        </div>

        <button
          onClick={() => onNavigate('voting')}
          className="bg-[#8B0000] hover:bg-black text-white px-10 py-5 rounded-[2rem] font-header shadow-2xl shadow-red-200 transition-all hover:-translate-y-1 hover:scale-105 active:scale-95 text-xl tracking-widest"
        >
          START SWIPING 🔥
        </button>
      </div>

      {/* ===== CONTENT ===== */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        {/* MATCHES */}
        <div className="lg:col-span-8">
          <h2 className="text-2xl font-header text-gray-900 tracking-tight flex items-center uppercase mb-8">
            <span className="mr-3">🧧</span> Your Successful Matches
          </h2>

          {myMatches.length === 0 ? (
            <div className="bg-white rounded-[3.5rem] p-24 text-center border-2 border-dashed border-red-100 shadow-sm relative overflow-hidden group">
              <div className="text-7xl mb-6 opacity-40">🏮</div>
              <h3 className="text-xl font-header text-gray-900 mb-2 uppercase">
                Belum ada kecocokan...
              </h3>
              <p className="text-gray-400 font-medium italic">
                Ayo pilih seseorang yang kamu sukai malam ini!
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {myMatches.map(match => (
                <div
                  key={match.id}
                  className="group bg-white p-6 rounded-[3rem] flex items-center border border-gray-100 shadow-sm hover:shadow-2xl hover:border-red-200 transition-all"
                >
                  <img
                    src={match.photoUrl}
                    alt={match.name}
                    className="w-20 h-20 rounded-2xl object-cover mr-6 shadow-md"
                  />
                  <div className="flex-1">
                    <p className="font-header text-gray-900 text-lg uppercase">
                      {match.name}
                    </p>
                    <p className="text-xs font-bold text-[#8B0000] mb-4">
                      @{match.igHandle || '-'}
                    </p>
                    <button className="w-full py-2 bg-yellow-400 text-red-900 text-[10px] font-black uppercase tracking-widest rounded-xl hover:bg-[#8B0000] hover:text-white transition-all">
                      SAY HI! 💌
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* EVENT INFO */}
        <div className="lg:col-span-4">
          <h2 className="text-2xl font-header text-gray-900 mb-8 uppercase flex items-center">
            <span className="mr-3">🏮</span> Event Details
          </h2>

          <div className="bg-[#8B0000] text-white rounded-[3.5rem] p-8 shadow-2xl">
            <p className="text-yellow-400 text-[10px] font-black uppercase tracking-[0.4em] mb-4">
              CHINDO SWIPE
            </p>
            <p className="text-4xl font-header uppercase">14 FEB 2026</p>
            <p className="text-yellow-400 font-bold text-sm mb-6 uppercase tracking-widest">
              MIMI LIVEHOUSE PIK
            </p>
            <p className="text-sm text-white/70 italic">
              "Some connections are meant to happen."
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
