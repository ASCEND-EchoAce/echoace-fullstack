import { Request, Response } from 'express';
import { supabase } from '../../supabase';

// Create a new user profile
export const createUserProfile = async (req: Request, res: Response) => {
  const { user_fid, first_name, last_name } = req.body;

  try {
    const { data, error } = await supabase
      .from('user-profiles')
      .insert([{ user_fid, first_name, last_name }])
      .select()
      .single();

    if (error) throw error;

    res.status(201).json(data);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

// Get a user profile by user_fid
export const getUserProfileByUserFid = async (req: Request, res: Response) => {
  const { user_fid } = req.params;

  try {
    const { data, error } = await supabase
      .from('user-profiles')
      .select('*')
      .eq('user_fid', user_fid)
      .single();

    if (error) throw error;

    res.status(200).json(data);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const updateUserProfile = async (req: Request, res: Response) => {
  const { user_fid } = req.params;
  const { first_name, last_name, industry } = req.body;

  try {
    const { data, error } = await supabase
      .from('user-profiles')
      .update({ first_name, last_name, industry })
      .eq('user_fid', user_fid)
      .select()
      .single();

    await supabase.from('users').update({ completed_onboarding: true }).eq('id', user_fid);

    if (error) throw error;

    res.status(200).json(data);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};
