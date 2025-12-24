
import React from 'react';
import { Wish } from '../types';

interface LiveWishFeedProps {
  wishes: Wish[];
  isOpen: boolean;
  onClose: () => void;
  onHelp: (wishId: string) => void;
}

export const LiveWishFeed: React.FC<LiveWishFeedProps> = ({ wishes, isOpen, onClose, onHelp }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-0 sm:p-4 bg-slate-950/80 backdrop-blur-xl animate-in fade-in duration-500">
      <div className="relative w-full max-w-5xl h-full sm:h-[85vh] bg-slate-900 sm:rounded-[2.5rem] border-x-0 sm:border border-white/10 shadow-2xl overflow-hidden flex flex-col animate-in slide-in-from-bottom sm:zoom-in duration-500">
        
        {/* Header */}
        <div className="p-6 sm:p-8 border-b border-white/5 flex items-center justify-between bg-gradient-to-r from-red-900/20 to-transparent pt-12 sm:pt-8">
          <div>
            <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight flex items-center gap-3">
              <span className="text-yellow-500">🌟</span>
              Community Feed
            </h2>
            <p className="text-white/40 text-[10px] sm:text-sm mt-1 uppercase tracking-widest font-bold">Making Dreams Happen Together</p>
          </div>
          <button 
            onClick={onClose}
            className="p-3 bg-white/5 hover:bg-white/10 rounded-full transition-colors text-white active:scale-75"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-8 space-y-4 custom-scrollbar">
          {wishes.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center opacity-30 text-center py-20">
              <span className="text-6xl mb-4 animate-pulse">❄️</span>
              <p className="text-lg sm:text-xl text-white font-bold italic">Awaiting first magical wish...</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {wishes.map((wish) => (
                <div 
                  key={wish.id} 
                  className="group bg-white/5 rounded-3xl p-5 sm:p-6 border border-white/10 hover:border-yellow-500/30 transition-all hover:bg-white/[0.08] relative overflow-hidden flex flex-col justify-between animate-in fade-in zoom-in"
                >
                  <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-20 transition-opacity pointer-events-none">
                    <span className="text-4xl">🎁</span>
                  </div>

                  <div>
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-red-500 to-red-700 flex items-center justify-center font-black text-white text-lg shadow-lg">
                        {wish.name[0]}
                      </div>
                      <div>
                        <h3 className="text-white font-bold leading-none">{wish.name}</h3>
                        <p className="text-white/30 text-[9px] uppercase mt-1">SENT {new Date(wish.timestamp).toLocaleDateString()}</p>
                      </div>
                    </div>
                    
                    <p className="text-white/80 text-sm leading-relaxed mb-6 italic line-clamp-4">
                      "{wish.text}"
                    </p>
                  </div>

                  <div className="flex items-center justify-between mt-auto pt-4 border-t border-white/5">
                    <div className="flex flex-col">
                       <span className="text-[10px] font-black text-white/40 uppercase tracking-tighter">Support</span>
                       <span className="text-xs font-bold text-yellow-500">{wish.sponsors} Friends</span>
                    </div>
                    <button 
                      onClick={() => onHelp(wish.id)}
                      className="px-4 py-2 bg-yellow-500 text-slate-900 rounded-xl text-[10px] font-black uppercase tracking-wider hover:bg-yellow-400 transition-all active:scale-95 shadow-lg shadow-yellow-500/10"
                    >
                      I can help
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Mobile Summary Footer */}
        <div className="p-4 sm:p-6 bg-slate-950 border-t border-white/5 flex items-center justify-around sm:justify-center sm:gap-12">
           <div className="text-center">
              <p className="text-[9px] sm:text-[10px] text-white/30 uppercase font-black tracking-widest">Active Wishes</p>
              <p className="text-lg sm:text-xl font-black text-white">{wishes.length}</p>
           </div>
           <div className="w-px h-8 bg-white/10 hidden sm:block" />
           <div className="text-center">
              <p className="text-[9px] sm:text-[10px] text-white/30 uppercase font-black tracking-widest">Fulfilled Joy</p>
              <p className="text-lg sm:text-xl font-black text-green-400">1,248</p>
           </div>
           <div className="w-px h-8 bg-white/10 hidden sm:block" />
           <div className="text-center">
              <p className="text-[9px] sm:text-[10px] text-white/30 uppercase font-black tracking-widest">Platform Status</p>
              <p className="text-lg sm:text-xl font-black text-blue-400 uppercase">Live</p>
           </div>
        </div>
      </div>
    </div>
  );
};
