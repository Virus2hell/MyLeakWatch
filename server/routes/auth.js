const express = require('express');
const supabase = require('../lib/supabase');
const router = express.Router();

// Add monitored email (user must be authenticated)
router.post('/add-email', async (req, res) => {
  const { user_id } = await supabase.auth.getUser(req.headers.authorization?.split(' ')[1]);
  const { email, frequency } = req.body;
  
  const { data, error } = await supabase
    .from('auth.users')
    .update({ monitored_email: email, notification_frequency: frequency })
    .eq('id', user_id.data.user.id);
    
  if (error) return res.status(400).json({ error });
  res.json({ success: true });
});
