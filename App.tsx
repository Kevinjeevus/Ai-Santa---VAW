
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

    const fullMessage = `I have a Christmas wish from ${wishData.name}! Their wish is: ${wishData.text}. Please acknowledge this wish and their kindness!`;
    if (connectionState === 'CONNECTED') {
        sendTextMessage(fullMessage);
    }
  };

  const handleHelpWish = (wishId: string) => {
    setWishes(prev => prev.map(w => 
      w.id === wishId ? { ...w, sponsors: w.sponsors + 1 } : w
    ));
    alert("Thank you for offering to help! We'll send the details of this wish to your registry.");
  };

  return (
    <div className="relative w-full h-full bg-[#050b1a] overflow-hidden">
      
      {/* Platform Branding */}
      <div className="absolute top-6 left-6 z-10 pointer-events-none">
        <h1 className="text-white font-black text-2xl sm:text-3xl tracking-tighter flex items-center gap-2 drop-shadow-2xl">
          <span className="text-red-500">SANTA</span>
          <span className="bg-white/10 px-2 py-0.5 rounded-lg border border-white/10 text-lg uppercase tracking-widest">Live</span>
        </h1>
        <p className="text-white/40 text-[10px] font-bold uppercase tracking-[0.2em] mt-1 ml-1">North Pole Interactive</p>
      </div>

      <Canvas shadows camera={{ position: [0, 0.5, 7.5], fov: 28, near: 0.1, far: 20 }}>
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

      {/* Chat Toggle */}
      <div className="absolute top-4 right-4 z-10">
        <button 
          onClick={() => setShowChat(!showChat)}
          className="bg-slate-900/50 backdrop-blur-xl border border-white/10 p-4 rounded-2xl text-white hover:bg-slate-800/60 transition-all shadow-xl flex items-center gap-2"
        >
          <span className="hidden sm:inline font-bold text-sm">{showChat ? 'Close Log' : 'Chat Log'}</span>
          {showChat ? (
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 20.25c4.97 0 9-3.694 9-8.25s-4.03-8.25-9-8.25S3 7.444 3 12c0 2.104.859 4.023 2.273 5.48.432.447.74 1.04.586 1.641a4.483 4.483 0 01-.923 1.785 0.475 0.475 0 00.334.797c.803 0 1