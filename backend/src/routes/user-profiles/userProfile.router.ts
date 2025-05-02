import { Router } from 'express';
import {
  createUserProfile,
  getUserProfileByUserFid,
  updateUserProfile
} from './userProfile.handler';

const userProfileRouter = Router();
userProfileRouter.post('/', createUserProfile);
userProfileRouter.get('/:user_fid', getUserProfileByUserFid);
userProfileRouter.put('/:user_fid', updateUserProfile);

export default userProfileRouter;
