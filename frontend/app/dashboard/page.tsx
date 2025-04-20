'use client';

import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent
} from '@/components/ui/chart';
import { useSelf } from '@/hooks/useSelf';
import { Terminal } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';
import { AreaChart, CartesianGrid, XAxis, Area, ResponsiveContainer } from 'recharts';

const chartData = [
  { month: 'January', desktop: 18 },
  { month: 'February', desktop: 35 },
  { month: 'March', desktop: 27 },
  { month: 'April', desktop: 3 },
  { month: 'May', desktop: 29 },
  { month: 'June', desktop: 24 },
  { month: 'July', desktop: 16 },
  { month: 'August', desktop: 35 },
  { month: 'September', desktop: 27 },
  { month: 'October', desktop: 73 },
  { month: 'November', desktop: 29 },
  { month: 'December', desktop: 24 }
];

const chartConfig = {
  desktop: {
    label: 'Desktop',
    color: 'hsl(var(--chart-3))'
  }
} satisfies ChartConfig;

export default function Dashboard() {
  const [interviews, setInterviews] = useState<Interview[]>([]);
  const { user, profile } = useSelf();
  
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
        {/* <Calendar mode="single" selected={date} onSelect={setDate} className="rounded-md border" /> */}
        <Card className="w-1/4 flex items-center justify-center">
          <CardContent className="flex flex-col text-center gap-4">
            <p>You've done</p>
            <p className="text-2xl font-bold">3</p>
            <p>interviews this past year.</p>
          </CardContent>
        </Card>
        <Card className="w-3/4">
          <CardHeader>
            <CardTitle>Practice Interviews</CardTitle>
            <CardDescription>Showing total interviews for the last 12 months</CardDescription>
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
      </div>
    </div>
  );
}
