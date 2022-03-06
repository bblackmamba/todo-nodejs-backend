import express from 'express';
import { check } from 'express-validator';
import { UserController } from '../controllers/user.controller';
export const userRouter = express.Router();

const validationForSignup = [
  check('login').trim().escape().isLength({min: 1, max: 16}).not().isEmpty(), 
  check('name').trim().escape().isLength({min: 1, max: 16}).not().isEmpty(),
  check('password').trim().escape().isLength({min: 4, max: 16}).not().isEmpty()
];

const validationForLogin = [
  check('login').trim().escape().isLength({min: 1, max: 16}).not().isEmpty(),
  check('password').trim().escape().isLength({min: 4, max: 16}).not().isEmpty()
];

userRouter.post('/signup', validationForSignup, UserController.signUp);
userRouter.post('/login', validationForLogin, UserController.login);
