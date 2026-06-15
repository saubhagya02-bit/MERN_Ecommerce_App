import nodemailer from "nodemailer";

// Create ONE reusable transporter
const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  requireTLS: true,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// Send password reset email
export const sendPasswordResetEmail = async (email, name, resetToken) => {
  const resetUrl = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;

  const html = `
    <!DOCTYPE html>
    <html>
    <body>
      <h2>Hi ${name}</h2>
      <p>Click below to reset your password:</p>
      <a href="${resetUrl}">Reset Password</a>
      <p>This link expires in 1 hour.</p>
    </body>
    </html>
  `;

  await transporter.sendMail({
    from: `"EliteMart" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: "Reset your EliteMart password",
    html,
  });

  console.log("✅ Reset email sent to:", email);
};
