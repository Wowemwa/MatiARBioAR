import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  'https://zbgyhlvtypauqwqwzmyh.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpiZ3lobHZ0eXBhdXF3cXd6bXloIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjM0NjUwNDgsImV4cCI6MjA3OTA0MTA0OH0.txszT7ZVunObHTefxOnXy-u-Wt5hRxmw8fMvzVRScNE'
);

async function checkAudio() {
  const { data, error } = await supabase
    .from('species')
    .select('id, common_name, category, audio_url');

  if (error) {
    console.error('Error:', error);
    return;
  }

  console.log('Species with audio:');
  data.forEach(s => {
    if (s.audio_url) {
      console.log(`- ${s.common_name} (${s.category}): ${s.audio_url}`);
    }
  });

  console.log('\nAll species:');
  data.forEach(s => console.log(`- ${s.common_name} (${s.category}): audio=${!!s.audio_url}`));
}

checkAudio();