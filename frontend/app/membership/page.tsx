'use client';

import { Button } from '@/components/ui/button';
import { useSelf } from '@/hooks/useSelf';
import { Input } from '@/components/ui/input';
import { useEffect, useState } from 'react';
import { Label } from '@/components/ui/label';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter
} from '@/components/ui/card';
import { UserProfileAPI } from '@/api/userProfileAPI';
import Link from 'next/link';
import { BadgeCheck, Circle, CircleCheck, Wallet, CircleX} from 'lucide-react';

type Message = { error: string } | { success: string };

export default function membershipPage() {
const [membershipStatus, setMembershipStatus] = useState<"general" | "terminaing">("general");
let content;

if (membershipStatus === "general") {
  content = (
    <div className="flex flex-col gap-8 mt-4">
      <h1 className="text-3xl font-bold">Membership Details</h1>
      <Card className='flex flex-row justify-between' >
        <div>
            <CardHeader>
                <CardTitle className="flex flex-row gap-2 items-center"><BadgeCheck className="w-10 h-10" />Free</CardTitle>
                <CardDescription>Current Plan: Free</CardDescription>
            </CardHeader>
            <CardContent>
            <p>
                You are currently on the free plan.
            </p>
            </CardContent>
        </div>
        <CardContent className="flex items-center justify-center">
            <Button variant="outline" className="w-min" onClick={() => {
                setMembershipStatus("terminaing");
              }}>
                Upgrade membership
            </Button>
        </CardContent>
      </Card>
      <Card className='flex flex-row justify-between'>
        <CardHeader>
            <CardTitle className="flex flex-row gap-2 items-center"><Wallet className="w-10 h-10" />Payment Method</CardTitle>
            <CardDescription>Credit Card</CardDescription>
        </CardHeader>
        <CardContent className='flex items-center justify-center'>
            <Button variant="outline" className="w-min" >
                Change
            </Button>
        </CardContent>
      </Card>
      <h1 className='text-3xl font-bold'>Manage Membership</h1>
      <Card className='flex flex-row justify-between'>
        <CardHeader>
            <CardTitle>Terminating Membership</CardTitle>
            <CardDescription>Are you sure you want to terminate your membership?</CardDescription>
        </CardHeader>
        <CardContent className='flex items-center justify-center'>
            <Button variant="outline" className="w-min" onClick={() => {
                setMembershipStatus("general");
              }}>
                <CircleX className="w-4 h-4" />
                End Membership
            </Button>
        </CardContent>
        </Card>
    </div>
   )
} else if (membershipStatus === "terminaing") {
  content = (
    <div>
      <div className='text-2xl font-semibold text-center mt-4'>
        Explore Plans
      </div>
      <div className="flex flex-row gap-4 justify-center mt-8"> 
        <Card>
            <CardHeader>
                <CardTitle className="font-medium">Free</CardTitle>
                <CardDescription>Try EchoAce</CardDescription>
            </CardHeader>
            <CardContent >
                <div className="grid grid-cols-[20px_1fr] gap-x-3 gap-y-2 items-center">
                    <CircleCheck className="w-4 h-4" />
                    <div>Interview on the Web</div>
                    <CircleCheck className="w-4 h-4" />
                    <div>Generate Interviews</div>
                    <CircleCheck className="w-4 h-4" />
                    <div>Limited to 2 Interviews a day</div>
                </div>
                <div className="font-semibold mt-4 text-lg">$0</div>
                <CardDescription>Free for every user</CardDescription>
            </CardContent>
        </Card>
       
        <Card>
            <CardHeader>
                <CardTitle className="font-medium">Pro</CardTitle>
                <CardDescription>For the serious interviewer</CardDescription>
            </CardHeader>

            <CardContent >
                <p className="mb-2">Everything in Free, but more:</p>
                <div className="grid grid-cols-[20px_1fr] gap-x-3 gap-y-2 items-center">
                    <CircleCheck className="w-4 h-4" />
                    <div>10 Interviews a day</div>
                    <CircleCheck className="w-4 h-4" />
                    <div>Limited Access to STEVE's Chat room</div>
                    <CircleCheck className="w-4 h-4" />
                    <div>Resume Review</div>
                </div>
                <div className="font-semibold mt-4 text-lg">$10</div>
                <CardDescription>Billed monthly</CardDescription>
            </CardContent>
        </Card>
        <Card>
            <CardHeader>
                <CardTitle className="font-medium">Max</CardTitle>
                <CardDescription>10x more efficient than Pro</CardDescription>
            </CardHeader>
            <CardContent >
                <p>Everything in Pro, but more:</p>
                <div className="grid grid-cols-[20px_1fr] gap-x-3 gap-y-2 items-center">
                    <CircleCheck className="w-4 h-4" />
                    <div>Unlimited Interviews</div>
                    <CircleCheck className="w-4 h-4" />
                    <div>Full Access to STEVE's Chat room</div>
                    <CircleCheck className="w-4 h-4" />
                    <div>Early Access to SMARTA</div>
                </div>
                <div className="font-semibold mt-4 text-lg">$25</div>
                <CardDescription>Billed monthly</CardDescription>
            </CardContent>
        </Card>
      </div>
      <p className='text-center mt-4 text-sm text-muted-foreground'>Prices shown do not include applicable tax.</p>
    </div>
  )
}
return content;
} 