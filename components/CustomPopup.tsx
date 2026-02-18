
import React from 'react';
import { PopupType } from '../types';

interface CustomPopupProps {
  type: PopupType;
  message: string;
  onClose: () => void;
}

export const CustomPopup: React.FC<CustomPopupProps> = ({ type, message, onClose }) => {
  if (!type) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
      <div className={`w-full max-w-sm rounded-2xl p-6 shadow-2xl border ${
        type === 'error' ? 'bg-slate-900 border-red-500/50' : 
        type === 'success' ? 'bg-slate-900 border-green-500/50' : 
        'bg-slate-900 border-blue-500/50'
      }`}>
        <div className="flex flex-col items-center text-center">
          {type === 'loading' && (
            <div className="mb-4">
              <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
            </div>
          )}
          
          {type === 'success' && (
            <div className="mb-4 bg-green-500/20 p-3 rounded-full text-green-500">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
              </svg>
            </div>
          )}

          {type === 'error' && (
            <div className="mb-4 bg-red-500/20 p-3 rounded-full text-red-500">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </div>
          )}

          <h3 className={`text-lg font-bold mb-2 ${
            type === 'error' ? 'text-red-400' : 
            type === 'success' ? 'text-green-400' : 
            'text-blue-400'
          }`}>
            {type.toUpperCase()}
          </h3>
          <p className="text-slate-300 text-sm leading-relaxed mb-6">
            {message}
          </p>

          {type !== 'loading' && (
            <button
              onClick={onClose}
              className={`w-full py-2.5 rounded-xl font-semibold transition-all shadow-lg ${
                type === 'error' ? 'bg-red-600 hover:bg-red-700 shadow-red-500/20' : 
                'bg-slate-800 hover:bg-slate-700'
              }`}
            >
              Dismiss
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
