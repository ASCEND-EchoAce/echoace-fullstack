'use client';

import { createClient } from '@/utils/supabase/client';
import { useEffect, useState } from 'react';

export default function Page() {
  const [notes, setNotes] = useState<any[] | null>(null);
  const supabase = createClient();

  useEffect(() => {
    const getData = async () => {
      const { data } = await supabase.from('notes').select();
      setNotes(data);
    };
    getData();
  }, []);

  return (
    <div>
      <h1>My Notes</h1>
      <p>Welcome to my notes page! Here are all the notes I've created:</p>

      {/* Displaying the notes from the Supabase database
      <pre>{JSON.stringify(notes, null, 2)}</pre> */}

      {/* Add any other content here */}
      <p>Feel free to explore and add your own notes!</p>
      <footer>
        <p>Powered by Next.js and Supabase.</p>
      </footer>
    </div>
  );
}
