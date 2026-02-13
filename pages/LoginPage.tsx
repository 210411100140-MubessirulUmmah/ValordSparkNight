import { useState } from 'react';
import type { FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';

import { UserProfile } from '../types';
import { supabase } from '../supabaseClient';
import { mapUserFromDB } from '../services/userMapper';

interface LoginPageProps {
  onLogin: (user: UserProfile) => void;
}

export const LoginPage = ({ onLogin }: LoginPageProps) => {
  const navigate = useNavigate();

  const [method, setMethod] = useState<'password' | 'qr'>('qr');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [token, setToken] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // =============================
  // PASSWORD LOGIN
  // =============================
  const handlePasswordLogin = async (e: FormEvent) => {
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

    const user = mapUserFromDB(data);

    // ⛔ JANGAN navigate di sini
    onLogin(user);
  };

  // =============================
  // QR LOGIN
  // =============================
  const handleQRLogin = async (e: FormEvent) => {
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

    const user = mapUserFromDB(data);

    // ⛔ JANGAN navigate di sini
    onLogin(user);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#fcfcfc] p-4">
      <div className="bg-white rounded-[3.5rem] shadow-[0_30px_100px_rgba(139,0,0,0.15)] w-full max-w-md overflow-hidden border border-gray-100 relative">

        {/* HEADER */}
        <div className="bg-[#8B0000] p-12 text-center relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-yellow-400/10 rounded-full blur-2xl -mr-16 -mt-16"></div>

          <h1 className="text-3xl font-header text-white mb-1 tracking-tighter uppercase">
            VALORD <span className="text-yellow-400">SPARK NIGHT</span>
          </h1>

          <p className="text-white/60 font-bold text-[10px] uppercase tracking-[0.3em]">
            Access Invitation Dashboard
          </p>
        </div>

        {/* BODY */}
        <div className="p-10">

          {/* TOGGLE */}
          <div className="flex bg-gray-100 p-1.5 rounded-2xl mb-8">
            <button
              onClick={() => {
                setMethod('qr');
                setError('');
              }}
              className={`flex-1 py-3 text-[10px] font-black uppercase tracking-widest rounded-xl transition-all
                ${method === 'qr'
                  ? 'bg-[#8B0000] text-white shadow-lg'
                  : 'text-gray-400'
                }`}
            >
              Token
            </button>

            <button
              onClick={() => {
                setMethod('password');
                setError('');
              }}
              className={`flex-1 py-3 text-[10px] font-black uppercase tracking-widest rounded-xl transition-all
                ${method === 'password'
                  ? 'bg-[#8B0000] text-white shadow-lg'
                  : 'text-gray-400'
                }`}
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

          {/* ================= QR FORM ================= */}
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

              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => navigate('/')}
                  className="px-4 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest
                  text-[#8B0000] bg-red-100 hover:bg-yellow-400 transition-all"
                >
                  Back
                </button>

                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 bg-[#8B0000] hover:bg-black text-white font-header py-4 rounded-xl shadow-2xl transition-all uppercase tracking-widest"
                >
                  {loading ? 'Checking...' : 'Enter Event'}
                </button>
              </div>
            </form>
          ) : (
            /* ================= PASSWORD FORM ================= */
            <form onSubmit={handlePasswordLogin} className="space-y-5">
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value.toUpperCase())}
                placeholder="Username"
                required
                className="w-full px-6 py-4 bg-gray-50 border-2 border-transparent focus:border-red-900 rounded-2xl outline-none font-bold"
              />

              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value.toUpperCase())}
                placeholder="••••••••"
                required
                className="w-full px-6 py-4 bg-gray-50 border-2 border-transparent focus:border-red-900 rounded-2xl outline-none"
              />

              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => navigate('/')}
                  className="px-4 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest
                  text-[#8B0000] bg-red-100 hover:bg-yellow-400 transition-all"
                >
                  Back
                </button>

                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 bg-[#8B0000] hover:bg-black text-white
                  font-header py-4 rounded-2xl shadow-xl
                  transition-all uppercase tracking-widest text-sm"
                >
                  {loading ? 'Authenticating...' : 'Enter Event'}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
