
import React, { useState, useEffect } from 'react';
import { PopupType, TeamRegistration } from '../types';

interface Props {
  showPopup: (type: PopupType, message: string) => void;
  hidePopup: () => void;
}

export const RegistrationFlow: React.FC<Props> = ({ showPopup, hidePopup }) => {
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [isVerified, setIsVerified] = useState(false);
  const [isRegOpen, setIsRegOpen] = useState(true);
  
  const [formData, setFormData] = useState<TeamRegistration>({
    teamName: '',
    phone: '',
    players: Array(5).fill(null).map(() => ({ id: '', nickname: '' }))
  });

  useEffect(() => {
    const checkStatus = async () => {
      try {
        const res = await fetch('/api/admin-toggle');
        const data = await res.json();
        setIsRegOpen(data.isOpen);
      } catch (e) {}
    };
    checkStatus();
  }, []);

  const handleSendOtp = async () => {
    let normalizedPhone = phone.trim().replace(/[^0-9]/g, '');
    
    // Normalisasi: jika diawali '08', ganti jadi '628'
    if (normalizedPhone.startsWith('08')) {
      normalizedPhone = '62' + normalizedPhone.slice(1);
    }
    
    // Validasi dasar
    if (!normalizedPhone.startsWith('628')) {
      showPopup('error', 'Masukkan nomor WhatsApp yang valid (contoh: 0812...)');
      return;
    }

    if (normalizedPhone.length < 10) {
      showPopup('error', 'Nomor telepon terlalu pendek.');
      return;
    }

    showPopup('loading', 'Mengirim OTP...');
    try {
      const response = await fetch('/api/send-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone: normalizedPhone }),
      });
      const data = await response.json();
      
      if (response.ok) {
        setPhone(normalizedPhone); // Simpan nomor yang sudah dinormalisasi
        showPopup('success', 'OTP terkirim ke WhatsApp.');
        setStep(2);
      } else {
        showPopup('error', data.error || 'Gagal mengirim OTP.');
      }
    } catch (err) {
      showPopup('error', 'Terjadi kesalahan jaringan.');
    }
  };

  const handleVerifyOtp = async () => {
    showPopup('loading', 'Memverifikasi...');
    try {
      const response = await fetch('/api/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone, otp }),
      });
      const data = await response.json();

      if (response.ok) {
        showPopup('success', 'Verifikasi Berhasil!');
        setIsVerified(true);
        setFormData(prev => ({ ...prev, phone }));
        setStep(3);
      } else {
        showPopup('error', data.error || 'Kode OTP salah.');
      }
    } catch (err) {
      showPopup('error', 'Terjadi kesalahan jaringan.');
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    showPopup('loading', 'Mendaftarkan tim...');
    try {
      const response = await fetch('/api/register-team', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      if (response.ok) {
        showPopup('success', 'Tim berhasil didaftarkan!');
        setStep(1);
        setPhone('');
        setOtp('');
        setIsVerified(false);
      } else {
        const data = await response.json();
        showPopup('error', data.error || 'Gagal mendaftar.');
      }
    } catch (err) {
      showPopup('error', 'Terjadi kesalahan jaringan.');
    }
  };

  if (!isRegOpen) {
    return (
      <div className="p-12 text-center">
        <div className="bg-amber-500/10 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg className="w-6 h-6 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
        </div>
        <h2 className="text-lg font-bold mb-1">Pendaftaran Ditutup</h2>
        <p className="text-slate-400 text-sm">Maaf, pendaftaran sedang tidak menerima peserta baru.</p>
      </div>
    );
  }

  return (
    <div className="p-8">
      {/* Simple Progress bar */}
      <div className="flex gap-2 mb-8">
        {[1, 2, 3].map(i => (
          <div key={i} className={`h-1 flex-1 rounded-full ${step >= i ? 'bg-blue-600' : 'bg-slate-700'}`}></div>
        ))}
      </div>

      {step === 1 && (
        <div className="space-y-5">
          <div>
            <h3 className="text-lg font-bold mb-1">Verifikasi WhatsApp</h3>
            <p className="text-slate-400 text-sm">Gunakan nomor WA aktif untuk OTP.</p>
          </div>
          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-500 uppercase">Nomor WhatsApp</label>
            <input 
              type="text" 
              placeholder="Masukkan nomor WA"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-blue-600/50 transition-all text-white"
            />
          </div>
          <button 
            onClick={handleSendOtp}
            className="w-full accent-blue py-3 rounded-lg font-bold text-white transition-all"
          >
            Kirim Kode OTP
          </button>
        </div>
      )}

      {step === 2 && (
        <div className="space-y-5">
          <div>
            <h3 className="text-lg font-bold mb-1">Masukkan Kode</h3>
            <p className="text-slate-400 text-sm">Kode dikirim ke {phone}</p>
          </div>
          <input 
            type="text" 
            maxLength={6}
            placeholder="000000"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-3 text-center text-xl tracking-widest outline-none focus:ring-2 focus:ring-blue-600/50 text-white"
          />
          <div className="flex gap-3">
            <button onClick={() => setStep(1)} className="flex-1 bg-slate-700 py-3 rounded-lg text-sm font-bold">Ganti Nomor</button>
            <button onClick={handleVerifyOtp} className="flex-1 accent-blue py-3 rounded-lg text-sm font-bold">Verifikasi</button>
          </div>
        </div>
      )}

      {step === 3 && (
        <form onSubmit={handleRegister} className="space-y-6">
          <div>
            <h3 className="text-lg font-bold mb-1">Detail Tim</h3>
            <p className="text-slate-400 text-sm">Lengkapi data tim dan pemain.</p>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-500 uppercase">Nama Tim</label>
            <input 
              required
              type="text" 
              placeholder="Contoh: Evos Legend"
              value={formData.teamName}
              onChange={(e) => setFormData({...formData, teamName: e.target.value})}
              className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-blue-600/50 text-white"
            />
          </div>

          <div className="space-y-3">
            <label className="text-xs font-bold text-slate-500 uppercase">Roster (5 Pemain)</label>
            {formData.players.map((p, idx) => (
              <div key={idx} className="flex gap-2">
                <input 
                  required
                  placeholder={`Nickname P${idx + 1}`}
                  value={p.nickname}
                  onChange={(e) => {
                    const players = [...formData.players];
                    players[idx].nickname = e.target.value;
                    setFormData({...formData, players});
                  }}
                  className="flex-[2] bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm outline-none focus:border-blue-500"
                />
                <input 
                  required
                  placeholder="ID (Server)"
                  value={p.id}
                  onChange={(e) => {
                    const players = [...formData.players];
                    players[idx].id = e.target.value;
                    setFormData({...formData, players});
                  }}
                  className="flex-1 bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm outline-none focus:border-blue-500"
                />
              </div>
            ))}
          </div>

          <button 
            type="submit"
            className="w-full accent-blue py-3.5 rounded-lg font-bold text-white transition-all shadow-lg shadow-blue-600/10"
          >
            Selesaikan Pendaftaran
          </button>
        </form>
      )}
    </div>
  );
};
