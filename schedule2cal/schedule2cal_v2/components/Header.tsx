
import React from 'react';

const Header: React.FC = () => {
  return (
    <header className="bg-white/80 backdrop-blur-md border-b border-slate-100 py-6 px-8 sticky top-0 z-50">
      <div className="max-w-6xl mx-auto flex justify-between items-center">
        <div className="flex items-center gap-3">
          <div className="bg-blue-600 w-10 h-10 rounded-xl flex items-center justify-center shadow-lg shadow-blue-200">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
          <span className="text-2xl font-black tracking-tight text-slate-900">
            Schedule<span className="text-blue-600">2</span>Cal
          </span>
        </div>
        <nav className="hidden md:flex gap-10">
          <a href="#" className="text-slate-500 hover:text-blue-600 transition font-black text-xs uppercase tracking-widest">Features</a>
          <a href="#" className="text-slate-500 hover:text-blue-600 transition font-black text-xs uppercase tracking-widest">Privacy</a>
          <a href="#" className="text-slate-500 hover:text-blue-600 transition font-black text-xs uppercase tracking-widest">Pricing</a>
        </nav>
        <button className="bg-slate-900 text-white px-6 py-3 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-slate-800 transition shadow-lg shadow-slate-100">
          Sign In
        </button>
      </div>
    </header>
  );
};

export default Header;
