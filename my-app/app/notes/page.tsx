'use client';

import { createClient } from '@/utils/supabase/client';
import { useEffect, useState } from 'react';
import SurveyForm from '@/components/SurveyForm';

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
      <h1 style={{ fontSize: '3rem', textAlign: 'center', color: '#fff', marginBottom: '20px' }}>
        Opening Survey
      </h1>
      <p></p>

      {/* Displaying the notes from the Supabase database 
        <pre>{JSON.stringify(notes, null, 2)}</pre>
        */}
      {/* Render Survey Component */}
      <SurveyForm />

      {/* Add any other content here */}
      <p></p>
      <footer>
        <p></p>
      </footer>
    </div>
  );
}
