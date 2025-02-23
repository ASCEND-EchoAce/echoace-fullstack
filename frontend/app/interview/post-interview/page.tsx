import { createClient } from '@/utils/supabase/server';
import { InfoIcon } from 'lucide-react';
import { redirect } from 'next/navigation';
import { moreDetailAction } from '@/app/actions';

export default async function ProtectedPage() {

  return (
    <div className="flex-1 justify-center border-2 w-100 h-40 rounded mt-40 mb-40">
      <div className="flex-1 w-full flex flex-col gap-12">
        <div className="w-full">
          <div className="font-bold text-sm p-3 px-5 rounded-md text-foreground flex gap-3 items-center">
            <InfoIcon size="16" strokeWidth={2} />
            Session Ended
          </div>
          <div className="text-sm px-5 rounded-md text-foreground flex gap-3 items-center">
            <p className="test-smp-3 px-5 rounded-md text-foreground flex gap-3 items-center">
              Great Job! Click here to read our feedback
            </p>
          </div>
        </div>
      </div>
      <div className="flex-1 mt-2 mb-4 ml-10">
        <form action={moreDetailAction}>
          <button type="submit" className="bg-black text-white py-1 px-1 rounded">
            More Details
          </button>
        </form>
      </div>
    </div>
  );
}
