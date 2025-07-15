import nodemailer from 'nodemailer';

export const sendResetEmail = async (to, token) => {
  try {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const resetLink = `${process.env.BASE_URL}/reset-password/${token}`;
    console.log("Sending email to:", to);
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
    console.log("✅ Email sent successfully");
  } catch (error) {
    console.error('Send Email Error:', error.message); // ✅ log error
    throw error;
  }
};
