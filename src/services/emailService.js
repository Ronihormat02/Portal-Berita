// emailService.js
const sgMail = require('@sendgrid/mail');
require('dotenv').config();
const jwt = require('jsonwebtoken');

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

exports.generateResetPasswordToken = (email) => {
    const token = jwt.sign({ email }, process.env.JWT_SECRET, { expiresIn: '1h' });
    return token;
};

exports.sendResetPasswordEmail = async (recipientEmail, resetLink) => {
    try {
        const msg = {
            to: recipientEmail,
            from: process.env.EMAIL_ADDRESS,
            subject: 'Reset Password',
            html: `<p>Click <a href="${resetLink}">here</a> to reset your password.</p>`,
        };
        await sgMail.send(msg);
        console.log('Reset password email sent successfully.');
    } catch (error) {
        console.error('Error sending reset password email:', error);
        throw new Error('Failed to send reset password email.');
    }
};
