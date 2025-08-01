import express from 'express';
import crypto from 'crypto';
import bcryptjs from 'bcryptjs';
import User from '../Models/user.model.js';
import { google, signin, signup } from '../Controllers/auth.controller.js';
import { sendResetEmail, sendOtpEmail } from '../Utils/sendEmail.js';
import { otpMap } from '../Utils/otpStore.js';

const router = express.Router();

// Token and OTP storage (in-memory)
const tokenMap = new Map(); // reset-password tokens
//const otpMap = new Map();   // email => { otp, expires }

// 🔐 EXISTING AUTH ROUTES
router.post("/signup", signup);
router.post("/signin", signin);
router.post("/google", google);

// 🔁 FORGOT PASSWORD: Send reset link
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

    await sendResetEmail(email, token);
    res.status(200).json({ message: 'Password reset link sent to your email.' });
  } catch (error) {
    console.error('Forgot Password Error:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
});

// 🔁 RESET PASSWORD: Validate token
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
    console.error('Reset Password Error:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
});

// ✅ OTP GENERATION ROUTE
router.post('/generate-otp', async (req, res) => {
  try {
    const { email } = req.body;
    const otp = Math.floor(100000 + Math.random() * 900000); // 6-digit OTP

    otpMap.set(email, {
      otp,
      expires: Date.now() + 5 * 60 * 1000, // 5 minutes
    });

    await sendOtpEmail(email, otp);
    res.status(200).json({ message: 'OTP sent to email.' });
  } catch (error) {
    console.error('Generate OTP Error:', error.message);
    res.status(500).json({ message: 'Failed to send OTP' });
  }
});

// ✅ OTP VERIFICATION ROUTE
router.post('/verify-otp', async (req, res) => {
  try {
    const { email, otp } = req.body;
    const data = otpMap.get(email);

    if (!data || data.otp !== parseInt(otp) || Date.now() > data.expires) {
      return res.status(400).json({ message: 'Invalid or expired OTP' });
    }

    // Mark this email as verified
    otpMap.set(email, { ...data, verified: true });

    res.status(200).json({ message: 'OTP verified successfully' });
  } catch (error) {
    console.error('Verify OTP Error:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
});


export default router;
