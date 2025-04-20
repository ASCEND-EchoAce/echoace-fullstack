interface Interview {
  id: number;
  created_at: string;
  user_fid: string;
  transcript: string;
  evaluation: string;
  question: string;
}

interface DBUser {
  id: string;
  created_at: string;
  email: string;
  completed_onboarding: boolean;
}

interface UserProfile {
  id: number;
  created_at: string;
  first_name: string;
  last_name: string;
  industry: string;
  user_fid: string;
}
