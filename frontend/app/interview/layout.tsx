import '../globals.css';
import { ThemeProvider } from 'next-themes';

export default function NoNavbarLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          {/* Notice there is no <Navbar /> here */}
          <main>{children}</main>
        </ThemeProvider>
      </body>
    </html>
  );
}