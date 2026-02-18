
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_ANON_KEY);

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  // Delete all rows from teams table
  const { error } = await supabase.from('teams').delete().neq('id', '00000000-0000-0000-0000-000000000000');

  if (error) return res.status(500).json({ error: 'Deletion failed' });

  return res.status(200).json({ success: true });
}
