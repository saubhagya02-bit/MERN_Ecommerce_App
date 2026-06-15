import dotenv from "dotenv";
dotenv.config();

import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export const sendPasswordResetEmail = async (email, name, resetToken) => {
  const resetUrl = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;

  await resend.emails.send({
    from: "onboarding@resend.dev",
    to: email,
    subject: "Reset your EliteMart password",
    html: `
      <h2>Hello ${name}</h2>

      <p>Click the link below to reset your password:</p>

      <a href="${resetUrl}">
        Reset Password
      </a>

      <p>This link expires in 1 hour.</p>
    `,
  });
};
