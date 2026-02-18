
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_ANON_KEY);

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  let { phone } = req.body;

  if (!phone) {
    return res.status(400).json({ error: 'Phone number is required' });
  }

  // Normalisasi di sisi server juga untuk keamanan
  phone = phone.trim().replace(/[^0-9]/g, '');
  if (phone.startsWith('08')) {
    phone = '62' + phone.slice(1);
  }

  if (!phone.startsWith('62')) {
    return res.status(400).json({ error: 'Format nomor tidak didukung. Gunakan 08... atau 628...' });
  }

  // Rate limit check (60s)
  const { data: recent } = await supabase
    .from('verifications')
    .select('created_at')
    .eq('phone', phone)
    .order('created_at', { ascending: false })
    .limit(1)
    .single();

  if (recent) {
    const lastSent = new Date(recent.created_at).getTime();
    const now = Date.now();
    if (now - lastSent < 60000) {
      return res.status(429).json({ error: 'Mohon tunggu 60 detik sebelum meminta OTP lagi.' });
    }
  }

  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  const expireAt = Date.now() + 5 * 60 * 1000; // 5 mins

  const { error: dbError } = await supabase.from('verifications').insert({
    phone,
    otp,
    expire_at: expireAt,
    verified: false
  });

  if (dbError) return res.status(500).json({ error: 'Database error' });

  // Fonnte API call
  try {
    const fonnteRes = await fetch('https://api.fonnte.com/send', {
      method: 'POST',
      headers: {
        'Authorization': process.env.FONNTE_TOKEN
      },
      body: new URLSearchParams({
        'target': phone,
        'message': `[MLBB SPARRING] Kode OTP anda adalah: ${otp}. Kode ini berlaku selama 5 menit. Jangan berikan kode ini kepada siapapun.`
      })
    });
    
    const fonnteData = await fonnteRes.json();
    if (fonnteData.status) {
      return res.status(200).json({ success: true });
    } else {
      return res.status(500).json({ error: 'Gagal mengirim WhatsApp via Fonnte.' });
    }
  } catch (err) {
    return res.status(500).json({ error: 'Koneksi Fonnte gagal.' });
  }
}
