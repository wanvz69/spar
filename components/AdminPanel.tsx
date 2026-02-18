
import React, { useState, useEffect } from 'react';
import { PopupType } from '../types';

interface Props {
  showPopup: (type: PopupType, message: string) => void;
  hidePopup: () => void;
}

export const AdminPanel: React.FC<Props> = ({ showPopup, hidePopup }) => {
  const [isOpen, setIsOpen] = useState(true);
  const [stats, setStats] = useState({ totalTeams: 0 });

  useEffect(() => {
    fetchStatus();
  }, []);

  const fetchStatus = async () => {
    try {
      const res = await fetch('/api/admin-toggle');
      const data = await res.json();
      setIsOpen(data.isOpen);
      setStats({ totalTeams: data.count || 0 });
    } catch (e) {}
  };

  const handleToggle = async () => {
    showPopup('loading', 'Memperbarui status...');
    try {
      const response = await fetch('/api/admin-toggle', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isOpen: !isOpen }),
      });
      if (response.ok) {
        setIsOpen(!isOpen);
        showPopup('success', `Pendaftaran telah ${!isOpen ? 'DIBUKA' : 'DITUTUP'}`);
      }
    } catch (e) {
      showPopup('error', 'Gagal memperbarui status.');
    }
  };

  const handleExport = async () => {
    window.location.href = '/api/admin-export';
    showPopup('success', 'Mengunduh data CSV...');
  };

  const handleDeleteAll = async () => {
    if (!confirm('Hapus semua data tim secara permanen?')) return;

    showPopup('loading', 'Menghapus data...');
    try {
      const response = await fetch('/api/admin-delete-all', { method: 'POST' });
      if (response.ok) {
        showPopup('success', 'Semua data tim telah dihapus.');
        fetchStatus();
      }
    } catch (e) {
      showPopup('error', 'Gagal menghapus data.');
    }
  };

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold">Admin Panel</h2>
        <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${isOpen ? 'bg-green-500/10 text-green-500' : 'bg-red-500/10 text-red-500'}`}>
          {isOpen ? 'AKTIF' : 'NONAKTIF'}
        </span>
      </div>

      <div className="bg-slate-900 border border-slate-700 p-5 rounded-xl mb-8 flex justify-between items-center">
        <span className="text-slate-400 text-sm">Total Tim Terdaftar:</span>
        <span className="text-2xl font-bold text-blue-500">{stats.totalTeams}</span>
      </div>

      <div className="space-y-3">
        <button 
          onClick={handleToggle}
          className={`w-full py-3 rounded-lg font-bold text-white transition-all ${isOpen ? 'bg-amber-600 hover:bg-amber-700' : 'bg-green-600 hover:bg-green-700'}`}
        >
          {isOpen ? 'Tutup Pendaftaran' : 'Buka Pendaftaran'}
        </button>

        <button 
          onClick={handleExport}
          className="w-full bg-slate-700 py-3 rounded-lg font-bold hover:bg-slate-600 transition-all flex items-center justify-center gap-2"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
          </svg>
          Export Data ke CSV
        </button>

        <div className="pt-6 mt-6 border-t border-slate-700">
          <button 
            onClick={handleDeleteAll}
            className="w-full text-red-500 text-xs font-bold py-2 hover:bg-red-500/5 rounded transition-all"
          >
            Hapus Semua Data (Reset)
          </button>
        </div>
      </div>
    </div>
  );
};
