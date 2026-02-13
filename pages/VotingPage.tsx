import React from 'react';
import { UserProfile, Gender } from '../types';

interface VotingPageProps {
  currentUser: UserProfile;
  candidates: UserProfile[];
  onVote: (candidateId: string) => void;
}

export const VotingPage: React.FC<VotingPageProps> = ({
  currentUser,
  candidates,
  onVote,
}) => {
  // ======================
  // GENDER FILTER
  // ======================
  const oppositeGender: Gender =
    currentUser.gender === 'Pria' ? 'Wanita' : 'Pria';

  // ======================
  // FILTER CANDIDATES
  // ======================
  const filteredCandidates = candidates.filter(
    c =>
      c.role === 'USER' &&
      c.gender === oppositeGender &&
      c.id !== currentUser.id
  );

  // ======================
  // VOTES LEFT (SAFE)
  // ======================
  const votesUsed = currentUser.votesGiven?.length || 0;
  const votesLeft = Math.max(0, 2 - votesUsed);

  return (
    <div className="max-w-7xl mx-auto py-16 px-6">
      {/* ===== HEADER ===== */}
      <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-10">
        <div className="max-w-2xl text-center md:text-left">
          <div className="inline-block px-4 py-1.5 rounded-full bg-red-50 text-[#8B0000] text-[10px] font-black uppercase tracking-[0.3em] mb-4 border border-red-100">
            Chindo Swipe • February 2026
          </div>

          <h1 className="text-5xl md:text-7xl font-header text-gray-900 tracking-tighter leading-none mb-4 uppercase">
            PILIH <span className="text-[#8B0000]">CALON</span>{' '}
            <span className="text-yellow-500">SPARK-MU</span>
          </h1>

          <p className="text-gray-500 font-medium text-lg leading-relaxed">
            Anda memiliki 2 kesempatan vote malam ini.
            Jika kalian saling memilih, match akan terjadi otomatis.
          </p>
        </div>

        {/* ===== ENERGY CARD ===== */}
        <div className="bg-white p-8 rounded-[3.5rem] shadow-2xl shadow-red-100/50 border border-gray-100 flex items-center space-x-8">
          <div className="w-20 h-20 bg-[#8B0000] rounded-[2.5rem] flex items-center justify-center text-4xl shadow-2xl shadow-red-200 animate-pulse">
            🏮
          </div>

          <div>
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.3em] mb-2">
              Energy Love Sisa
            </p>
            <div className="flex items-center">
              {[1, 2].map(i => (
                <div
                  key={i}
                  className={`w-8 h-8 rounded-full mr-2 flex items-center justify-center transition-all ${
                    i <= votesLeft
                      ? 'bg-yellow-400 shadow-xl shadow-yellow-100 scale-110'
                      : 'bg-gray-100'
                  }`}
                >
                  <div
                    className={`w-2.5 h-2.5 rounded-full ${
                      i <= votesLeft ? 'bg-red-900' : 'bg-gray-300'
                    }`}
                  />
                </div>
              ))}
              <span className="text-3xl font-header text-gray-900 ml-4">
                {votesLeft}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* ===== VOTE FINISHED BANNER (TIDAK MENGHILANGKAN GRID) ===== */}
      {votesLeft <= 0 && (
        <div className="bg-white rounded-[4rem] p-16 text-center shadow-xl border border-gray-50 max-w-4xl mx-auto mb-16">
          <div className="text-6xl mb-6">🧧</div>
          <h2 className="text-3xl font-header text-gray-900 mb-3 uppercase">
            Semua Swipe Terkirim!
          </h2>
          <p className="text-gray-400 font-bold text-sm uppercase tracking-widest">
            Pilihan kamu tetap tersimpan
          </p>
        </div>
      )}

      {/* ===== CANDIDATE GRID (SELALU TAMPIL) ===== */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-12">
        {filteredCandidates.map(candidate => {
          const hasVoted = currentUser.votesGiven?.includes(candidate.id);

          return (
            <div
              key={candidate.id}
              className="group relative bg-white rounded-[4rem] overflow-hidden shadow-sm border border-gray-100 transition-all duration-700 hover:shadow-2xl hover:shadow-red-100/50 hover:-translate-y-4"
            >
              {/* PHOTO */}
              <div className="aspect-[3/4] overflow-hidden relative">
                <img
                  src={candidate.photoUrl}
                  alt={candidate.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-all duration-1000"
                />

                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-80" />

                <div className="absolute bottom-8 left-8 right-8 text-white z-10">
                  <p className="font-header text-2xl uppercase">
                    {candidate.name}, {candidate.age}
                  </p>
                  <p className="text-[10px] font-black uppercase tracking-[0.2em] text-yellow-400">
                    {candidate.job}
                  </p>
                </div>

                {hasVoted && (
                  <div className="absolute inset-0 bg-[#8B0000]/60 backdrop-blur-[4px] flex items-center justify-center z-20">
                    <div className="bg-yellow-400 text-red-900 px-8 py-4 rounded-2xl font-header text-xs shadow-2xl transform -rotate-6 border-4 border-white uppercase tracking-widest">
                      CHOSEN 🏮
                    </div>
                  </div>
                )}
              </div>

              {/* INFO */}
              <div className="p-10">
                <div className="flex items-center justify-between mb-6">
                  <span className="text-[10px] font-black text-[#8B0000] uppercase tracking-widest">
                    @{candidate.igHandle || '-'}
                  </span>
                  <div className="flex items-center text-[10px] font-bold text-gray-300 uppercase tracking-widest">
                    <span className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse" />
                    Active
                  </div>
                </div>

                <p className="text-gray-500 text-sm italic mb-10 min-h-[3rem] font-medium">
                  "{candidate.bio}"
                </p>

                {!hasVoted ? (
                  <button
                    onClick={() => onVote(candidate.id)}
                    disabled={votesLeft <= 0}
                    className={`w-full py-6 rounded-[2rem] font-header text-xs uppercase tracking-widest transition-all
                      ${
                        votesLeft <= 0
                          ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                          : 'bg-yellow-300 hover:bg-[#8B0000] hover:text-white active:scale-95'
                      }
                    `}
                  >
                    {votesLeft <= 0 ? 'VOTE HABIS' : 'LIKE ❤️'}
                  </button>
                ) : (
                  <div className="w-full bg-red-50 text-[#8B0000] py-6 rounded-[2rem] text-center font-header text-xs border border-red-100 uppercase tracking-widest">
                    ✓ Selected
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
      
    </div>
    
  );
};
