
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
    <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 flex flex-col items-center gap-6 w-full max-w-2xl px-4 pointer-events-none">
      
      {error && (
        <div className="bg-red-600/90 text-white px-4 py-2 rounded-lg text-sm shadow-lg pointer-events-auto backdrop-blur-sm border border-red-400">
          {error}
        </div>
      )}

      {/* Main Connection Bar */}
      <div className="flex flex-col sm:flex-row items-center gap-4 pointer-events-auto w-full justify-center">
        
        <div className="bg-slate-900/40 backdrop-blur-md p-3 rounded-2xl shadow-2xl border border-white/10 flex items-center gap-4">
          <div className={`w-3 h-3 rounded-full ${
            connectionState === ConnectionState.CONNECTED ? 'bg-green-400 animate-pulse' : 
            connectionState === ConnectionState.CONNECTING ? 'bg-yellow-400 animate-bounce' : 
            'bg-red-500'
          }`} />
          
          <span className="text-white font-medium text-sm w-24">
            {connectionState === ConnectionState.CONNECTED ? 'Live Status' : 
             connectionState === ConnectionState.CONNECTING ? 'Connecting...' : 
             'Offline'}
          </span>

          {connectionState === ConnectionState.CONNECTED || connectionState === ConnectionState.CONNECTING ? (
            <button 
              onClick={onDisconnect}
              className="px-6 py-2 bg-red-600 hover:bg-red-700 text-white rounded-xl font-bold transition-all shadow-lg active:scale-95 border border-red-400/30"
            >
              Goodbye
            </button>
          ) : (
            <button 
              onClick={onConnect}
              className="px-6 py-2 bg-green-600 hover:bg-green-500 text-white rounded-xl font-bold transition-all shadow-lg active:scale-95 flex items-center gap-2 border border-green-400/30"
            >
              <span>Talk to Santa</span>
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 18.75a6 6 0 006-6v-1.5m-6 7.5a6 6 0 01-6-6v-1.5m6 7.5v3.75m-3.75 0h7.5M12 15.75a3 3 0 01-3-3V4.5a3 3 0 116 0v8.25a3 3 0 01-3 3z" />
              </svg>
            </button>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2 bg-slate-900/40 backdrop-blur-md p-2 rounded-2xl border border-white/10">
          <button 
            onClick={onOpenWish}
            className="p-3 bg-yellow-500 text-slate-900 rounded-xl font-bold hover:bg-yellow-400 transition-all shadow-lg active:scale-95 flex items-center gap-2"
            title="Wish Portal"
          >
            <span>✨ Wish</span>
          </button>
          <button 
            onClick={onOpenWall}
            className="p-3 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-500 transition-all shadow-lg active:scale-95 flex items-center gap-2"
            title="Community Wall"
          >
            <span>🌎 Feed</span>
          </button>
          <button 
            onClick={handleShare}
            className="p-3 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-500 transition-all shadow-lg active:scale-95"
            title="Share with Friends"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
            </svg>
          </button>
          <button 
            onClick={onOpenSponsor}
            className="p-3 bg-red-800 text-white rounded-xl font-bold hover:bg-red-700 transition-all shadow-lg active:scale-95"
            title="Sponsor Program"
          >
            <span>🎁 Support</span>
          </button>
        </div>
      </div>
      
      <p className="text-white/40 text-[10px] tracking-widest font-bold uppercase drop-shadow-md">
        NORTH POLE PLATFORM • VAW TECH 
      </p>
    </div>
  );
};
