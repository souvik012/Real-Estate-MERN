import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
dotenv.config();


console.log('EMAIL_USER:', process.env.EMAIL_USER);
console.log('EMAIL_PASS:', process.env.EMAIL_PASS);


const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 587,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// 🔁 1. Send Password Reset Email
export const sendResetEmail = async (to, token) => {
  try {
    const resetLink = `${process.env.BASE_URL}/reset-password/${token}`;
    console.log("Sending password reset email to:", to);
    console.log("Reset link:", resetLink);

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to,
      subject: 'Password Reset - LandQueue',
      html: `
        <h3>Hello,</h3>
        <p>Click the link below to reset your password:</p>
        <a href="${resetLink}" target="_blank">${resetLink}</a>
        <p>This link is valid for 30 minutes only.</p>
      `,
    };

    await transporter.sendMail(mailOptions);
    console.log("✅ Password reset email sent");
  } catch (error) {
    console.error('❌ Send Reset Email Error:', error.message);
    throw error;
  }
};

// 🔁 2. Send OTP Email
export const sendOtpEmail = async (to, otp) => {
  try {
    console.log("Sending OTP email to:", to);
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to,
      subject: 'Your OTP for LandQueue Login/Signup',
      html: `
        <h3>Hello,</h3>
        <p>Your One-Time Password (OTP) is:</p>
        <h2>${otp}</h2>
        <p>This OTP is valid for 5 minutes.</p>
      `,
    };

    await transporter.sendMail(mailOptions);
    console.log("✅ OTP email sent");
  } catch (error) {
    console.error('❌ Send OTP Email Error:', error.message);
    throw error;
  }
};
