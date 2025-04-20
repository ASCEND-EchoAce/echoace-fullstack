import { createContext, useContext } from 'react';

export type UserData = {
  user: DBUser | null;
  profile: UserProfile | null;
};

export const SelfContext = createContext<UserData | undefined>(undefined);

export const useSelf = (): UserData => {
  const self = useContext(SelfContext);

  if (self === undefined) {
    throw new Error('useSelf must be used within a SelfProvider');
  }
  
  return { user: self.user, profile: self.profile };
};
