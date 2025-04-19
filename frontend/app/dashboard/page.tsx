'use client';

import { UserAPI } from '@/api/userAPI';
import { Card } from '@/components/ui/card';
import { useSelf } from '@/hooks/useSelf';
import { useEffect, useState } from 'react';

export default function Dashboard() {
  const [user, setUser] = useState<User | undefined>();
  const self = useSelf();

  useEffect(() => {
    UserAPI.getUser(self.id).then((data) => setUser(data.data));
  }, []);

  return (
    <div className='h-96'>
      <Card></Card>
    </div>
  );
}
