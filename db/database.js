require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

const supabaseURL = process.env.SUPABASE_URL;
const supabaseSecret = process.env.SUPABASE_SECRET;

const supabase = createClient(supabaseURL, supabaseSecret);

module.exports = supabase;