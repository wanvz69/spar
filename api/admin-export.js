
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_ANON_KEY);

export default async function handler(req, res) {
  const { data, error } = await supabase.from('teams').select('*').order('created_at', { ascending: false });

  if (error) return res.status(500).send('Database error');

  const headers = [
    'ID', 'Team Name', 'Contact', 
    'P1 ID', 'P1 Name', 
    'P2 ID', 'P2 Name', 
    'P3 ID', 'P3 Name', 
    'P4 ID', 'P4 Name', 
    'P5 ID', 'P5 Name', 
    'Registered At'
  ];

  const csvRows = [headers.join(',')];

  data.forEach(t => {
    const row = [
      t.id, 
      `"${t.team_name.replace(/"/g, '""')}"`, 
      t.phone,
      t.player1_id, `"${t.player1_name.replace(/"/g, '""')}"`,
      t.player2_id, `"${t.player2_name.replace(/"/g, '""')}"`,
      t.player3_id, `"${t.player3_name.replace(/"/g, '""')}"`,
      t.player4_id, `"${t.player4_name.replace(/"/g, '""')}"`,
      t.player5_id, `"${t.player5_name.replace(/"/g, '""')}"`,
      t.created_at
    ];
    csvRows.push(row.join(','));
  });

  res.setHeader('Content-Type', 'text/csv');
  res.setHeader('Content-Disposition', 'attachment; filename=mlbb_sparring_teams.csv');
  return res.status(200).send(csvRows.join('\n'));
}
