
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_ANON_KEY);

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const { phone, otp } = req.body;

  const { data, error } = await supabase
    .from('verifications')
    .select('*')
    .eq('phone', phone)
    .eq('otp', otp)
    .eq('verified', false)
    .order('created_at', { ascending: false })
    .limit(1)
    .single();

  if (error || !data) {
    return res.status(400).json({ error: 'Invalid OTP or phone number.' });
  }

  if (Date.now() > data.expire_at) {
    return res.status(400).json({ error: 'OTP has expired.' });
  }

  const { error: updateError } = await supabase
    .from('verifications')
    .update({ verified: true })
    .eq('id', data.id);

  if (updateError) return res.status(500).json({ error: 'Update failed.' });

  return res.status(200).json({ success: true });
}
