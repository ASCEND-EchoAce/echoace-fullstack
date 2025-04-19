import { Request, Response } from 'express';
import { supabase } from '../../supabase';

export const createUser = async (req: Request, res: Response) => {
  const { email } = req.body;

  try {
    const { data, error } = await supabase
      .from('users')
      .insert([{ email, completed_onboarding: false }])
      .select()
      .single();

    if (error) throw error;

    res.status(201).json(data);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const getUserById = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const { data, error } = await supabase.from('users').select('*').eq('id', id).single();

    if (error) throw error;

    res.status(200).json(data);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const updateUser = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { completed_onboarding } = req.body;

  try {
    const { data, error } = await supabase
      .from('users')
      .update({ completed_onboarding })
      .eq('id', id)
      .single();

    if (error) throw error;

    res.status(200).json(data);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};
