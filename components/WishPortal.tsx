
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
    <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/60 backdrop-blur-md animate-in fade-in duration-300">
      <div className="relative w-full max-w-lg bg-gradient-to-b from-red-950 to-slate-950 rounded-t-[2.5rem] sm:rounded-3xl p-6 sm:p-8 border-t sm:border border-yellow-500/30 shadow-[0_0_50px_rgba(234,179,8,0.2)] overflow-hidden animate-in slide-in-from-bottom sm:zoom-in duration-500">
        
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-yellow-400 to-transparent animate-pulse" />
        
        {!isSent ? (
          <>
            <button 
              onClick={onClose}
              className="absolute top-4 right-4 text-white/50 hover:text-white p-2 transition-colors active:scale-75"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            <div className="text-center mb-6 pt-4">
              <span className="text-4xl mb-2 block animate-bounce">✨</span>
              <h2 className="text-2xl sm:text-3xl font-black text-white mb-1">North Pole Registry</h2>
              <p className="text-white/50 text-xs uppercase tracking-widest font-bold">Secure Christmas Transmission</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-4">
              <div className="grid grid-cols-1 gap-3">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-yellow-500/60 uppercase ml-1">Full Name</label>
                  <input
                    type="text"
                    autoComplete="name"
                    placeholder="Enter your name..."
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    className="w-full bg-white/5 border border-white/10 rounded-xl p-3.5 text-white placeholder:text-white/20 focus:outline-none focus:border-yellow-500/50 transition-all"
                    required
                  />
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-yellow-500/60 uppercase ml-1">Email</label>
                    <input
                      type="email"
                      autoComplete="email"
                      placeholder="Email address"
                      value={formData.email}
                      onChange={(e) => setFormData({...formData, email: e.target.value})}
                      className="w-full bg-white/5 border border-white/10 rounded-xl p-3.5 text-white placeholder:text-white/20 focus:outline-none focus:border-yellow-500/50 text-sm transition-all"
                      required
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-yellow-500/60 uppercase ml-1">Phone</label>
                    <input
                      type="tel"
                      autoComplete="tel"
                      placeholder="Phone number"
                      value={formData.phone}
                      onChange={(e) => setFormData({...formData, phone: e.target.value})}
                      className="w-full bg-white/5 border border-white/10 rounded-xl p-3.5 text-white placeholder:text-white/20 focus:outline-none focus:border-yellow-500/50 text-sm transition-all"
                      required
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-yellow-500/60 uppercase ml-1">Your Wish</label>
                <textarea
                  value={formData.text}
                  onChange={(e) => setFormData({...formData, text: e.target.value})}
                  placeholder="Tell Santa your heart's desire..."
                  className="w-full h-32 bg-white/5 border border-white/10 rounded-xl p-4 text-white placeholder:text-white/20 focus:outline-none focus:border-yellow-500/50 transition-all resize-none"
                  required
                />
              </div>

              <button
                type="submit"
                className="w-full py-4 bg-gradient-to-r from-yellow-600 to-yellow-500 text-slate-900 font-black uppercase tracking-tighter rounded-2xl shadow-xl hover:from-yellow-500 hover:to-yellow-400 active:scale-[0.98] transition-all flex items-center justify-center gap-2 mb-4"
              >
                <span>Dispatch to Santa</span>
                <span className="text-xl">🚀</span>
              </button>
            </form>
          </>
        ) : (
          <div className="text-center py-16 animate-in zoom-in duration-500">
            <div className="relative inline-block mb-6">
              <span className="text-7xl">📬</span>
              <div className="absolute -top-2 -right-2 w-6 h-6 bg-yellow-400 rounded-full animate-ping" />
            </div>
            <h2 className="text-3xl font-black text-white mb-4">Registry Updated!</h2>
            <p className="text-yellow-400/90 font-bold uppercase tracking-widest text-sm">Transmission Confirmed</p>
            <div className="mt-8 flex justify-center gap-3">
              {[1, 2, 3].map(i => (
                <div key={i} className="w-2.5 h-2.5 bg-yellow-500 rounded-full animate-bounce" style={{ animationDelay: `${i * 0.15}s` }} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
