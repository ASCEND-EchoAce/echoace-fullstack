'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useSelf } from '@/hooks/useSelf';
import Link from 'next/link';

export default function Dashboard() {
  const { user, profile } = useSelf();
  return (
    <div className="flex flex-col gap-8">
      <h1 className="text-3xl font-bold">
        Welcome{profile ? `, ${profile.first_name} ${profile.last_name}` : ''}!
      </h1>
      {user && !user.completed_onboarding && (
        <Card>
          <CardHeader>
            <CardTitle>Complete your onboarding!</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            <p>Fill out your information to start interviewing!</p>
            <Link href="/profile">
              <Button>Fill out the form!</Button>
            </Link>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
