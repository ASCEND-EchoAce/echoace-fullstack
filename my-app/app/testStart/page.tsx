'use client';

import * as React from 'react';
import { useRouter } from 'next/router'; // Import the useRouter hook
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuLabel,
  DropdownMenuShortcut
} from '@/components/ui/dropdown-menu'; // Import from your components

const Page: React.FC = () => {
  const router = useRouter(); // Initialize the router to programmatically navigate

  // Function to navigate to the survey page
  const goToSurvey = () => {
    router.push('/survey'); // Navigate to the /survey page
  };

  return (
    <div style={styles.pageContainer}>
      {/* Main Section with Background */}
      <section style={styles.section}>
        <div style={styles.contentContainer}>
          <h2 style={styles.title}>Welcome to EchoAce</h2>

          {/* DropdownMenu Component */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button style={styles.button}>Tell me about yourself...</button>
            </DropdownMenuTrigger>

            {/* DropdownMenuContent */}
            <DropdownMenuContent sideOffset={4}>
              <DropdownMenuLabel>Choose an option</DropdownMenuLabel>
              <DropdownMenuItem onClick={() => alert('Option 1 clicked')}>
                My greatest challenge is...
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => alert('Option 2 clicked')}>
                My Greatest moment was...
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => alert('Option 3 clicked')}>
                On a team I like to...
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              {/* Go to Survey Item */}
              <DropdownMenuItem onClick={goToSurvey}>
                Go to Survey
                <DropdownMenuShortcut>⌘S</DropdownMenuShortcut>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </section>
    </div>
  );
};

// Example styles to position everything
const styles: { [key: string]: React.CSSProperties } = {
  pageContainer: {
    height: '100vh',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
    backgroundColor: '#222'
  },
  section: {
    backgroundColor: '#2c2c2c',
    padding: '50px',
    borderRadius: '8px',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.5)',
    textAlign: 'center',
    position: 'relative'
  },
  contentContainer: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center'
  },
  title: {
    color: '#e0e0e0',
    fontSize: '2.5em',
    marginBottom: '30px',
    fontWeight: 'bold'
  },
  button: {
    backgroundColor: '#ffffff',
    color: '#333333',
    border: 'none',
    padding: '15px 30px',
    fontSize: '1.2em',
    fontWeight: 'bold',
    borderRadius: '5px',
    cursor: 'pointer',
    transition: 'background-color 0.3s ease'
  }
};

export default Page;
