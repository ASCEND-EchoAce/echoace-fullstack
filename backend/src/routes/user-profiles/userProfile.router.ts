import { Router } from 'express';
import { createUserProfile, getUserProfileByUserFid } from './userProfile.handler';

const userProfileRouter = Router();

userProfileRouter.post('/', createUserProfile);
userProfileRouter.get('/:user_fid', getUserProfileByUserFid);

export default userProfileRouter;
