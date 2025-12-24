
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-xl animate-in fade-in duration-500">
      <div className="relative w-full max-w-4xl h-[85vh] bg-slate-900 rounded-[2.5rem] border border-white/10 shadow-2xl overflow-hidden flex flex-col">
        
        {/* Header */}
        <div className="p-8 border-b border-white/5 flex items-center justify-between bg-gradient-to-r from-red-900/20 to-transparent">
          <div>
            <h2 className="text-3xl font-black text-white tracking-tight flex items-center gap-3">
              <span className="text-yellow-500">🌟</span>
              Community Wish Wall
            </h2>
            <p className="text-white/40 text-sm mt-1 uppercase tracking-widest font-bold">Help the North Pole make dreams come true</p>
          </div>
          <button 
            onClick={onClose}
            className="p-3 bg-white/5 hover:bg-white/10 rounded-full transition-colors text-white"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-8 custom-scrollbar">
          {wishes.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center opacity-30 text-center">
              <span className="text-6xl mb-4">❄️</span>
              <p className="text-xl text-white font-medium italic">No wishes found in the snow yet...</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {wishes.map((wish) => (
                <div 
                  key={wish.id} 
                  className="group bg-white/5 rounded-3xl p-6 border border-white/10 hover:border-yellow-500/30 transition-all hover:bg-white/[0.08] relative overflow-hidden flex flex-col justify-between"
                >
                  <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-30 transition-opacity">
                    <span className="text-4xl">🎁</span>
                  </div>

                  <div>
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-red-500 to-red-700 flex items-center justify-center font-bold text-white text-lg">
                        {wish.name[0]}
                      </div>
                      <div>
                        <h3 className="text-white font-bold leading-none">{wish.name}</h3>
                        <p className="text-white/30 text-[10px] uppercase mt-1">Requested {new Date(wish.timestamp).toLocaleDateString()}</p>
                      </div>
                    </div>
                    
                    <p className="text-white/80 text-sm leading-relaxed mb-6 italic">
                      "{wish.text}"
                    </p>
                  </div>

                  <div className="flex items-center justify-between mt-auto pt-4 border-t border-white/5">
                    <div className="flex items-center gap-2">
                       <span className="text-xs font-bold text-yellow-500/80 uppercase">Supporters: {wish.sponsors}</span>
                    </div>
                    <button 
                      onClick={() => onHelp(wish.id)}
                      className="px-4 py-2 bg-yellow-500 text-slate-900 rounded-xl text-xs font-black uppercase tracking-wider hover:bg-yellow-400 transition-all active:scale-95 shadow-lg shadow-yellow-500/20"
                    >
                      I can help
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer Summary */}
        <div className="p-6 bg-slate-950/50 border-t border-white/5 flex items-center justify-center gap-8">
           <div className="text-center">
              <p className="text-[10px] text-white/30 uppercase font-black">Active Wishes</p>
              <p className="text-xl font-bold text-white">{wishes.length}</p>
           </div>
           <div className="w-px h-8 bg-white/10" />
           <div className="text-center">
              <p className="text-[10px] text-white/30 uppercase font-black">Fulfilled Joy</p>
              <p className="text-xl font-bold text-green-400">1,248</p>
           </div>
        </div>
      </div>
    </div>
  );
};
