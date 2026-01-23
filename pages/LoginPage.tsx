import React, { useState } from 'react';
import { UserProfile } from '../types';
import { supabase } from '../supabaseClient';

interface LoginPageProps {
  onLogin: (user: UserProfile) => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({ onLogin }) => {
  const [method, setMethod] = useState<'password' | 'qr'>('qr');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [token, setToken] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // LOGIN VIA USERNAME + PASSWORD
  const handlePasswordLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('username', username)
      .eq('password', password)
      .single();

    setLoading(false);

    if (error || !data) {
      setError('Invalid credentials.');
      return;
    }

    onLogin(data);
  };

  // LOGIN VIA QR TOKEN
  const handleQRLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('qr_token', token)
      .single();

    setLoading(false);

    if (error || !data) {
      setError('Token not found. Please check your WhatsApp invitation.');
      return;
    }

    onLogin(data);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#fcfcfc] p-4">
      <div className="bg-white rounded-[3.5rem] shadow-[0_30px_100px_rgba(139,0,0,0.15)] w-full max-w-md overflow-hidden border border-gray-100 relative">
        
        {/* HEADER */}
        <div className="bg-[#8B0000] p-12 text-center relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-yellow-400/10 rounded-full blur-2xl -mr-16 -mt-16"></div>
          <h1 className="text-3xl font-header text-white mb-1 tracking-tighter uppercase">
            CHINDO <span className="text-yellow-400">SWIPE</span>
          </h1>
          <p className="text-white/60 font-bold text-[10px] uppercase tracking-[0.3em]">
            Access Invitation Dashboard
          </p>
        </div>

        {/* BODY */}
        <div className="p-10">
          {/* METHOD TOGGLE */}
          <div className="flex bg-gray-100 p-1.5 rounded-2xl mb-8">
            <button
              onClick={() => { setMethod('qr'); setError(''); }}
              className={`flex-1 py-3 text-[10px] font-black uppercase tracking-widest rounded-xl transition-all
                ${method === 'qr'
                  ? 'bg-[#8B0000] text-white shadow-lg'
                  : 'text-gray-400'}`}
            >
              Token
            </button>
            <button
              onClick={() => { setMethod('password'); setError(''); }}
              className={`flex-1 py-3 text-[10px] font-black uppercase tracking-widest rounded-xl transition-all
                ${method === 'password'
                  ? 'bg-[#8B0000] text-white shadow-lg'
                  : 'text-gray-400'}`}
            >
              Login
            </button>
          </div>

          {/* ERROR */}
          {error && (
            <div className="bg-red-50 text-red-700 px-4 py-3 rounded-2xl text-[10px] font-black mb-6 text-center border border-red-100 uppercase tracking-widest">
              {error}
            </div>
          )}

          {/* FORM */}
          {method === 'qr' ? (
            <form onSubmit={handleQRLogin} className="space-y-6">
              <input
                type="text"
                value={token}
                onChange={(e) => setToken(e.target.value.toUpperCase())}
                placeholder="INVITE TOKEN"
                required
                className="w-full px-6 py-5 bg-gray-50 border-2 border-transparent focus:border-yellow-400 rounded-2xl outline-none text-center font-header text-2xl tracking-[0.4em] text-[#8B0000]"
              />
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-[#8B0000] hover:bg-black text-white font-header py-5 rounded-[1.5rem] shadow-2xl transition-all uppercase tracking-widest"
              >
                {loading ? 'Checking...' : 'Enter Event 🏮'}
              </button>
            </form>
          ) : (
            <form onSubmit={handlePasswordLogin} className="space-y-5">
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Username"
                required
                className="w-full px-6 py-4 bg-gray-50 border-2 border-transparent focus:border-red-900 rounded-2xl outline-none font-bold"
              />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                className="w-full px-6 py-4 bg-gray-50 border-2 border-transparent focus:border-red-900 rounded-2xl outline-none"
              />
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-[#8B0000] hover:bg-black text-white font-header py-5 rounded-[1.5rem] shadow-2xl transition-all uppercase tracking-widest"
              >
                {loading ? 'Authenticating...' : 'Enter Event 🏮'}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
