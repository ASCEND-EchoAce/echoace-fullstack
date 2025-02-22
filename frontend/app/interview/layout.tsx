export default function InterviewLayout({
    children,
  }: {
    children: React.ReactNode;
  }) {
    return (
        <main className="min-h-screen flex flex-col items-center">
            <div className="flex-1 w-full flex flex-col gap-10 items-center">
                <div className="flex flex-col gap-5 max-w-3xl p-3 w-2xl mx-auto">
                    {children}
                </div>
            </div>
        </main>
    );
  }
  