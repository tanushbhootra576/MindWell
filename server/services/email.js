const nodemailer = require("nodemailer");

/**
 * ======================================
 * EMAIL TRANSPORTER (GMAIL – PORT 587)
 * ======================================
 */
const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false, // use STARTTLS
  auth: {
    user: process.env.EMAIL_USER, // example: yourname@gmail.com
    pass: process.env.EMAIL_PASS, // 16-char Gmail App Password
  },
});

// Optional but VERY useful for debugging
transporter.verify((error) => {
  if (error) {
    console.error("[ERROR] SMTP ERROR:", error);
  } else {
    console.log("[OK] SMTP SERVER READY");
  }
});

/**
 * ======================================
 * BASE EMAIL TEMPLATE (MODERN DARK THEME)
 * ======================================
 */
const baseTemplate = (title, content, buttonText, buttonLink) => `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>${title}</title>
  <style>
    body {
      margin: 0;
      padding: 0;
      font-family: 'Inter', -apple-system, BlinkMacMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      background: linear-gradient(135deg, #0f172a 0%, #1a1f3a 100%);
      min-height: 100vh;
    }
    .container {
      width: 100%;
      max-width: 600px;
      margin: 0 auto;
      padding: 20px;
    }
    .email-card {
      background: rgba(30, 41, 59, 0.9);
      backdrop-filter: blur(12px);
      border: 1px solid rgba(255, 255, 255, 0.1);
      border-radius: 24px;
      overflow: hidden;
      box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
    }
    .header {
      background: linear-gradient(135deg, #6366f1 0%, #ec4899 100%);
      padding: 40px 30px;
      text-align: center;
    }
    .header h1 {
      margin: 0;
      color: #ffffff;
      font-size: 28px;
      font-weight: 700;
      letter-spacing: -0.5px;
    }
    .header p {
      margin: 8px 0 0 0;
      color: rgba(255, 255, 255, 0.8);
      font-size: 14px;
    }
    .body {
      padding: 40px 30px;
      color: #f8fafc;
    }
    .body h2 {
      margin: 0 0 20px 0;
      color: #f8fafc;
      font-size: 22px;
      font-weight: 600;
    }
    .body p {
      margin: 0 0 16px 0;
      color: #94a3b8;
      font-size: 15px;
      line-height: 1.6;
    }
    .body ul {
      margin: 20px 0;
      padding-left: 0;
      list-style: none;
    }
    .body li {
      margin: 12px 0;
      color: #94a3b8;
      font-size: 15px;
      line-height: 1.6;
      padding-left: 24px;
      position: relative;
    }
    .body li:before {
      content: '→';
      position: absolute;
      left: 0;
      color: #6366f1;
      font-weight: bold;
    }
    .cta-button {
      display: inline-block;
      background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);
      color: #ffffff;
      padding: 14px 32px;
      text-decoration: none;
      border-radius: 12px;
      font-weight: 600;
      font-size: 15px;
      margin: 30px 0;
      transition: all 0.3s ease;
      border: 1px solid rgba(255, 255, 255, 0.1);
    }
    .cta-button:hover {
      transform: translateY(-2px);
      box-shadow: 0 10px 25px rgba(99, 102, 241, 0.3);
    }
    .footer {
      background: rgba(15, 23, 42, 0.5);
      padding: 30px;
      text-align: center;
      border-top: 1px solid rgba(255, 255, 255, 0.05);
    }
    .footer p {
      margin: 0;
      color: #64748b;
      font-size: 13px;
    }
    .footer-link {
      color: #6366f1;
      text-decoration: none;
    }
    .footer-link:hover {
      text-decoration: underline;
    }
    .divider {
      height: 1px;
      background: rgba(255, 255, 255, 0.05);
      margin: 30px 0;
    }
    .highlight {
      color: #6366f1;
      font-weight: 600;
    }
  </style>
</head>

<body>
  <div class="container">
    <div class="email-card">
      <!-- HEADER -->
      <div class="header">
        <h1>MindWell</h1>
        <p>Your Mental Wellness Companion</p>
      </div>

      <!-- BODY -->
      <div class="body">
        ${content}

        <div style="text-align: center;">
          <a href="${buttonLink}" class="cta-button">${buttonText}</a>
        </div>

        <div class="divider"></div>
        
        <p style="text-align: center; font-size: 14px; color: #94a3b8;">
          Take care of your mind, one moment at a time
        </p>
      </div>

      <!-- FOOTER -->
      <div class="footer">
        <p>© ${new Date().getFullYear()} MindWell. All rights reserved.</p>
        <p style="margin-top: 12px; font-size: 12px;">
          <a href="http://localhost:5173" class="footer-link">Visit MindWell</a> | 
          <a href="http://localhost:5173/help" class="footer-link">Support</a>
        </p>
      </div>
    </div>
  </div>
</body>
</html>
`;

/**
 * ======================================
 * SEND WELCOME EMAIL
 * ======================================
 */
const sendWelcomeEmail = async (email, name) => {
  try {
    const html = baseTemplate(
      "Welcome to MindWell",
      `
      <h2>Welcome to MindWell</h2>
      <p>
        Hello <span class="highlight">${name}</span>, we're excited to have you join our community.
        MindWell is your dedicated space to track your emotions, build healthy habits,
        and prioritize your mental wellbeing.
      </p>
      <p style="margin-top: 20px; font-weight: 500;">What you can do:</p>
      <ul>
        <li>Daily mood tracking with detailed analytics</li>
        <li>Journal your thoughts with AI-powered prompts</li>
        <li>Access wellness games and focus tools</li>
        <li>Get personalized recommendations based on your mood</li>
        <li>Connect with our AI wellness companion</li>
        <li>Earn rewards for maintaining wellness streaks</li>
      </ul>
      <p>
        We're here to support your mental health journey. If you have any questions,
        feel free to reach out to our support team.
      </p>
      `,
      "Start Your Journey",
      "http://localhost:5173"
    );

    const info = await transporter.sendMail({
      from: `"MindWell" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "Welcome to MindWell",
      html,
    });

    console.log("Welcome email sent:", info.messageId);
    return true;
  } catch (error) {
    console.error("Welcome email failed:", error);
    return false;
  }
};

/**
 * ======================================
 * SEND REMINDER EMAIL
 * ======================================
 */
const sendReminderEmail = async (email, name) => {
  try {
    const html = baseTemplate(
      "Daily Check-in Reminder",
      `
      <h2>Time for Your Daily Check-in</h2>
      <p>
        Hi <span class="highlight">${name}</span>, this is your gentle reminder to pause for a moment
        and check in with yourself today.
      </p>
      <p>
        Taking just a few minutes for reflection can make a meaningful difference
        in your overall wellbeing. Here's what you can do:
      </p>
      <ul>
        <li>Log your current mood and emotions</li>
        <li>Journal about your day or thoughts</li>
        <li>Explore personalized wellness recommendations</li>
        <li>Engage with a quick wellness activity</li>
      </ul>
      <p>
        Every check-in brings you closer to a healthier, happier you.
      </p>
      `,
      "Check In Now",
      "http://localhost:5173"
    );

    const info = await transporter.sendMail({
      from: `"MindWell" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "Time for your daily MindWell check-in",
      html,
    });

    console.log("Reminder email sent:", info.messageId);
    return true;
  } catch (error) {
    console.error("Reminder email failed:", error);
    return false;
  }
};

module.exports = {
  sendWelcomeEmail,
  sendReminderEmail,
};
