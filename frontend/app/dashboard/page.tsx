import { startInterviewAction } from '@/app/actions';
import { createClient } from '@/utils/supabase/server';
import { redirect } from 'next/navigation';
import { Label } from '@/components/ui/label';

export default async function ProtectedPage() {
  const supabase = await createClient();

  const {
    data: { user }
  } = await supabase.auth.getUser();

  if (!user) {
    return redirect('/sign-in');
  }

  return (
    <div className="flex-1 w-full flex flex-col gap-12">
      <div className="flex flex-col mt-20 gap-2 items-start">
        <h2 className="font-bold text-2xl mb-4">ECHOACE INTERVIEW</h2>
      </div>
      <div className="flex flex-col mt-4">
        <Label htmlFor="current-status">Starting Question</Label>
        <select name="current-status" className="border rounded-md p-3 mt-3" required>
          <option value="">Tell me about yourself</option>
          <option value="student">Why LinkedIn?</option>
          <option value="employed">Tell me about a time...</option>
        </select>
      </div>
      <div className="flex justify-center gap-4 mt-4">
        <form action={startInterviewAction}>
          <button type="submit" className="bg-black text-white py-2 px-4 rounded">
            Start Interview
          </button>
        </form>
      </div>
    </div>
  );
}
