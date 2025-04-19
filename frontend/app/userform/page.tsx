'use client';

import SurveyForm from '@/components/SurveyForm';
import { createClient } from '@/utils/supabase/client';
import { useTheme } from 'next-themes';
import { useEffect } from 'react';
import { redirect, useRouter } from 'next/navigation';

export default function Page() {
  const router = useRouter();

  useEffect(() => {
    const checkAuth = async () => {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        redirect('/sign-in');
      }
    };
    checkAuth();
  }, [router]);
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

  const{theme} = useTheme();


  let titleStyle: React.CSSProperties;
  if (theme === 'dark') titleStyle = { fontSize: '3rem', textAlign: 'center', color: '#fff', marginBottom: '20px' };
   else {
    titleStyle = { fontSize: '3rem',textAlign: 'center', color: '#000', marginBottom: '20px' }
   }
  return (
    <div>
      <h1 style={titleStyle}>
        Opening Survey
      </h1>
      <p></p>

      <SurveyForm />

    </div>
  );
}
