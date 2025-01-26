import { createClient } from "@/utils/supabase/server";
import { InfoIcon } from "lucide-react";
import { redirect } from "next/navigation";
import {endInterviewAction} from "@/app/actions";


export default async function ProtectedPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return redirect("/sign-in");
  }

  return (
    <div className="flex-1 w-full flex flex-col gap-12">
      <div className="w-full">
        <div className="bg-accent text-sm p-3 px-5 rounded-md text-foreground flex gap-3 items-center">
          <InfoIcon size="16" strokeWidth={2} />
          This is during the interview page
        </div>
      </div>
      <div className="flex flex-col gap-2 items-start">
        <h2 className="font-bold text-2xl mb-4">Tell me about Yourself</h2>
        
      </div>
      <div className="bg-gray-300 hover:bg-gray-400 text-black font-semibold py-40 px-30 rounded">
      </div> 
      <div className="flex justify-center gap-4 mt-4">
        <form action={endInterviewAction}>
          <button type="submit" className="bg-black text-white py-2 px-4 rounded">
            End Interview
          </button>
        </form>
      </div> 
    </div>
  );
}
