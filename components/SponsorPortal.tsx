
import React from 'react';

interface SponsorPortalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SponsorPortal: React.FC<SponsorPortalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md animate-in fade-in duration-300">
      <div className="relative w-full max-w-lg bg-slate-900 rounded-3xl p-8 border border-white/10 shadow-2xl overflow-hidden">
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-white/50 hover:text-white transition-colors"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-red-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg border-2 border-white/20">
            <span className="text-4xl">🎁</span>
          </div>
          <h2 className="text-2xl font-bold text-white mb-2">Sponsor Santa's Magic</h2>
          <p className="text-white/60 text-sm">Help us keep the North Pole servers running and spreading joy across the globe!</p>
        </div>

        <div className="grid grid-cols-1 gap-4 mb-8">
          <div className="bg-white/5 p-4 rounded-2xl border border-white/10 flex items-center justify-between hover:bg-white/10 transition-colors cursor-pointer group">
            <div>
              <p className="text-white font-semibold">Elf Supporter</p>
              <p className="text-white/40 text-xs">Help build one digital toy</p>
            </div>
            <span className="text-yellow-500 font-bold group-hover:scale-110 transition-transform">$5</span>
          </div>
          <div className="bg-white/5 p-4 rounded-2xl border border-yellow-500/30 flex items-center justify-between hover:bg-white/10 transition-colors cursor-pointer group">
            <div>
              <p className="text-white font-semibold">Reindeer Patron</p>
              <p className="text-white/40 text-xs">Feed the team for a day</p>
            </div>
            <span className="text-yellow-500 font-bold group-hover:scale-110 transition-transform">$25</span>
          </div>
          <div className="bg-white/5 p-4 rounded-2xl border border-white/10 flex items-center justify-between hover:bg-white/10 transition-colors cursor-pointer group">
            <div>
              <p className="text-white font-semibold">Santa Sponsor</p>
              <p className="text-white/40 text-xs">The ultimate Christmas Hero</p>
            </div>
            <span className="text-yellow-500 font-bold group-hover:scale-110 transition-transform">$100</span>
          </div>
        </div>

        <button 
          onClick={onClose}
          className="w-full py-3 bg-white text-slate-900 font-bold rounded-xl hover:bg-white/90 transition-all active:scale-95"
        >
          Become a Sponsor
        </button>
        
        <p className="text-center text-[10px] text-white/20 mt-4 uppercase tracking-widest font-bold">Powered by VAW TECH</p>
      </div>
    </div>
  );
};
