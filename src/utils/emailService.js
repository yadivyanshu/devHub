const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.EMAIL_USER, 
        pass: process.env.EMAIL_PASS,
    },
});

const sendResetEmail = async (email, resetToken) => {
    const resetUrl = `http://localhost:3000/reset-password/${resetToken}`;

    await transporter.sendMail({
        from: '"DevHub Support Team" <no-reply@example.com>',
        to: email,
        subject: "Password Reset Request",
        html: `<p>Use URL: ${resetUrl} to reset your password. This link expires in 15 minutes.</p>`,
    });
};

module.exports = { sendResetEmail };