
import React, { useState, useMemo } from 'react';
import { UserProfile, Gender } from '../types';


interface AdminDashboardProps {
  users: UserProfile[];
  onDeleteUser: (id: string) => void;
  onResetVotes: () => void;
  onAddUser: (user: Partial<UserProfile>) => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ users, onDeleteUser, onResetVotes, onAddUser }) => {
  const [showAddModal, setShowAddModal] = useState(false);
  const [activeAdminTab, setActiveAdminTab] = useState<'overview' | 'votes' | 'ranking'>('overview');
  const [selectedMatch, setSelectedMatch] = useState<[UserProfile, UserProfile] | null>(null);
  
  const [newUser, setNewUser] = useState<Partial<UserProfile>>({
    name: '',
    username: '',
    password: '123',
    gender: 'Pria',
    job: '',
    age: 20,
    igHandle: '',
    bio: ''
  });

  const userCount = users.filter(u => u.role === 'USER').length;
  const safeVotes = (u?: UserProfile) => u?.votesGiven ?? [];

  
  const getRankings = (gender: Gender) => {
  return users
    .filter(u => u.role === 'USER' && u.gender === gender)
    .map(user => {
      const votesReceived = users.filter(
        other => safeVotes(other).includes(user.id)
      ).length;

      return { user, votesReceived };
    })
    .sort((a, b) => b.votesReceived - a.votesReceived);
};


  const maleRankings = useMemo(
  () => getRankings('Pria'),
  [users]
);

const femaleRankings = useMemo(
  () => getRankings('Wanita'),
  [users]
);


  const getMatches = () => {
  const matches: [UserProfile, UserProfile][] = [];
  const processed = new Set<string>();

  users.forEach(u1 => {
    if (u1.role !== 'USER') return;

    safeVotes(u1).forEach(u2Id => {
      const u2 = users.find(u => u.id === u2Id);
      if (!u2) return;

      if (safeVotes(u2).includes(u1.id)) {
        const pairKey = [u1.id, u2.id].sort().join('-');
        if (!processed.has(pairKey)) {
          matches.push([u1, u2]);
          processed.add(pairKey);
        }
      }
    });
  });

  return matches;
};


  const matches = useMemo(() => getMatches(), [users]);


  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAddUser(newUser);
    setShowAddModal(false);
    setNewUser({ name: '', username: '', password: '123', gender: 'Pria', job: '', age: 20, igHandle: '', bio: '' });
  };
  const overviewUsersByAge = useMemo(() => {
  return users
    .filter(u => u.role === 'USER')
    .sort((a, b) => (a.age ?? 0) - (b.age ?? 0));
}, [users]);


  return (
    <div className="max-w-7xl mx-auto py-10 px-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-10 gap-6">
        <div>
          <h1 className="text-4xl font-black text-gray-900 tracking-tighter">VALORD Spark <span className="text-rose-600">Admin</span></h1>
          <p className="text-gray-500 font-bold uppercase tracking-widest text-xs mt-1">Real-Time Event Control Center</p>
        </div>
        <div className="flex items-center space-x-3">
          <button 
            onClick={() => setShowAddModal(true)}
            className="bg-rose-600 text-white px-8 py-3 rounded-2xl font-black hover:bg-rose-700 transition-all shadow-xl shadow-rose-100"
          >
            + Register Participant
          </button>
        </div>
      </div>

      <div className="flex space-x-2 mb-8 bg-white p-1.5 rounded-2xl border border-rose-50 w-fit">
        {['overview', 'votes', 'ranking'].map((tab) => (
          <button 
            key={tab}
            onClick={() => setActiveAdminTab(tab as any)}
            className={`px-8 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${activeAdminTab === tab ? 'bg-rose-600 text-white shadow-lg shadow-rose-100' : 'text-gray-400 hover:text-rose-500'}`}
          >
            {tab}
          </button>
        ))}
      </div>

      {activeAdminTab === 'overview' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-8">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
              <StatCard label="Total Participants" value={userCount} color="gray" />
              <StatCard label="Successful Matches" value={matches.length} color="rose" highlight />
              <StatCard label="Sparks Fired" value={users.reduce((acc, u) => acc + safeVotes(u).length, 0)} color="indigo" />
            </div>

            <div className="bg-white rounded-[2.5rem] shadow-sm border border-rose-50 overflow-hidden mb-8">
              <div className="px-8 py-6 border-b border-rose-50 flex justify-between items-center bg-rose-50/20">
                <h2 className="text-lg font-black text-gray-900 uppercase tracking-widest">Active Souls</h2>
                <button onClick={onResetVotes} className="text-[10px] bg-white text-rose-600 px-4 py-2 rounded-full font-black border border-rose-100 hover:bg-rose-50">Master Reset</button>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead className="bg-white text-gray-400 uppercase tracking-widest text-[10px] font-black border-b border-rose-50">
                    <tr>
                      <th className="px-8 py-4">No</th>
                      <th className="px-8 py-4">Participant</th>
                      <th className="px-8 py-4">Secret Token</th>
                      <th className="px-8 py-4">Manage</th>
                    </tr>
                  </thead>
<tbody className="divide-y divide-rose-50">
  {overviewUsersByAge.map((user, index) => (
    <tr
      key={user.id}
      className="hover:bg-rose-50/30 transition-colors group"
    >
      {/* NO URUT (SUDAH SESUAI AGE) */}
      <td className="px-8 py-5">
        <div className="w-7 h-7 rounded-full bg-gray-100 flex items-center justify-center text-xs font-bold text-gray-600">
          {index + 1}
        </div>
      </td>

      {/* USER INFO */}
      <td className="px-8 py-5">
        <div className="flex items-center">
          <img
            src={user.photoUrl}
            className="w-12 h-12 rounded-2xl object-cover mr-4 shadow-sm"
          />
          <div>
            <p className="font-black text-gray-900 text-sm leading-tight">
              {user.name}
            </p>
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-tighter mt-0.5">
              {user.gender} • {user.job} • {user.age} yrs
            </p>
          </div>
        </div>
      </td>

      {/* TOKEN */}
      <td className="px-8 py-5">
        <code className="bg-rose-50/50 px-3 py-1.5 rounded-xl text-xs font-mono font-black text-rose-500 border border-rose-100">
          {user.qrToken}
        </code>
      </td>

      {/* ACTION */}
      <td className="px-8 py-5">
        <button
          onClick={() => onDeleteUser(user.id)}
          className="text-gray-300 hover:text-rose-500 transition-all p-2 bg-gray-50 rounded-lg"
        >
          🗑️
        </button>
      </td>
    </tr>
  ))}
</tbody>


                </table>
              </div>
            </div>
          </div>

          <div className="lg:col-span-4">
            <div className="bg-white rounded-[2.5rem] shadow-sm border border-rose-50 p-8 sticky top-24">
              <h2 className="text-xl font-black text-gray-900 mb-8 flex items-center">
                <span className="mr-3">💖</span> Match Results
              </h2>
              <p className="text-[10px] text-rose-400 font-black uppercase tracking-[0.2em] mb-6 animate-pulse">Tap a match to expand</p>
              
              <div className="space-y-4 max-h-[500px] overflow-y-auto pr-2 custom-scrollbar">
                {matches.length === 0 ? (
                  <div className="text-center py-24 bg-rose-50/30 rounded-[2.5rem] border-2 border-dashed border-rose-100">
                    <p className="text-5xl mb-4 opacity-40">✨</p>
                    <p className="text-[10px] font-black text-rose-300 uppercase tracking-widest px-4">The night is young. Waiting for sparks.</p>
                  </div>
                ) : (
                  matches.map((match, idx) => {
                    const [u1, u2] = match;
                    return (
                      <div 
                        key={idx} 
                        onClick={() => setSelectedMatch(match)}
                        className="group cursor-pointer bg-white p-4 rounded-[2rem] border border-rose-100 shadow-sm hover:shadow-xl hover:shadow-rose-100/50 transition-all flex items-center justify-between border-l-4 border-l-rose-500 transform hover:-translate-x-1"
                      >
                         <img src={u1.photoUrl} className="w-12 h-12 rounded-full object-cover border-2 border-white shadow-sm" />
                         <div className="flex flex-col items-center">
                            <span className="text-rose-500 group-hover:scale-125 transition-transform duration-500 text-2xl">❤️</span>
                            <span className="text-[8px] font-black text-rose-300 uppercase tracking-widest mt-1">Matched</span>
                         </div>
                         <img src={u2.photoUrl} className="w-12 h-12 rounded-full object-cover border-2 border-white shadow-sm" />
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {activeAdminTab === 'votes' && (
        <div className="bg-white rounded-[2.5rem] border border-rose-50 shadow-sm overflow-hidden">
          <div className="px-8 py-6 border-b border-rose-50 bg-rose-50/20">
            <h2 className="text-lg font-black text-gray-900 uppercase tracking-widest">Real-Time Spark History</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="text-[10px] font-black uppercase tracking-widest text-gray-400 border-b border-rose-50">
                <tr>
                  <th className="px-8 py-4">From (The Voter)</th>
                  <th className="px-8 py-4">Targeted Sparks (Their Choices)</th>
                  <th className="px-8 py-4">Energy Used</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-rose-50">
                {users.filter(u => u.role === 'USER').map(voter => (
                  <tr key={voter.id} className="hover:bg-rose-50/30 transition-colors">
                    <td className="px-8 py-5">
                      <div className="flex items-center">
                        <img src={voter.photoUrl} className="w-10 h-10 rounded-xl object-cover mr-4" />
                        <div>
                          <p className="font-black text-sm text-gray-900">{voter.name}</p>
                          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-tighter">{voter.gender}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-5">
                      <div className="flex flex-wrap gap-3">
                        {safeVotes(voter).length === 0 ? (
                          <span className="text-gray-300 italic text-xs font-medium">Silent heart...</span>
                        ) : (
                          safeVotes(voter).map(cid => {
                            const candidate = users.find(u => u.id === cid);
                            return (
                              <div key={cid} className="flex items-center bg-white pl-1 pr-3 py-1 rounded-2xl border border-rose-100 shadow-sm hover:border-rose-300 transition-all">
                                <img src={candidate?.photoUrl} className="w-7 h-7 rounded-full object-cover mr-2" />
                                <span className="text-[10px] font-black text-gray-700 uppercase tracking-tighter">{candidate?.name.split(' ')[0]}</span>
                              </div>
                            );
                          })
                        )}
                      </div>
                    </td>
                    <td className="px-8 py-5">
                      <div className="flex items-center space-x-1.5">
                        {[1, 2].map(i => (
                          <div key={i} className={`w-3 h-3 rounded-full border border-white shadow-sm ${i <= safeVotes(voter).length ? 'bg-rose-500' : 'bg-gray-100'}`}></div>
                        ))}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeAdminTab === 'ranking' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          <RankingTable title="Top Gentlemen 🎩" data={maleRankings} gender="Pria" />
          <RankingTable title="Top Ladies 👑" data={femaleRankings} gender="Wanita" />
        </div>
      )}

      {/* GRAND MATCH DETAIL POPUP */}
     {selectedMatch && (
  <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/25 backdrop-blur-sm p-6">
    
    <div
      className="
        bg-white
        rounded-[3.5rem]
        w-full
        max-w-3xl
        p-10
        shadow-[0_25px_80px_rgba(0,0,0,0.25)]
        relative
        animate-in fade-in zoom-in duration-300
        border-b-[10px] border-rose-600
        scale-[0.75] xl:scale-[0.85] 2xl:scale-[0.9]
        overflow-hidden
      "
    >

      {/* HEADER */}
      <div className="text-center mb-14 relative">
        <div className="absolute -top-10 left-1/2 -translate-x-1/2 w-40 h-40 bg-rose-500/10 rounded-full blur-3xl"></div>

        <span className="inline-block px-5 py-2 bg-rose-50 text-rose-600 rounded-full text-[10px] font-black uppercase tracking-[0.3em] mb-5 border border-rose-100">
          Official Match Proclamation
        </span>

        <h2 className="text-5xl font-black text-gray-900 tracking-tight mb-2">
          A Perfect <span className="text-rose-600">Spark!</span>
        </h2>

        <p className="text-gray-400 font-bold uppercase tracking-widest text-xs">
          Mutual Attraction Confirmed
        </p>
      </div>

      {/* CONTENT */}
      <div className="flex flex-col md:flex-row items-center justify-center gap-16 relative px-6">

        {/* Decorative Line */}
        <div className="hidden md:block absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[360px] h-[2px] bg-gradient-to-r from-transparent via-rose-300 to-transparent" />

        {/* PARTICIPANT 1 */}
        <div className="flex flex-col items-center w-64">
          <div className="relative mb-6 group">
            <div className="absolute -inset-3 bg-rose-500/10 rounded-[3rem] blur-xl opacity-0 group-hover:opacity-100 transition-all duration-500"></div>

            <img
              src={selectedMatch[0].photoUrl}
              className="w-48 h-48 rounded-[3rem] object-cover ring-[10px] ring-white shadow-xl relative z-10"
            />
          </div>

          <h3 className="text-2xl font-black text-gray-900 text-center mb-1">
            {selectedMatch[0].name}
          </h3>

          <div className="flex items-center space-x-2 text-rose-400 font-black uppercase tracking-widest text-[9px] mb-3">
            <span>@{selectedMatch[0].igHandle}</span>
            <span className="w-1 h-1 bg-rose-200 rounded-full"></span>
            <span>{selectedMatch[0].job}</span>
          </div>

          <div className="bg-rose-50/60 p-4 rounded-2xl border border-rose-100 w-full">
            <p className="text-[11px] font-bold text-rose-800 italic text-center opacity-80">
              "{selectedMatch[0].bio}"
            </p>
          </div>
        </div>

        {/* CENTER ICON */}
        <div className="relative z-10 flex flex-col items-center -mt-6">
          <div className="w-28 h-28 bg-rose-600 rounded-[2.5rem] flex items-center justify-center text-5xl shadow-[0_15px_50px_rgba(225,29,72,0.4)] animate-pulse ring-[10px] ring-rose-50">
            ❤️
          </div>

          <div className="mt-6 text-center">
            <p className="text-[9px] font-black uppercase tracking-[0.4em] text-rose-600">
              Energy Match
            </p>
            <p className="text-2xl font-black text-gray-900">100%</p>
          </div>
        </div>

        {/* PARTICIPANT 2 */}
        <div className="flex flex-col items-center w-64">
          <div className="relative mb-6 group">
            <div className="absolute -inset-3 bg-rose-500/10 rounded-[3rem] blur-xl opacity-0 group-hover:opacity-100 transition-all duration-500"></div>

            <img
              src={selectedMatch[1].photoUrl}
              className="w-48 h-48 rounded-[3rem] object-cover ring-[10px] ring-white shadow-xl relative z-10"
            />
          </div>

          <h3 className="text-2xl font-black text-gray-900 text-center mb-1">
            {selectedMatch[1].name}
          </h3>

          <div className="flex items-center space-x-2 text-rose-400 font-black uppercase tracking-widest text-[9px] mb-3">
            <span>@{selectedMatch[1].igHandle}</span>
            <span className="w-1 h-1 bg-rose-200 rounded-full"></span>
            <span>{selectedMatch[1].job}</span>
          </div>

          <div className="bg-rose-50/60 p-4 rounded-2xl border border-rose-100 w-full">
            <p className="text-[11px] font-bold text-rose-800 italic text-center opacity-80">
              "{selectedMatch[1].bio}"
            </p>
          </div>
        </div>
      </div>

      {/* ACTIONS */}
      <div className="mt-16 flex flex-col sm:flex-row justify-center gap-5">
        <button
          onClick={() => {
            alert("Spark Notification sent to both participants!");
            setSelectedMatch(null);
          }}
          className="bg-rose-600 text-white px-10 py-4 rounded-[2rem] font-black shadow-xl shadow-rose-200 hover:bg-rose-700 transition-all text-xs uppercase tracking-widest"
        >
          Notify Participants 📢
        </button>

        <button
          onClick={() => setSelectedMatch(null)}
          className="bg-white border-2 border-rose-100 text-gray-500 px-10 py-4 rounded-[2rem] font-black hover:bg-rose-50 transition-all text-xs uppercase tracking-widest"
        >
          Close View
        </button>
      </div>

      

    </div>
  </div>
)}



      {/* Add User Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div className="bg-white rounded-[3rem] w-full max-w-lg p-10 shadow-2xl animate-in fade-in zoom-in duration-300 border-t-[8px] border-rose-600">
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-2xl font-black text-gray-900 tracking-tight">New Event Soul</h2>
              <button onClick={() => setShowAddModal(false)} className="p-2 hover:bg-gray-100 rounded-full transition-colors text-2xl">×</button>
            </div>
            <form onSubmit={handleAddSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <label className="text-[10px] font-black text-gray-400 uppercase ml-2 mb-1 block">Full Legal Name</label>
                  <input required value={newUser.name} onChange={e => setNewUser({...newUser, name: e.target.value})} className="w-full px-6 py-4 bg-gray-50 rounded-2xl border-none focus:ring-2 focus:ring-rose-200 font-bold" placeholder="E.g. Andi Wijaya" />
                </div>
                <div>
                  <label className="text-[10px] font-black text-gray-400 uppercase ml-2 mb-1 block">Username</label>
                  <input required value={newUser.username} onChange={e => setNewUser({...newUser, username: e.target.value})} className="w-full px-6 py-4 bg-gray-50 rounded-2xl border-none focus:ring-2 focus:ring-rose-200" placeholder="andi_w" />
                </div>
                <div>
                  <label className="text-[10px] font-black text-gray-400 uppercase ml-2 mb-1 block">Gender Identity</label>
                  <select value={newUser.gender} onChange={e => setNewUser({...newUser, gender: e.target.value as Gender})} className="w-full px-6 py-4 bg-gray-50 rounded-2xl border-none focus:ring-2 focus:ring-rose-200 font-bold">
                    <option value="Pria">Pria</option>
                    <option value="Wanita">Wanita</option>
                  </select>
                </div>
              </div>
              <button type="submit" className="w-full bg-rose-600 text-white font-black py-5 rounded-[2rem] shadow-xl shadow-rose-200 mt-4 transition-all hover:bg-rose-700 uppercase tracking-[0.2em] text-sm">
                Register to Spark Night 🕯️
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

const StatCard = ({ label, value, color, highlight }: any) => (
  <div className={`p-8 rounded-[2.5rem] shadow-sm border transition-all hover:scale-[1.02] ${highlight ? 'bg-rose-600 border-rose-600 text-white shadow-2xl shadow-rose-100' : 'bg-white border-rose-50 text-gray-900'}`}>
    <p className={`text-[10px] font-black uppercase tracking-[0.2em] mb-1 ${highlight ? 'text-rose-100 opacity-80' : 'text-gray-400'}`}>{label}</p>
    <p className="text-4xl font-black tracking-tight">{value}</p>
  </div>
);

const RankingTable = ({ title, data, gender }: any) => (
  <div className="bg-white rounded-[2.5rem] border border-rose-50 shadow-sm overflow-hidden flex flex-col">
    <div className={`px-10 py-8 border-b border-rose-50 ${gender === 'Pria' ? 'bg-blue-50/20' : 'bg-rose-50/20'}`}>
      <h2 className="text-xl font-black text-gray-900 uppercase tracking-[0.2em]">{title}</h2>
      <p className="text-[10px] font-bold text-gray-400 mt-1 uppercase">Most Sparked Ranking</p>
    </div>
    <div className="overflow-x-auto">
      <table className="w-full text-left">
        <thead className="text-[10px] font-black uppercase tracking-widest text-gray-400 border-b border-rose-50">
          <tr>
            <th className="px-10 py-5">Position</th>
            <th className="px-10 py-5">Participant</th>
            <th className="px-10 py-5 text-right">Sparks Recv.</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-rose-50">
          {data.length === 0 ? (
            <tr>
              <td colSpan={3} className="px-10 py-10 text-center text-gray-300 italic text-sm">No data available for {gender}</td>
            </tr>
          ) : (
            data.map(({ user, votesReceived }: any, index: number) => (
              <tr key={user.id} className="hover:bg-gray-50/50 transition-colors">
                <td className="px-10 py-6">
                  <span className={`w-10 h-10 flex items-center justify-center rounded-2xl font-black text-sm shadow-sm ${index === 0 ? 'bg-yellow-400 text-white scale-110 shadow-yellow-200' : index === 1 ? 'bg-slate-300 text-white' : index === 2 ? 'bg-orange-400 text-white' : 'bg-gray-100 text-gray-400'}`}>
                    {index + 1}
                  </span>
                </td>
                <td className="px-10 py-6">
                  <div className="flex items-center">
                    <img src={user.photoUrl} className="w-12 h-12 rounded-2xl object-cover mr-4 shadow-sm" />
                    <span className="font-black text-sm text-gray-900 tracking-tight">{user.name}</span>
                  </div>
                </td>
                <td className="px-10 py-6 text-right">
                  <span className={`px-5 py-2 rounded-2xl font-black text-xs border ${votesReceived > 0 ? 'bg-rose-50 text-rose-600 border-rose-100' : 'bg-gray-50 text-gray-300 border-transparent'}`}>
                    {votesReceived} ❤️
                  </span>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  </div>
);