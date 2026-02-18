
import React, { useState, useEffect } from 'react';
import { RegistrationFlow } from './components/RegistrationFlow';
import { AdminPanel } from './components/AdminPanel';
import { CustomPopup } from './components/CustomPopup';
import { PopupState, PopupType } from './types';

const App: React.FC = () => {
  const [view, setView] = useState<'user' | 'admin'>('user');
  const [popup, setPopup] = useState<PopupState>({ type: null, message: '' });

  const showPopup = (type: PopupType, message: string) => {
    setPopup({ type, message });
  };

  const hidePopup = () => {
    setPopup({ type: null, message: '' });
  };

  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash;
      setView(hash === '#admin' ? 'admin' : 'user');
    };
    window.addEventListener('hashchange', handleHashChange);
    handleHashChange();
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const toggleAdmin = () => {
    window.location.hash = view === 'user' ? '#admin' : '#';
  };

  return (
    <div className="min-h-screen flex flex-col py-10 px-4 relative">
      {/* Admin Toggle Gear Icon */}
      <button 
        onClick={toggleAdmin}
        className="fixed top-6 right-6 p-2 rounded-full bg-slate-800/50 border border-slate-700 text-slate-400 hover:text-white hover:bg-slate-700 transition-all z-40 group"
        title={view === 'user' ? 'Admin Panel' : 'Back to Home'}
      >
        {view === 'user' ? (
          <svg className="w-6 h-6 group-hover:rotate-90 transition-transform duration-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
        ) : (
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
          </svg>
        )}
      </button>

      <div className="max-w-xl w-full mx-auto flex flex-col items-center mb-8">
        <div className="flex items-center gap-2 mb-2">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
             <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
             </svg>
          </div>
          <h1 className="text-xl font-bold tracking-tight">Sparring <span className="text-blue-500">MLBB</span></h1>
        </div>
        <p className="text-slate-400 text-sm">Registrasi tim untuk pertandingan persahabatan.</p>
      </div>

      <div className="max-w-xl w-full mx-auto">
        <div className="clean-card rounded-2xl shadow-xl overflow-hidden">
          {view === 'user' ? (
            <RegistrationFlow showPopup={showPopup} hidePopup={hidePopup} />
          ) : (
            <AdminPanel showPopup={showPopup} hidePopup={hidePopup} />
          )}
        </div>

        <div className="mt-8 flex flex-col items-center gap-4">
          <a 
            href="https://wa.me/6285860583601" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-[11px] font-bold text-blue-500 hover:text-blue-400 transition-colors flex items-center gap-1 bg-blue-500/5 px-3 py-1 rounded-full border border-blue-500/20"
          >
            <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
            </svg>
            Contact Admin: 6285860583601
          </a>
        </div>
      </div>

      <footer className="mt-auto pt-10 text-center text-slate-600 text-[10px] uppercase tracking-widest font-bold">
        &copy; 2026 wanxyz. All rights reserved.
      </footer>

      <CustomPopup 
        type={popup.type} 
        message={popup.message} 
        onClose={hidePopup} 
      />
    </div>
  );
};

export default App;
