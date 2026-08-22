import nodemailer from 'nodemailer';

const requiredEmailSettings = ['SMTP_HOST', 'SMTP_PORT', 'SMTP_USER', 'SMTP_PASSWORD', 'SMTP_FROM'];

const getTransporter = () => {
  const missing = requiredEmailSettings.filter((key) => !process.env[key]);
  if (missing.length) {
    throw new Error(`Email delivery is not configured. Missing: ${missing.join(', ')}`);
  }

  return nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT),
    secure: process.env.SMTP_SECURE === 'true',
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASSWORD,
    },
  });
};

export const sendVerificationEmail = async (email: string, code: string) => {
  await getTransporter().sendMail({
    from: process.env.SMTP_FROM,
    to: email,
    subject: 'Your SmartFin Connect verification code',
    text: `Your SmartFin Connect verification code is ${code}. It expires in 15 minutes.`,
    html: `<p>Your SmartFin Connect verification code is:</p><p style="font-size: 24px; font-weight: 700; letter-spacing: 6px">${code}</p><p>This code expires in 15 minutes.</p>`,
  });
};

export const sendPasswordResetEmail = async (email: string, code: string) => {
  await getTransporter().sendMail({
    from: process.env.SMTP_FROM,
    to: email,
    subject: 'Your SmartFin Connect password reset code',
    text: `Your SmartFin Connect password reset code is ${code}. It expires in 15 minutes.`,
    html: `<p>Your SmartFin Connect password reset code is:</p><p style="font-size: 24px; font-weight: 700; letter-spacing: 6px">${code}</p><p>This code expires in 15 minutes.</p>`,
  });
};
