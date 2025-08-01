import User from '../Models/user.model.js';
import bcryptjs from 'bcryptjs';
import { errHandler } from '../Utils/error.js';
import jwt from 'jsonwebtoken';
import { otpMap } from '../Utils/otpStore.js'; // ✅ Shared Map

// 📤 SIGNUP CONTROLLER


export const signup = async (req, res, next) => {
  try {
    console.log('📨 Received signup request body:', req.body);


    const { username, email, password, otp } = req.body;
    console.log('📥 Signup Request Body:', req.body);

    // 🔍 Check OTP
    const storedOtpData = otpMap.get(email);
    console.log('📦 Stored OTP Data:', storedOtpData);

    if (!storedOtpData) {
      return res.status(400).json({ message: 'No OTP found. Please request OTP again.' });
    }

    // Optional: Check expiry
    if (Date.now() > storedOtpData.expiresAt) {
      otpMap.delete(email);
      return res.status(400).json({ message: 'OTP expired. Please request a new one.' });
    }

    console.log('🔐 Comparing OTPs...');
    console.log('✅ Entered OTP:', otp);
    console.log('✅ Stored OTP:', storedOtpData.otp);

    if (storedOtpData.otp !== otp) {
      return res.status(400).json({ message: 'Email not verified with OTP' });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Hash password & create user
    const hashedPassword = bcryptjs.hashSync(password, 10);
    const newUser = new User({ username, email, password: hashedPassword });
    await newUser.save();

    console.log('✅ User registered successfully');
    otpMap.delete(email); // clear OTP after signup

    return res.status(201).json({ message: 'User created successfully' });
  } catch (error) {
    console.error('❌ Signup Error:', error.message);
    next(error);
  }
};

// 🔑 SIGNIN CONTROLLER
export const signin = async (req, res, next) => {
  const { email, password } = req.body;

  // Optional OTP check for signin (if required)
  const otpData = otpMap.get(email);
  if (otpData && !otpData.verified) {
    return next(errHandler(403, 'Email not verified with OTP'));
  }

  try {
    const validUser = await User.findOne({ email });
    if (!validUser) return next(errHandler(404, 'User not found'));

    const validPassword = bcryptjs.compareSync(password, validUser.password);
    if (!validPassword) return next(errHandler(401, 'Wrong password!'));

    const token = jwt.sign({ id: validUser._id }, process.env.JWT_SECRET);
    const { password: pass, ...rest } = validUser._doc;

    res
      .cookie('access_token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: process.env.NODE_ENV === 'production' ? 'None' : 'Lax',
      })
      .status(200)
      .json(rest);
  } catch (error) {
    next(error);
  }
};

// 🔒 GOOGLE CONTROLLER
export const google = async (req, res, next) => {
  try {
    let user = await User.findOne({ email: req.body.email });

    if (user) {
      const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
      const { password: pass, ...rest } = user._doc;

      return res
        .cookie('access_token', token, {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          sameSite: process.env.NODE_ENV === 'production' ? 'None' : 'Lax',
        })
        .status(200)
        .json(rest);
    }

    const generatedPassword = Math.random().toString(36).slice(-8) + Math.random().toString(36).slice(-8);
    const hashedPassword = bcryptjs.hashSync(generatedPassword, 10);

    const newUser = new User({
      username: req.body.name.split(' ').join('').toLowerCase() + Math.random().toString(36).slice(-4),
      email: req.body.email,
      password: hashedPassword,
      avatar: req.body.photo,
    });

    await newUser.save();

    const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET);
    const { password: pass, ...rest } = newUser._doc;

    return res
      .cookie('access_token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: process.env.NODE_ENV === 'production' ? 'None' : 'Lax',
      })
      .status(200)
      .json(rest);
  } catch (error) {
    next(error);
  }
};
