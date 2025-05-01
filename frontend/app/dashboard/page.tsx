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
import { useState, useEffect } from 'react';
import { AreaChart, CartesianGrid, XAxis, Area, ResponsiveContainer } from 'recharts';
import { User } from '@supabase/supabase-js';
import { interviewAPI } from '@/api/interviewAPI';

const months = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

const chartConfig = {
  desktop: {
    label: 'Interviews',
    color: 'hsl(var(--chart-3))'
  }
} satisfies ChartConfig;

export default function Dashboard() {
  const { user } = useSelf();
  const [interviews, setInterviews] = useState<Interview[]>([]);
  const [chartData, setChartData] = useState<{ month: string; desktop: number }[]>([]);
  
  useEffect(() => {
    if (user?.id) {
      interviewAPI.getInterview(user.id).then((interviews) => {
        setInterviews(interviews);
        
        // Initialize chart data with all months set to 0
        const initialChartData = months.map(month => ({ month, desktop: 0 }));
        
        // Count interviews by month
        interviews.forEach(interview => {
          const date = new Date(interview.created_at);
          const monthIndex = date.getMonth();
          initialChartData[monthIndex].desktop += 1;
        });
        
        setChartData(initialChartData);
      });
    }
  }, [user?.id]);
  
  console.log('Dashboard - Context values:', { user });
  
  return (
    <div className="flex flex-col gap-8">
      <h1 className="text-3xl font-bold">
        {user ? `Welcome, ${user.email}` : 'You are not logged in'}
      </h1>
      <div className="flex flex-row gap-8">
        {/* <Calendar mode="single" selected={date} onSelect={setDate} className="rounded-md border" /> */}
        <Card className="w-1/4 flex items-center justify-center">
          <CardContent className="flex flex-col text-center gap-4">
            <p>You've done</p>
            <p className="text-2xl font-bold">{interviews.length}</p>
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
