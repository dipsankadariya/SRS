import express from 'express';
import { signup, signin, setRole } from '../controllers/auth.controllers.js';
import protectRoute from '../middleware/auth.middleware.js';

const router = express.Router();

router.post('/signup', signup);
router.post('/signin', signin);
router.post('/set-role', protectRoute, setRole);

export default router;
