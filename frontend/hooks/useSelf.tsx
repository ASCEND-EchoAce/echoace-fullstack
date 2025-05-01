'use client';

import { createContext, useContext } from 'react';
import { User } from '@supabase/supabase-js';

export type SelfContextType = {
  user: User | null;
  profile: any | null;
};

export const SelfContext = createContext<SelfContextType | undefined>(undefined);

export function useSelf() {
  const context = useContext(SelfContext);
  
  if (context === undefined) {
    throw new Error('useSelf must be used within a SelfProvider');
  }
  
  return context;
}
