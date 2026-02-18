
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_ANON_KEY);

export default async function handler(req, res) {
  if (req.method === 'GET') {
    const { data: settings } = await supabase.from('settings').select('registration_open').eq('id', 1).single();
    const { count } = await supabase.from('teams').select('*', { count: 'exact', head: true });
    return res.status(200).json({ isOpen: settings?.registration_open, count });
  }

  if (req.method === 'POST') {
    const { isOpen } = req.body;
    const { error } = await supabase.from('settings').update({ registration_open: isOpen }).eq('id', 1);
    if (error) return res.status(500).json({ error: 'Update failed' });
    return res.status(200).json({ success: true });
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
