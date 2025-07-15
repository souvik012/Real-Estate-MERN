import express from 'express';
import { google, signin, signup } from '../Controllers/auth.controller.js';
import { sendResetEmail } from '../Utils/sendEmail.js';
import crypto from 'crypto';
import bcryptjs from 'bcryptjs';
import User from '../Models/user.model.js'; // adjust path if needed

const router = express.Router();
const tokenMap = new Map(); // In-memory token store

// EXISTING AUTH ROUTES
router.post("/signup", signup);
router.post("/signin", signin);
router.post("/google", google);

// ✅ FORGOT PASSWORD: Generate token and send email
router.post('/forgot-password', async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: 'User not found' });

    const token = crypto.randomBytes(32).toString('hex');
    tokenMap.set(token, {
      userId: user._id,
      expires: Date.now() + 30 * 60 * 1000, // ⏰ 30 minutes
    });

    console.log("Reset token generated:", token);
    console.log("Email sent to:", email);

    await sendResetEmail(email, token);
    res.status(200).json({ message: 'Password reset link sent to your email.' });

  } catch (error) {
    console.error('Forgot Password Error:', error.message);  // ✅ log error
    res.status(500).json({ message: 'Server error' });
  }
});

// ✅ RESET PASSWORD: Validate token and update password
router.post('/reset-password/:token', async (req, res) => {
  try {
    const { token } = req.params;
    const { password } = req.body;

    const tokenData = tokenMap.get(token);
    if (!tokenData || Date.now() > tokenData.expires) {
      return res.status(400).json({ message: 'Invalid or expired token' });
    }

    const hashedPassword = bcryptjs.hashSync(password, 10);
    await User.findByIdAndUpdate(tokenData.userId, { password: hashedPassword });
    tokenMap.delete(token);

    res.status(200).json({ message: 'Password reset successfully' });
  } catch (error) {
    console.error('Reset Password Error:', error.message);  // ✅ log error
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;
