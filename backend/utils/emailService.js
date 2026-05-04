import nodemailer from 'nodemailer';

// Create transporter using Gmail SMTP
const createTransporter = () => {
    return nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
        },
    });
};

/**
 * Send an email notification
 * @param {string} to - Recipient email address
 * @param {string} subject - Email subject
 * @param {string} html - HTML body content
 */
export const sendEmail = async ({ to, subject, html }) => {
    // Skip if email credentials are not configured
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
        console.warn('⚠️  Email not configured — skipping email notification.');
        return;
    }

    try {
        const transporter = createTransporter();
        const info = await transporter.sendMail({
            from: `"Smart Campus 🎓" <${process.env.EMAIL_USER}>`,
            to,
            subject,
            html,
        });
        console.log(`✉️  Email sent to ${to}: ${info.messageId}`);
    } catch (error) {
        // Log error but don't crash the server — email failures shouldn't block auth
        console.error('❌ Email send failed:', error.message);
    }
};

// ─── Email Templates ──────────────────────────────────────────────────────────

export const welcomeEmailTemplate = (name) => `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8" />
  <style>
    body { font-family: 'Segoe UI', sans-serif; background: #0f172a; color: #e2e8f0; margin: 0; padding: 0; }
    .container { max-width: 560px; margin: 40px auto; background: #1e293b; border-radius: 16px; overflow: hidden; border: 1px solid rgba(99,102,241,0.3); }
    .header { background: linear-gradient(135deg, #6366f1, #8b5cf6); padding: 36px 32px; text-align: center; }
    .header h1 { margin: 0; font-size: 24px; font-weight: 700; color: #fff; }
    .header p  { margin: 8px 0 0; color: rgba(255,255,255,0.75); font-size: 14px; }
    .body { padding: 32px; }
    .body h2 { color: #a5b4fc; margin-top: 0; font-size: 20px; }
    .body p  { color: #94a3b8; line-height: 1.7; }
    .badge { display: inline-block; background: rgba(16,185,129,0.15); color: #34d399; border: 1px solid rgba(16,185,129,0.3); padding: 4px 14px; border-radius: 999px; font-size: 12px; font-weight: 600; margin-bottom: 20px; }
    .cta { display: block; margin: 24px auto 0; width: fit-content; background: linear-gradient(135deg, #6366f1, #8b5cf6); color: #fff; text-decoration: none; padding: 12px 28px; border-radius: 10px; font-weight: 600; font-size: 14px; }
    .footer { text-align: center; padding: 20px; color: #475569; font-size: 12px; border-top: 1px solid rgba(255,255,255,0.06); }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>🎓 Smart Campus</h1>
      <p>Issue Reporting System</p>
    </div>
    <div class="body">
      <span class="badge">✅ Account Created</span>
      <h2>Welcome, ${name}!</h2>
      <p>Your account has been successfully created on the <strong>Smart Campus Issue Reporting System</strong>. You can now report campus issues, track their status, and help keep our campus running smoothly.</p>
      <p>Log in anytime at <strong>http://localhost:5173</strong> to get started.</p>
      <a class="cta" href="http://localhost:5173">Go to Dashboard →</a>
    </div>
    <div class="footer">Smart Campus · Issue Reporting System · 2026</div>
  </div>
</body>
</html>
`;

export const loginAlertEmailTemplate = (name, timestamp) => `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8" />
  <style>
    body { font-family: 'Segoe UI', sans-serif; background: #0f172a; color: #e2e8f0; margin: 0; padding: 0; }
    .container { max-width: 560px; margin: 40px auto; background: #1e293b; border-radius: 16px; overflow: hidden; border: 1px solid rgba(99,102,241,0.3); }
    .header { background: linear-gradient(135deg, #0ea5e9, #6366f1); padding: 36px 32px; text-align: center; }
    .header h1 { margin: 0; font-size: 24px; font-weight: 700; color: #fff; }
    .header p  { margin: 8px 0 0; color: rgba(255,255,255,0.75); font-size: 14px; }
    .body { padding: 32px; }
    .body h2 { color: #a5b4fc; margin-top: 0; font-size: 20px; }
    .body p  { color: #94a3b8; line-height: 1.7; }
    .badge { display: inline-block; background: rgba(14,165,233,0.15); color: #38bdf8; border: 1px solid rgba(14,165,233,0.3); padding: 4px 14px; border-radius: 999px; font-size: 12px; font-weight: 600; margin-bottom: 20px; }
    .info-box { background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.08); border-radius: 10px; padding: 16px 20px; margin: 20px 0; }
    .info-box p { margin: 4px 0; font-size: 13px; color: #94a3b8; }
    .info-box strong { color: #e2e8f0; }
    .warning { color: #fbbf24; font-size: 13px; margin-top: 20px; }
    .footer { text-align: center; padding: 20px; color: #475569; font-size: 12px; border-top: 1px solid rgba(255,255,255,0.06); }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>🎓 Smart Campus</h1>
      <p>Security Notification</p>
    </div>
    <div class="body">
      <span class="badge">🔐 New Login Detected</span>
      <h2>Hello, ${name}!</h2>
      <p>We noticed a new sign-in to your Smart Campus account. Here are the details:</p>
      <div class="info-box">
        <p><strong>Account:</strong> ${name}</p>
        <p><strong>Time:</strong> ${timestamp}</p>
        <p><strong>System:</strong> Smart Campus Issue Reporting System</p>
      </div>
      <p class="warning">⚠️ If this wasn't you, please change your password immediately and contact the campus admin.</p>
    </div>
    <div class="footer">Smart Campus · Issue Reporting System · 2026</div>
  </div>
</body>
</html>
`;
