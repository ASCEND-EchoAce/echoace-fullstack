interface Interview {
  id: number;
  created_at: string;
  user_fid: number;
  transcript: string;
  evaluation: string;
  question: string;
}

interface User {
  id: number;
  created_at: string;
  email: string;
  completed_onboarding: boolean;
}

interface UserProfile {
  id: number;
  created_at: string;
  first_name: string;
  last_name: string;
  user_fid: number;
}
