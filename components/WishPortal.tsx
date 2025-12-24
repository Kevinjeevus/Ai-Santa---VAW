
import React, { useState } from 'react';
import { Wish } from '../types';

interface WishPortalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (wishData: Omit<Wish, 'id' | 'timestamp' | 'status' | 'sponsors'>) => void;
}

export const WishPortal: React.FC<WishPortalProps> = ({ isOpen, onClose, onSubmit }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    text: ''
  });
  const [isSent, setIsSent] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.text.trim() || !formData.name.trim()) return;
    
    setIsSent(true);
    onSubmit(formData);
    
    setTimeout(() => {
      setIsSent(false);
      setFormData({ name: '', email: '', phone: '', text: '' });
      onClose();
    }, 3000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md animate-in fade-in duration-300">
      <div className="relative w-full max-w-lg bg-gradient-to-b from-red-950 to-slate-950 rounded-3xl p-8 border border-yellow-500/30 shadow-[0_0_50px_rgba(234,179,8,0.3)] overflow-hidden">
        
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-yellow-400 to-transparent animate-pulse" />
        
        {!isSent ? (
          <>
            <button 
              onClick={onClose}
              className="absolute top-4 right-4 text-white/50 hover:text-white transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            <div className="text-center mb-6">
              <span className="text-4xl mb-2 block">✨</span>
              <h2 className="text-2xl font-bold text-white mb-2">North Pole Registry</h2>
              <p className="text-white/60 text-sm">Santa needs your details to ensure the elves can reach you!</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 gap-3">
                <input
                  type="text"
                  placeholder="Full Name"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-white placeholder:text-white/20 focus:outline-none focus:border-yellow-500/50"
                  required
                />
                <div className="grid grid-cols-2 gap-3">
                  <input
                    type="email"
                    placeholder="Email Address"
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-white placeholder:text-white/20 focus:outline-none focus:border-yellow-500/50 text-sm"
                    required
                  />
                  <input
                    type="tel"
                    placeholder="Phone Number"
                    value={formData.phone}
                    onChange={(e) => setFormData({...formData, phone: e.target.value})}
                    className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-white placeholder:text-white/20 focus:outline-none focus:border-yellow-500/50 text-sm"
                    required
                  />
                </div>
              </div>

              <textarea
                value={formData.text}
                onChange={(e) => setFormData({...formData, text: e.target.value})}
                placeholder="Dear Santa, my wish for the world is..."
                className="w-full h-32 bg-white/5 border border-white/10 rounded-xl p-4 text-white placeholder:text-white/20 focus:outline-none focus:border-yellow-500/50 transition-all resize-none"
                required
              />

              <button
                type="submit"
                className="w-full py-4 bg-gradient-to-r from-yellow-600 to-yellow-500 text-slate-900 font-bold rounded-2xl shadow-xl hover:from-yellow-500 hover:to-yellow-400 active:scale-[0.98] transition-all flex items-center justify-center gap-2"
              >
                <span>Submit to Santa</span>
                <span className="text-xl">🦌</span>
              </button>
            </form>
          </>
        ) : (
          <div className="text-center py-10 animate-in zoom-in duration-500">
            <div className="relative inline-block mb-6">
              <span className="text-6xl">📮</span>
              <div className="absolute -top-2 -right-2 w-4 h-4 bg-yellow-400 rounded-full animate-ping" />
            </div>
            <h2 className="text-3xl font-bold text-white mb-4">Registry Updated!</h2>
            <p className="text-yellow-400/90 font-medium">Santa is reviewing your wish right now...</p>
            <div className="mt-8 flex justify-center gap-2">
              {[1, 2, 3].map(i => (
                <div key={i} className="w-2 h-2 bg-yellow-500 rounded-full animate-bounce" style={{ animationDelay: `${i * 0.1}s` }} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
