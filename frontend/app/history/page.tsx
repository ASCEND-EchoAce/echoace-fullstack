import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import { SubmitButton } from "@/components/submit-button";


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
      <div className="flex flex-col mt-20 gap-2 items-center">
        <h2 className="font-bold text-4xl mb-1">Your History</h2>
      </div>
      <p className="text-xl mb-1">Look through your previous chats with us!</p>
      <div className="flex flex-wrap gap-10"> 
        <div className="flex border-2 w-120 h-40 rounded mt-4 mb-10">
          <p className="font-bold text-xl">Interview #1</p>
        </div> 
        <div className="flex border-2 w-120 h-40 rounded mt-4 mb-10">
          <p className="font-bold text-xl">Interview #2</p>
        </div>
      </div>
    </div>
  );
}
