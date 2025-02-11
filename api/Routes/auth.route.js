import express from 'express';
import { google, signin, signup } from '../Controllers/auth.controller.js';

const router = express.Router();

router.post("/SignUp",signup)

// localhost:3000/api/auth/signin
router.post('/google',google)
router.post("/signin", signin)

export default router;