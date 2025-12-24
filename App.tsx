
import React, { Suspense, useState, useRef, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { Avatar } from './components/Avatar';
import { Environment } from './components/Environment';
import { Controls } from './components/Controls';
import { WishPortal } from './components/WishPortal';
import { SponsorPortal } from './components/SponsorPortal';
import { LiveWishFeed } from './components/LiveWishFeed';
import { useGeminiLive } from './hooks/useGeminiLive';
import { Wish } from './types';

const App: React.FC = () => {
  const { 
    connectionState, 
    connect, 
    disconnect, 
    sendTextMessage,
    mouthCue,
    error,
    history
  } = useGeminiLive();

  const [showChat, setShowChat] = useState(false);
  const [showWish, setShowWish] = useState(false);
  const [showSponsor, setShowSponsor] = useState(false);
  const [showWall, setShowWall] = useState(false);
  const [wishes, setWishes] = useState<Wish[]>([]);
  
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [history, showChat]);

  const handleWishSubmit = (wishData: Omit<Wish, 'id' | 'timestamp' | 'status' | 'sponsors'>) => {
    const newWish: Wish = {
      ...wishData,
      id: Math.random().toString(36).substr(2, 9),
      timestamp: new Date(),
      status: 'pending',
      sponsors: 0
    };

    setWishes(prev => [newWish, ...prev]);

    const fullMessage = `I have a Christmas wish from ${wishData.name}! Their wish is: ${wishData.text}. Please acknowledge this wish!`;
    if (connectionState === 'CONNECTED') {
        sendTextMessage(fullMessage);
    }
  };

  const handleHelpWish = (wishId: string) => {
    setWishes(prev => prev.map(w => 
      w.id === wishId ? { ...w, sponsors: w.sponsors + 1 } : w
    ));
  };

  return (
    <div className="relative w-full h-full bg-[#050b1a] overflow-hidden fixed inset-0">
      
      {/* Platform Branding */}
      <div className="absolute top-4 left-4 sm:top-6 sm:left-6 z-10 pointer-events-none">
        <h1 className="text-white font-black text-xl sm:text-3xl tracking-tighter flex items-center gap-2 drop-shadow-2xl">
          <span className="text-red-500">SANTA</span>
          <span className="bg-white/10 px-2 py-0.5 rounded-lg border border-white/10 text-sm sm:text-lg uppercase tracking-widest">Live</span>
        </h1>
        <p className="text-white/40 text-[8px] sm:text-[10px] font-bold uppercase tracking-[0.2em] mt-0.5 sm:mt-1 ml-1">North Pole Interactive</p>
      </div>

      <Canvas 
        shadows 
        dpr={[1, 2]} // Performance: limit pixel ratio on high-res mobiles
        camera={{ position: [0, 0.5, 7.5], fov: 28, near: 0.1, far: 20 }}
      >
        <Suspense fallback={null}>
          <Environment />
          <Avatar mouthCue={mouthCue} />
        </Suspense>
        
        <OrbitControls 
          target={[0, 0.5, 0]}
          enablePan={false}
          minDistance={3}
          maxDistance={10}
          minAzimuthAngle={-Math.PI / 8}
          maxAzimuthAngle={Math.PI / 8}
          minPolarAngle={Math.PI / 2 - 0.1}
          maxPolarAngle={Math.PI / 2 + 0.1}
        />
      </Canvas>

      <Controls 
        connectionState={connectionState}
        onConnect={connect}
        onDisconnect={disconnect}
        onOpenWish={() => setShowWish(true)}
        onOpenSponsor={() => setShowSponsor(true)}
        onOpenWall={() => setShowWall(true)}
        error={error}
      />

      {/* Portals */}
      <WishPortal 
        isOpen={showWish} 
        onClose={() => setShowWish(false)} 
        onSubmit={handleWishSubmit} 
      />
      
      <LiveWishFeed 
        isOpen={showWall}
        onClose={() => setShowWall(false)}
        wishes={wishes}
        onHelp={handleHelpWish}
      />

      <SponsorPortal 
        isOpen={showSponsor} 
        onClose={() => setShowSponsor(false)} 
      />

      {/* Chat Log Toggle - Floating Action Button for Mobile */}
      <div className="absolute top-4 right-4 z-20">
        <button 
          onClick={() => setShowChat(!showChat)}
          className="bg-slate-900/60 backdrop-blur-xl border border-white/10 p-3 sm:p-4 rounded-2xl text-white hover:bg-slate-800/80 transition-all shadow-xl flex items-center gap-2 active:scale-90"
        >
          <span className="hidden sm:inline font-bold text-sm">{showChat ? 'Close Log' : 'Chat Log'}</span>
          {showChat ? (
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-5 h-5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 20.25c4.97 0 9-3.694 9-8.25s-4.03-8.25-9-8.25S3 7.444 3 12c0 2.104.859 4.023 2.273 5.48.432.447.74 1.04.586 1.641a4.483 4.483 0 01-.923 1.785 0.475 0.475 0 00.334.797c.803 0 1.565-.24 2.207-.652a2.216 2.216 0 011.638-.308c.773.11 1.562.167 2.365.167h.02z" />
            </svg>
          )}
        </button>
      </div>

      {/* Chat History Panel - Mobile Responsive Overlay */}
      <div 
        className={`absolute z-30 sm:z-10 bottom-0 sm:bottom-auto sm:top-20 right-0 sm:right-4 w-full sm:w-96 bg-slate-950/95 sm:bg-slate-950/90 backdrop-blur-2xl border-t sm:border border-white/10 rounded-t-3xl sm:rounded-3xl shadow-2xl overflow-hidden transition-all duration-500 flex flex-col ${
          showChat ? 'opacity-100 translate-y-0 h-[70vh] sm:h-[calc(100vh-10rem)]' : 'opacity-0 translate-y-full sm:translate-y-4 h-0 pointer-events-none'
        }`}
      >
        <div className="p-4 bg-gradient-to-r from-red-950/80 to-slate-950/80 border-b border-white/5 flex items-center justify-between">
          <h3 className="text-white font-bold flex items-center gap-2 text-sm uppercase tracking-widest">
            <span>📜</span> Transmission History
          </h3>
          <button onClick={() => setShowChat(false)} className="sm:hidden text-white/50 p-2">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
        </div>
        
        <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-6 scroll-smooth">
          {history.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full opacity-20 italic space-y-2">
                <span className="text-4xl">❄️</span>
                <p className="text-sm text-center">"Connect to begin the magical transmission..."</p>
            </div>
          ) : (
            history.map((msg, idx) => (
              <div key={idx} className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'} animate-in slide-in-from-bottom-2`}>
                 <span className="text-[9px] font-black uppercase text-white/30 mb-2 px-1">{msg.role === 'model' ? 'Santa Claus' : 'Earth Terminal'}</span>
                 <div 
                   className={`max-w-[90%] sm:max-w-[85%] px-4 py-2.5 sm:px-5 sm:py-3 rounded-2xl text-sm leading-relaxed shadow-lg ${
                     msg.role === 'user' 
                       ? 'bg-blue-600 text-white rounded-tr-sm border border-blue-400/30' 
                       : 'bg-red-900/40 text-red-50 rounded-tl-sm border border-red-500/20'
                   }`}
                 >
                   {msg.text}
                 </div>
              </div>
            ))
          )}
        </div>
      </div>

    </div>
  );
};

export default App;
