import express from 'express';
import { HealthController } from '../controllers/health.controller';
export const healthRouter = express.Router();

healthRouter.get('', HealthController.getHealth);
