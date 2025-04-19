export interface Interview {
  id: number;
  created_at: string;
  user_fid: number;
  transcript: string;
  evaluation: string;
  question: string;
}

export interface User {
  id: number;
  created_at: string;
  email: string;
  completed_onboarding: boolean;
}

export interface UserProfile {
  id: number;
  created_at: string;
  first_name: string;
  last_name: string;
  user_fid: number;
}
