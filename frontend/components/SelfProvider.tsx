'use client';

import { ReactNode } from 'react';
import { SelfContext, SelfContextType } from '@/hooks/useSelf';

type SelfProviderProps = {
  value: SelfContextType;
  children: ReactNode;
};

export function SelfProvider({ value, children }: SelfProviderProps) {
  return (
    <SelfContext.Provider value={value}>
      {children}
    </SelfContext.Provider>
  );
}
