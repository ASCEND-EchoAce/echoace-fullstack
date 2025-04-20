import { Router } from 'express';
import { createUser, getUserById, updateUser } from './user.handler';

const userRouter = Router();

// Create a new user
userRouter.post('/', createUser);

// Get a user by ID
userRouter.get('/:id', getUserById);

// Update a user by ID
userRouter.put('/:id', updateUser);

export default userRouter;
