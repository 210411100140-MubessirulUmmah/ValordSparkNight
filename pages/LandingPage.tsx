import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export const LandingPage = () => {
  const navigate = useNavigate();

  // 🔥 Auto redirect kalau user masih login
  useEffect(() => {
    const savedUser = localStorage.getItem('currentUser');

    if (savedUser) {
      const user = JSON.parse(savedUser);

      navigate(user.role === 'ADMIN' ? '/admin' : '/dashboard');
    }
  }, [navigate]);

  return (
    <div className="relative bg-[#8B0000] overflow-hidden selection:bg-yellow-400">

      {/* BACKGROUND */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-[10%] -left-[10%] w-[50%] h-[50%] bg-yellow-400 rounded-full blur-[150px] opacity-20" />
      </div>

      {/* HERO */}
      <section className="relative min-h-screen max-w-7xl mx-auto px-6 flex flex-col items-center justify-center text-center">

        <div className="mb-4 inline-flex px-6 py-2 rounded-full bg-yellow-400 text-red-900 font-black uppercase tracking-widest text-[10px] shadow-xl animate-bounce">
          💖 Presents 💖
        </div>

        <img
  src="/images/VALORD SparkNight x CHINDO SWIPE.png"
  alt="VALORD Spark Night"
  className="
    h-[8rem] 
    md:h-[14rem] 
    lg:h-[16rem]
    object-contain 
    mb-6
  "
/>


        <p className="max-w-2xl text-lg md:text-2xl text-white/80 mb-12 font-bold capitalize tracking-widest whitespace-nowrap">
          <span className="text-yellow-400"></span> Powered by{" "}
          <span className="text-yellow-400">Mimi x Holy Friends</span>
        </p>

        <button
          onClick={() => navigate('/login')}
          className="px-12 py-6 bg-yellow-400 hover:bg-yellow-300 text-red-900 rounded-[1.5rem] font-header text-2xl shadow-[0_20px_50px_rgba(255,255,0,0.3)] transition-all hover:-translate-y-1 active:scale-95"
        >
          START VOTE 🧧
        </button>
      </section>

      {/* FOOTER */}
      <section className="w-full bg-yellow-400 py-12">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-wrap justify-center items-center gap-12">

            <img
              src="/images/LOGO SPONSORED BY.png"
              alt="Chindo Today"
              className="h-12 md:h-14 object-contain"
            />

          </div>
        </div>
      </section>

    </div>
  );
};
