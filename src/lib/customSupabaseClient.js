import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://qtvaxhrdylvaxcigrqqm.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InF0dmF4aHJkeWx2YXhjaWdycXFtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjEwNDg4ODIsImV4cCI6MjA3NjYyNDg4Mn0.Bjgv96X5NCJJBUOFi2pBv7nFQTgyBsm3mAf47YEC-NE';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);