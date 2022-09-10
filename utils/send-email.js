const nodemailer = require('nodemailer');
const { BadRequestError } = require('../errors');

const EMAIL_TEMPLATE_NAME = {
  account_verification: 'account_verification',
  password_reset: 'password_reset',
};

const sendEmail = (emailTo, name, url, template) => {
  const stmp = nodemailer.createTransport({
    host: 'smtp.mailtrap.io',
    port: 2525,
    auth: {
      user: process.env.MAILTRAP_USER,
      pass: process.env.MAILTRAP_PASSWORD,
    },
  });

  let subject;
  let html;

  if (template === EMAIL_TEMPLATE_NAME.account_verification) {
    subject = 'Blog-App email verification';
    html = `
          <div style="max-width:700px;margin-bottom:1rem;display:flex;align-items:center;gap:10px;font-family:Roboto;font-weight:600;color:#3b5998">
            <span>Action requise : Activate your account</span>
          </div>
          <div style="padding:1rem 0;border-top:1px solid #e5e5e5;color:#141823;font-size:17px;font-family:Roboto">
            <span>Hello ${name}</span>
            <div style="padding:20px 0">
              <span style="padding:1.5rem 0">
                You recently created an account on Blog-App. To complete your registration, please confirm your account.
              </span>
            </div>
            <a href=${url} style="width:200px;padding:10px 15px;background:#4c649b;color:#fff;text-decoration:none;font-weight:600">
              Confirm your account
            </a>
          </div>`;
  } else if (template === EMAIL_TEMPLATE_NAME.password_reset) {
    subject = 'Blog-App Password reset';
    html = `
          <div style="max-width:700px;margin-bottom:1rem;display:flex;align-items:center;gap:10px;font-family:Roboto;font-weight:600;color:#3b5998">
            <span>Action requise : Reset Your Password</span>
          </div>
          <div style="padding:1rem 0;border-top:1px solid #e5e5e5;color:#141823;font-size:17px;font-family:Roboto">
            <span>Hello ${name}</span>
            <div style="padding:20px 0">
              <span style="padding:1.5rem 0">
                You request for a password reset.
              </span>
            </div>
            <a href=${url} style="width:200px;padding:10px 15px;background:#4c649b;color:#fff;text-decoration:none;font-weight:600">
              Reset your password
            </a>
          </div>`;
  }

  const mailOptions = {
    from: process.env.EMAIL,
    to: emailTo,
    subject,
    html,
  };

  stmp.sendMail(mailOptions, (err, res) => {
    if (err) throw new BadRequestError(err);
    return res;
  });
};

module.exports = { EMAIL_TEMPLATE_NAME, sendEmail };
