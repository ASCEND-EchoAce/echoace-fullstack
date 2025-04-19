import { User } from '@supabase/supabase-js';
import { createContext, useContext } from 'react';

export const SelfContext = createContext<User | null | undefined>(undefined);

export const useSelf = (): User => {
  const self = useContext(SelfContext);

  if (self === undefined) {
    throw new Error('useSelf must be used within a SelfProvider');
  } else if (self === null) {
    throw new Error('useSElf must be used while signed in.');
  }

  return self;
};
