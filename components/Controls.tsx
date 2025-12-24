
import React from 'react';
import { ConnectionState } from '../types';

interface ControlsProps {
  connectionState: ConnectionState;
  onConnect: () => void;
  onDisconnect: () => void;
  onOpenWish: () => void;
  onOpenSponsor: () => void;
  onOpenWall: () => void;
  error: string | null;
}

export const Controls: React.FC<ControlsProps> = ({ 
  connectionState, 
  onConnect, 
  onDisconnect,
  onOpenWish,
  onOpenSponsor,
  onOpenWall,
  error
}) => {
  
  const handleShare = async () => {
    const shareData = {
      title: 'Talk to Santa Live!',
      text: 'I just talked to Santa at the North Pole! Send him your wish too.',
      url: window.location.href,
    };

    try {
      if (navigator.share) {
        await navigator.share(shareData);
      } else {
        await navigator.clipboard.writeText(window.location.href);
        alert('Link copied to clipboard! Share it with your friends.');
      }
    } catch (err) {
      console.log('Error sharing:', err);
    }
  };

  return (
    <div className="absolute bottom-6 sm:bottom-10 left-0 right-0 flex flex-col items-center gap-4 sm:gap-6 w-full px-4 pointer-events-none z-10">
      
      {error && (
        <div className="bg-red-600/90 text-white px-4 py-2 rounded-lg text-xs sm:text-sm shadow-lg pointer-events-auto backdrop-blur-sm border border-red-400 animate-in fade-in slide-in-from-bottom-2">
          {error}
        </div>
      )}

      {/* Main Connection Bar */}
      <div className="flex flex-col items-center gap-3 sm:gap-4 pointer-events-auto w-full max-w-2xl">
        
        {/* Status & Mic Toggle */}
        <div className="bg-slate-900/60 backdrop-blur-xl p-2 sm:p-3 rounded-3xl shadow-2xl border border-white/10 flex items-center gap-3 sm:gap-4 w-full sm:w-auto">
          <div className="flex items-center gap-3 px-3">
            <div className={`w-2.5 h-2.5 rounded-full ${
              connectionState === ConnectionState.CONNECTED ? 'bg-green-400 animate-pulse' : 
              connectionState === ConnectionState.CONNECTING ? 'bg-yellow-400 animate-bounce' : 
              'bg-red-500'
            }`} />
            
            <span className="text-white font-bold text-[10px] sm:text-xs uppercase tracking-widest whitespace-nowrap">
              {connectionState === ConnectionState.CONNECTED ? 'Live' : 
               connectionState === ConnectionState.CONNECTING ? 'Connecting' : 
               'Offline'}
            </span>
          </div>

          <div className="flex-1 sm:flex-none">
            {connectionState === ConnectionState.CONNECTED || connectionState === ConnectionState.CONNECTING ? (
              <button 
                onClick={onDisconnect}
                className="w-full sm:w-auto px-6 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-2xl font-black text-xs uppercase transition-all shadow-lg active:scale-95 border border-red-400/30"
              >
                End Call
              </button>
            ) : (
              <button 
                onClick={onConnect}
                className="w-full sm:w-auto px-6 py-2.5 bg-green-600 hover:bg-green-500 text-white rounded-2xl font-black text-xs uppercase transition-all shadow-lg active:scale-95 flex items-center justify-center gap-2 border border-green-400/30"
              >
                <span>Talk to Santa</span>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-4 h-4">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 18.75a6 6 0 006-6v-1.5m-6 7.5a6 6 0 01-6-6v-1.5m6 7.5v3.75m-3.75 0h7.5M12 15.75a3 3 0 01-3-3V4.5a3 3 0 116 0v8.25a3 3 0 01-3 3z" />
                </svg>
              </button>
            )}
          </div>
        </div>

        {/* Quick Action Buttons - Grid layout for mobile */}
        <div className="grid grid-cols-4 gap-2 bg-slate-900/60 backdrop-blur-xl p-2 rounded-3xl border border-white/10 w-full sm:w-auto">
          <button 
            onClick={onOpenWish}
            className="flex flex-col items-center justify-center p-2 sm:p-3 bg-yellow-500 text-slate-900 rounded-2xl hover:bg-yellow-400 transition-all shadow-lg active:scale-90"
            title="Wish Portal"
          >
            <span className="text-lg">✨</span>
            <span className="text-[8px] font-black uppercase mt-0.5">Wish</span>
          </button>
          
          <button 
            onClick={onOpenWall}
            className="flex flex-col items-center justify-center p-2 sm:p-3 bg-indigo-600 text-white rounded-2xl hover:bg-indigo-500 transition-all shadow-lg active:scale-90"
            title="Community Wall"
          >
            <span className="text-lg">🌎</span>
            <span className="text-[8px] font-black uppercase mt-0.5">Feed</span>
          </button>

          <button 
            onClick={handleShare}
            className="flex flex-col items-center justify-center p-2 sm:p-3 bg-blue-600 text-white rounded-2xl hover:bg-blue-500 transition-all shadow-lg active:scale-90"
            title="Share"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
            </svg>
            <span className="text-[8px] font-black uppercase mt-0.5">Share</span>
          </button>

          <button 
            onClick={onOpenSponsor}
            className="flex flex-col items-center justify-center p-2 sm:p-3 bg-red-800 text-white rounded-2xl hover:bg-red-700 transition-all shadow-lg active:scale-90"
            title="Support"
          >
            <span className="text-lg">🎁</span>
            <span className="text-[8px] font-black uppercase mt-0.5">Help</span>
          </button>
        </div>
      </div>
      
      <p className="text-white/30 text-[8px] tracking-[0.2em] font-black uppercase drop-shadow-md pb-4 sm:pb-0">
        POWERED BY VAW TECH • NORTH POLE CONNECT 
      </p>
    </div>
  );
};
