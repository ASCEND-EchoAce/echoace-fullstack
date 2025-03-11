export default async function profilePage() {
  return (
    <div className="flex-1 w-full flex flex-col items-center hover:gray-300">
        <button className="hover:bg-gray-400 broder bg-gray-200 rounded-full py-20 px-20"></button>
        <h2 className="font-bold text-4xl mt-12">Profile</h2>
        <button className="mt-12 font-bold border border-2 border-blue-500 text-blue-500 rounded-lg py-3 px-8">Edit User Information</button>
        <div className="flex flex-row justify-center mt-20 gap-12 font-bold text-2xl">
          <h2>Membership</h2>
          <h2>History</h2>
          <h2>Setting</h2>
        </div>
    </div>

  );
}
