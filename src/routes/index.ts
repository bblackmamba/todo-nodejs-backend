import express from 'express';
export const router = express.Router();
import { todoRouter } from './todo.routes';
import { healthRouter } from './health.routes';
import { userRouter } from './user.routes';

router.use('/health', healthRouter)
router.use('/todo', todoRouter)
router.use('/user', userRouter);
