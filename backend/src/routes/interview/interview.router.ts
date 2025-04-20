import { Router } from 'express';
import {
  createInterview,
  deleteInterview,
  getInterviewById,
  getInterviewByUserFid,
  getInterviews,
  updateInterview
} from './interview.handler';

const interviewRouter = Router();

// Get all interviews
interviewRouter.get('/', getInterviews);

// Get a specific interview by ID
interviewRouter.get('/:id', getInterviewById);

// Get interviews by user_fid
interviewRouter.get('/user/:user_fid', getInterviewByUserFid);

// Create a new interview
interviewRouter.post('/', createInterview);

// Update an existing interview by ID
interviewRouter.put('/:id', updateInterview);

// Delete an interview by ID
interviewRouter.delete('/:id', deleteInterview);

export default interviewRouter;
