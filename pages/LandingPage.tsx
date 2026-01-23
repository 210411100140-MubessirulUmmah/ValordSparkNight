import React from 'react';

interface LandingPageProps {
  onStart: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onStart }) => {
  return (
    <div className="relative bg-[#8B0000] overflow-hidden selection:bg-yellow-400">

      {/* BACKGROUND DECORATION (DI-CROP) */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-[10%] -left-[10%] w-[50%] h-[50%] bg-yellow-400 rounded-full blur-[150px] opacity-20" />
        {/* <div className="absolute -bottom-[10%] -right-[10%] w-[60%] h-[60%] bg-black rounded-full blur-[150px] opacity-40" /> */}
      </div>

      {/* HERO SECTION */}
      <section className="relative min-h-screen max-w-7xl mx-auto px-6 flex flex-col items-center justify-center text-center">
        
        <div className="mb-4 inline-flex px-6 py-2 rounded-full bg-yellow-400 text-red-900 font-black uppercase tracking-widest text-[10px] shadow-xl animate-bounce">
          VALORD Spark Night Presents
        </div>

        <h1 className="text-7xl md:text-[11rem] font-header text-white leading-none tracking-tighter mb-4">
          “CHINDO<br />
          <span className="text-yellow-400">SWIPE”</span>
        </h1>

        <p className="max-w-2xl text-lg md:text-2xl text-white/80 mb-12 font-bold uppercase tracking-widest">
          Powered by <span className="text-yellow-400">Mimi x Holy Friends</span>
        </p>

        <button
          onClick={onStart}
          className="px-12 py-6 bg-yellow-400 hover:bg-yellow-300 text-red-900 rounded-[1.5rem] font-header text-2xl shadow-[0_20px_50px_rgba(255,255,0,0.3)] transition-all hover:-translate-y-1 active:scale-95"
        >
          START VOTE 🧧
        </button>
      </section>

      {/* BOTTOM INFO (FULL WIDTH – LAST SECTION) */}
      <section className="w-full bg-yellow-400 py-12">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-wrap justify-center gap-12 text-center">
            <Stat label="Date" value="14 FEB 2026" />
            <Stat label="Location" value="MIMI PIK" />
            <Stat label="Curated" value="Chindo Today" />
          </div>
        </div>
      </section>

    </div>
  );
};

const Stat = ({ label, value }: { label: string; value: string }) => (
  <div className="flex flex-col items-center">
    <p className="text-2xl font-header tracking-tight text-[#8B0000]">
      {value}
    </p>
    <p className="text-[10px] uppercase font-black tracking-[0.3em] text-red-900 mt-1">
      {label}
    </p>
  </div>
);
