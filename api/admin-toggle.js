import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY
);

export default async function handler(req, res) {
  try {
    // ================= GET STATUS =================
    if (req.method === 'GET') {
      const { data: settings, error: settingsError } = await supabase
        .from('settings')
        .select('registration_open')
        .eq('id', 1)
        .single();

      if (settingsError) {
        return res.status(500).json({ error: 'Failed get settings' });
      }

      const { count, error: countError } = await supabase
        .from('teams')
        .select('*', { count: 'exact', head: true });

      if (countError) {
        return res.status(500).json({ error: 'Failed count teams' });
      }

      return res.status(200).json({
        isOpen: settings?.registration_open ?? false,
        count: count ?? 0
      });
    }

    // ================= UPDATE STATUS =================
    if (req.method === 'POST') {
      // 🔐 ADMIN PROTECTION
      const key = req.headers['x-admin-key'];
      if (key !== process.env.ADMIN_KEY) {
        return res.status(403).json({ error: 'Unauthorized' });
      }

      const { isOpen } = req.body;

      const { error } = await supabase
        .from('settings')
        .update({ registration_open: isOpen })
        .eq('id', 1);

      if (error) {
        return res.status(500).json({ error: 'Update failed' });
      }

      return res.status(200).json({ success: true });
    }

    return res.status(405).json({ error: 'Method not allowed' });

  } catch (err) {
    return res.status(500).json({ error: 'Server error' });
  }
                                 }
