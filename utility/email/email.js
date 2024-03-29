const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  host: "smtp.sendgrid.net",
  port: process.env.NODEMAILER_PORT,
  secure: false,
  auth: {
    user: process.env.NODEMAILER_USER,
    pass: process.env.NODEMAILER_PASS,
  },
});

//@TODO
/* 1) Add input validators to OTP and email
*/

const sendOTP = (email, otp) => {
  try {
    transporter.sendMail({
      from: process.env.NODEMAILER_FROM_ADDRESS,
      to: `${email}`,
      subject: "Building-U One-Time Password (OTP)",
      html: `<body style="font-family: Georgia, 'Times New Roman', Times, serif; background-color: #f4f4f4; padding: 20px;">
      <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; padding: 10px; border-radius: 10px; box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);">
        <h2 style="color: #F9EB02;">One-Time Password (OTP)</h2>
        <p style="text-align: center;">Your OTP is valid for a short period (1hr). Please use it to complete your action.</p>
        
        <div style="text-align: center;">
          <div style="font-size: 24px; font-weight: bold; color: #F9EB02; margin: 20px 0; padding: 10px; border-radius: 5px; user-select: all;">${otp}</div>
        </div>
        
        <div style="margin-top: 20px; text-align: center; color: #888888; font-size: 1rem;">
          <p>If you didn't request this OTP, please ignore this email.</p>
          <p>Building-U-Feedback. All rights reserved.</p>
        </div>
      </div>
    </body>`,
    });
    return {success: true, msg: `OTP was sent to  ${email}`};
  } catch (err) {
    return {success: false, msg: `OTP could not be sent to ${email}`};
  }
};

module.exports = {
  sendOTP,
};
