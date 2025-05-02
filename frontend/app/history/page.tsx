'use client';

import { interviewAPI } from '@/api/interviewAPI';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { useSelf } from '@/hooks/useSelf';
import { useEffect, useState } from 'react';

export default function HistoryPage() {
  const [interviews, setInterviews] = useState<Interview[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useSelf();

  useEffect(() => {
    if (!user) return;
    interviewAPI.getInterview(user.id || '').then((interviews) => setInterviews(interviews));
    setLoading(false);
  }, [user]);

  if (loading) {
    return (
      <>
        <Skeleton className="h-36 w-full" />
        <Skeleton className="h-36 w-full" />
      </>
    );
  }

  return (
    <div className="flex flex-col gap-8">
      <h1 className="text-3xl font-bold">History</h1>
      {interviews.map((interview) => {
        const date = new Date(interview.created_at);
        return (
          <Card key={interview.id}>
            <CardHeader>
              <CardTitle>{interview.question}</CardTitle>
              <CardDescription>{date.toDateString()}</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col gap-2">
              <p className="line-clamp-2">
                <strong>Transcription: </strong> {interview.transcript}
              </p>
              <p className="line-clamp-2">
                <strong>Evaluation: </strong> {interview.evaluation}
              </p>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
