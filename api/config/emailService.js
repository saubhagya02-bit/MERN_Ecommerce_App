import nodemailer from "nodemailer";

const createTransporter = () =>
  nodemailer.createTransport({
    service: "gmail",
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
    <head>
      <meta charset="utf-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    </head>
    <body style="margin:0;padding:0;background:#FAF8F5;font-family:'DM Sans',Arial,sans-serif;">
      <table width="100%" cellpadding="0" cellspacing="0"
        style="background:#FAF8F5;padding:40px 20px;">
        <tr>
          <td align="center">
            <table width="500" cellpadding="0" cellspacing="0"
              style="background:#ffffff;border-radius:16px;
                     border:1px solid #E8E2D9;overflow:hidden;
                     box-shadow:0 4px 24px rgba(28,25,23,.08);">

              <!-- Header -->
              <tr>
                <td style="background:#C2410C;padding:32px 40px;text-align:center;">
                  <h1 style="margin:0;color:#ffffff;font-size:24px;
                             font-weight:700;letter-spacing:-.02em;">
                    EliteMart
                  </h1>
                  <p style="margin:6px 0 0;color:rgba(255,255,255,.8);font-size:13px;">
                    Password Reset Request
                  </p>
                </td>
              </tr>

              <!-- Body -->
              <tr>
                <td style="padding:40px;">
                  <p style="margin:0 0 16px;font-size:16px;color:#1C1917;font-weight:600;">
                    Hi ${name},
                  </p>
                  <p style="margin:0 0 24px;font-size:14px;color:#78716C;line-height:1.7;">
                    We received a request to reset your EliteMart password.
                    Click the button below to create a new password.
                    This link expires in <strong style="color:#1C1917;">1 hour</strong>.
                  </p>

                  <!-- CTA Button -->
                  <table width="100%" cellpadding="0" cellspacing="0">
                    <tr>
                      <td align="center" style="padding:8px 0 32px;">
                        <a href="${resetUrl}"
                          style="display:inline-block;background:#C2410C;color:#ffffff;
                                 text-decoration:none;padding:14px 36px;border-radius:10px;
                                 font-size:15px;font-weight:600;letter-spacing:.01em;">
                          Reset My Password
                        </a>
                      </td>
                    </tr>
                  </table>

                  <!-- Fallback URL -->
                  <div style="background:#FAF8F5;border-radius:8px;padding:16px;
                              border:1px solid #E8E2D9;margin-bottom:24px;">
                    <p style="margin:0 0 6px;font-size:12px;color:#78716C;font-weight:600;
                               text-transform:uppercase;letter-spacing:.06em;">
                      Or copy this link
                    </p>
                    <p style="margin:0;font-size:12px;color:#C2410C;
                               word-break:break-all;font-family:monospace;">
                      ${resetUrl}
                    </p>
                  </div>

                  <p style="margin:0;font-size:13px;color:#A8A29E;line-height:1.6;">
                    If you didn't request a password reset, you can safely ignore this email.
                    Your password will remain unchanged.
                  </p>
                </td>
              </tr>

              <!-- Footer -->
              <tr>
                <td style="background:#F2EFE9;padding:20px 40px;
                           border-top:1px solid #E8E2D9;text-align:center;">
                  <p style="margin:0;font-size:12px;color:#A8A29E;">
                    © ${new Date().getFullYear()} EliteMart. All rights reserved.
                  </p>
                </td>
              </tr>

            </table>
          </td>
        </tr>
      </table>
    </body>
    </html>
  `;

  const transporter = createTransporter();
  await transporter.sendMail({
    from: `"EliteMart" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: "Reset your EliteMart password",
    html,
  });
};
