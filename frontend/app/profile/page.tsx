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

type Message = { error: string } | { success: string };

export default function profilePage() {
  const { profile } = useSelf();
  const [firstName, setFirstName] = useState(profile?.first_name || '');
  const [lastName, setLastName] = useState(profile?.last_name || '');
  const [industry, setIndustry] = useState(profile?.industry || '');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState<Message | undefined>();

  useEffect(() => {
    setFirstName(profile?.first_name || '');
    setLastName(profile?.last_name || '');
    setIndustry(profile?.industry || '');
  }, [profile]);

  const handleSubmit = async (e: React.FormEvent) => {
    setIsSubmitting(true);
    if (!firstName || !lastName || !industry) {
      setMessage({ error: 'Please fill in all fields.' });
      setIsSubmitting(false);
      return;
    }

    await UserProfileAPI.updateUserProfile({
      first_name: firstName,
      last_name: lastName,
      industry,
      user_fid: profile?.user_fid || ''
    });
    window.sessionStorage.setItem('profile', JSON.stringify(profile));
    setMessage({
      success: 'Profile updated successfully!'
    });
    setIsSubmitting(false);
  };

  return (
    <div className="flex flex-col gap-8">
      <h1 className="text-3xl font-bold">Profile</h1>
      <Card>
        <CardHeader>
          <CardTitle>Onboarding Survey</CardTitle>
          <CardDescription>
            This information will be used to analyze your responses.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>First Name</Label>
              <Input
                type="text"
                value={firstName}
                onChange={(e) => setFirstName((e.target.value as string).trim())}
              />
            </div>
            <div>
              <Label>Last Name</Label>
              <Input
                type="text"
                value={lastName}
                onChange={(e) => setLastName((e.target.value as string).trim())}
              />
            </div>
            <div>
              <Label>Industry</Label>
              <Input
                type="text"
                value={industry}
                onChange={(e) => setIndustry((e.target.value as string).trim())}
              />
            </div>
            <div className="grid w-full max-w-sm items-center gap-1.5">
              <Label htmlFor="resume">Resume</Label>
              <Input id="resume" type="file" />
            </div>
          </div>
          {message !== undefined &&
            ('error' in message ? (
              <p className="text-sm font-medium text-destructive">{message.error}</p>
            ) : (
              <p className="text-sm font-medium">{message.success}</p>
            ))}
        </CardContent>
        <CardFooter>
          <Button type="submit" disabled={isSubmitting} onClick={handleSubmit}>
            Submit
          </Button>
        </CardFooter>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Privacy Settings</CardTitle>
          <CardDescription>Your privacy information.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-4">
            <Label>Delete your data.</Label>
            <Button variant="destructive" className="w-min">
              Delete
            </Button>
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Membership</CardTitle>
          <CardDescription>Your membership information.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-4">
            <Label>Membership</Label>
            <Link href="/membership">
              <Button variant="outline" className="w-min">
                Manage
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
