import { Link, useNavigate, useLocation } from 'react-router-dom';
import { UserProfile } from '../types';

interface NavbarProps {
  user: UserProfile | null;
  onLogout: () => void;
}

export const Navbar = ({ user, onLogout }: NavbarProps) => {
  const navigate = useNavigate();
  const location = useLocation();

  if (!user) return null;

  const isActive = (path: string) =>
    location.pathname === path;

  return (
    <nav className="bg-white/80 backdrop-blur-md border-b border-gray-100 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex justify-between h-20">
          
          {/* LEFT */}
          <div className="flex items-center">
            <Link
              to={user.role === 'ADMIN' ? '/admin' : '/dashboard'}
              className="text-2xl font-header text-[#8B0000] tracking-tighter uppercase flex items-center"
            >
              VALORD <span className="text-yellow-500 ml-1.5">SPARK NIGHT</span>
            </Link>

            <div className="hidden md:flex md:ml-10 md:space-x-4">
              
              {user.role === 'ADMIN' ? (
                <Link
                  to="/admin"
                  className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all
                  ${isActive('/admin')
                    ? 'text-white bg-[#8B0000]'
                    : 'text-gray-400 hover:text-[#8B0000]'}`}
                >
                  ADMIN CENTER
                </Link>
              ) : (
                <>
                  <Link
                    to="/dashboard"
                    className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all
                    ${isActive('/dashboard')
                      ? 'text-[#8B0000] bg-red-50'
                      : 'text-black hover:text-[#8B0000]'}`}
                  >
                    HOME
                  </Link>

                  <Link
                    to="/voting"
                    className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all
                    ${isActive('/voting')
                      ? 'text-[#8B0000] bg-red-50'
                      : 'text-black hover:text-[#8B0000]'}`}
                  >
                    SWIPE SOULS
                  </Link>

                  <Link
                    to="/profile"
                    className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all
                    ${isActive('/profile')
                      ? 'text-[#8B0000] bg-red-50'
                      : 'text-black hover:text-[#8B0000]'}`}
                  >
                    EDIT PROFILE
                  </Link>
                </>
              )}

            </div>
          </div>

          {/* RIGHT */}
          <div className="flex items-center space-x-4">
            <div className="flex flex-col items-end mr-2">
              <span className="text-sm font-black text-gray-900 uppercase leading-none mb-1">
                {user.name.split(' ')[0]}
              </span>
              <span className="text-[9px] font-bold text-[#8B0000] uppercase tracking-widest">
                {user.role}
              </span>
            </div>

            <button
              onClick={() => {
                onLogout();
                navigate('/', { replace: true });
              }}
              className="bg-gray-100 hover:bg-[#8B0000] text-gray-500 hover:text-white p-2.5 rounded-xl transition-all"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
                <polyline points="16 17 21 12 16 7"></polyline>
                <line x1="21" y1="12" x2="9" y2="12"></line>
              </svg>
            </button>
          </div>

        </div>
      </div>
    </nav>
  );
};
