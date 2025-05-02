'use client';

import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent
} from '@/components/ui/chart';
import { useSelf } from '@/hooks/useSelf';
import { useState, useEffect } from 'react';
import { AreaChart, CartesianGrid, XAxis, Area, ResponsiveContainer } from 'recharts';
import { interviewAPI } from '@/api/interviewAPI';
import Link from 'next/link';
import { ArrowRight, Terminal } from 'lucide-react';
import { Calendar } from '@/components/ui/calendar';

const months = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December'
];

const chartConfig = {
  desktop: {
    label: 'Interviews',
    color: 'hsl(var(--chart-3))'
  }
} satisfies ChartConfig;

export default function Dashboard() {
  const { user, profile } = useSelf();
  const [interviews, setInterviews] = useState<Interview[]>([]);
  const [chartData, setChartData] = useState<{ month: string; desktop: number }[]>([]);
  const [dates, setDates] = useState<Date[]>([]);

  useEffect(() => {
    if (user?.id) {
      interviewAPI.getInterview(user.id).then((interviews) => {
        setInterviews(
          interviews.sort(
            (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
          )
        );

        // Initialize chart data with all months set to 0
        const initialChartData = months.map((month) => ({ month, desktop: 0 }));

        // Count interviews by month
        interviews.forEach((interview) => {
          const date = new Date(interview.created_at);
          setDates((prev) => [...prev, date]);
          const monthIndex = date.getMonth();
          initialChartData[monthIndex].desktop += 1;
        });

        setChartData(initialChartData);
      });
    }
  }, [user?.id]);

  return (
    <div className="flex flex-col gap-8">
      <h1 className="text-3xl font-bold">
        Welcome{profile ? `, ${profile.first_name} ${profile.last_name}` : ''}!
      </h1>
      {user && !user.completed_onboarding && (
        <Alert>
          <Terminal className="h-4 w-4" />
          <AlertTitle className="mb-4">Heads up!</AlertTitle>
          <AlertDescription className="flex flex-col gap-2">
            <p>Before you start interviewing, make sure to fill out the onboarding form.</p>
            <Link href="/profile">
              <Button>Fill out the form</Button>
            </Link>
          </AlertDescription>
        </Alert>
      )}
      <div className="flex flex-row gap-8">
        <Card className="w-full">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Practice Interviews</CardTitle>
              <CardDescription>Showing total interviews for the last 12 months</CardDescription>
            </div>
            <Button>
              Start Interviewing
              <ArrowRight />
            </Button>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={200}>
              <ChartContainer config={chartConfig}>
                <AreaChart
                  accessibilityLayer
                  data={chartData}
                  margin={{
                    left: 12,
                    right: 12
                  }}
                  height={200}
                >
                  <CartesianGrid vertical={false} />
                  <XAxis
                    dataKey="month"
                    tickLine={false}
                    axisLine={false}
                    tickMargin={8}
                    tickFormatter={(value) => value.slice(0, 3)}
                  />
                  <ChartTooltip
                    cursor={false}
                    content={<ChartTooltipContent indicator="dot" hideLabel />}
                  />
                  <Area
                    dataKey="desktop"
                    type="linear"
                    fill="var(--color-desktop)"
                    fillOpacity={0.4}
                    stroke="var(--color-desktop)"
                  />
                </AreaChart>
              </ChartContainer>
            </ResponsiveContainer>
          </CardContent>
        </Card>
        <Calendar mode="multiple" selected={dates} className="rounded-md border" />
      </div>
      <div className="flex flex-row gap-8">
        <Card className="flex flex-col">
          <CardHeader>
            <CardTitle>Past Interviews</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            {interviews.map((interview, i) => {
              if (i > 2) return <></>;
              return (
                <div
                  className={`flex flex-row gap-4 p-4 ${i % 2 === 0 ? 'bg-stone-50' : ''}`}
                  key={interview.id}
                >
                  <div className="w-10/12 gap-2 flex flex-col">
                    <p className="text-lg font-semibold">{interview.question}</p>
                    <p className="line-clamp-2">{interview.evaluation}</p>
                  </div>
                  <p className="w-2/12 text-right text-stone-400">
                    {new Date(interview.created_at).toDateString()}
                  </p>
                </div>
              );
            })}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
