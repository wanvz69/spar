
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_ANON_KEY);

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const { teamName, phone, players } = req.body;

  // 1. Check if reg is open
  const { data: settings } = await supabase.from('settings').select('registration_open').eq('id', 1).single();
  if (!settings?.registration_open) {
    return res.status(403).json({ error: 'Registration is currently closed.' });
  }

  // 2. Check if verified
  const { data: verified } = await supabase
    .from('verifications')
    .select('id')
    .eq('phone', phone)
    .eq('verified', true)
    .limit(1)
    .single();

  if (!verified) {
    return res.status(403).json({ error: 'Phone number not verified.' });
  }

  // 3. Register
  const { error } = await supabase.from('teams').insert({
    team_name: teamName,
    phone: phone,
    player1_id: players[0].id, player1_name: players[0].nickname,
    player2_id: players[1].id, player2_name: players[1].nickname,
    player3_id: players[2].id, player3_name: players[2].nickname,
    player4_id: players[3].id, player4_name: players[3].nickname,
    player5_id: players[4].id, player5_name: players[4].nickname,
  });

  if (error) return res.status(500).json({ error: 'Registration failed in database.' });

  return res.status(200).json({ success: true });
}
