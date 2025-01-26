'use client';

import { createClient } from '@/utils/supabase/client';
import { useEffect, useState } from 'react';
import SurveyForm from '@/components/SurveyForm';

export default function Page() {
  // const [notes, setNotes] = useState<any[] | null>(null);
  // const supabase = createClient();

  //   useEffect(() => {
  //     const getData = async () => {
  //       const { data } = await supabase.from('notes').select();
  //       setNotes(data);
  //     };
  //     getData();
  //   }, []);
  // If we want to actually use sql and tables (backend?)

  return (
    <div>
      <h1 style={{ fontSize: '3rem', textAlign: 'center', color: '#fff', marginBottom: '20px' }}>
        Opening Survey
      </h1>
      <p></p>

      <SurveyForm />

    </div>
  );
}
