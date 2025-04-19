import { Request, Response } from 'express';
import { supabase } from '../../supabase';

// Create a new interview
export const createInterview = async (req: Request, res: Response) => {
  const { user_fid, transcript, evaluation, question } = req.body;

  try {
    const { data, error } = await supabase
      .from('interviews')
      .insert([{ user_fid, transcript, evaluation, question }])
      .select()
      .single();

    if (error) throw error;

    res.status(201).json(data);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

// Get all interviews
export const getInterviews = async (_req: Request, res: Response) => {
  try {
    const { data, error } = await supabase.from('interviews').select('*');

    if (error) throw error;

    res.status(200).json(data);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

// Get a single interview by ID
export const getInterviewById = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const { data, error } = await supabase.from('interviews').select('*').eq('id', id).single();

    if (error) throw error;

    res.status(200).json(data);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

// Update an interview by ID
export const updateInterview = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { title, date, participants } = req.body;

  try {
    const { data, error } = await supabase
      .from('interviews')
      .update({ title, date, participants })
      .eq('id', id);

    if (error) throw error;

    res.status(200).json(data);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

// Delete an interview by ID
export const deleteInterview = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const { data, error } = await supabase.from('interviews').delete().eq('id', id);

    if (error) throw error;

    res.status(200).json(data);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};
