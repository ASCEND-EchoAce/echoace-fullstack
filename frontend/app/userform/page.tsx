'use client';


import SurveyForm from '@/components/SurveyForm';
import { useTheme } from 'next-themes';
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

  const{theme} = useTheme();


  let titleStyle: React.CSSProperties;
  if (theme === 'dark') titleStyle = { fontSize: '3rem', textAlign: 'center', color: '#fff', marginBottom: '20px' };
   else {
    titleStyle = { fontSize: '3rem',textAlign: 'center', color: '#000', marginBottom: '20px' }
   }
  return (
    <div className='px-20'>
      {/* <h1 style={titleStyle} className='font-bold'>
        Opening Survey
      </h1>
      <p></p> */}

      <SurveyForm />

    </div>
  );
}
