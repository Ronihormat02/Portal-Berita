const nodemailer = require('nodemailer');
require('dotenv').config();
const jwt = require('jsonwebtoken');

exports.generateResetPasswordToken = (email) => {
    // Menghasilkan token reset password dengan menggunakan JWT
    const token = jwt.sign({ email }, process.env.JWT_SECRET, { expiresIn: '1h' });
    return token;
};

const transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
        user: process.env.EMAIL_ADDRESS,
        pass: process.env.EMAIL_PASSWORD
    }
});

// Fungsi untuk mengirim email reset password
exports.sendResetPasswordEmail = async (recipientEmail, resetLink) => {
    try {
        // Kirim email menggunakan transporter
        await transporter.sendMail({
            from: process.env.EMAIL_ADDRESS,
            to: recipientEmail,
            subject: 'Reset Password',
            html: `<p>Click <a href="${resetLink}">here</a> to reset your password.</p>`
        });

        console.log('Reset password email sent successfully.');
    } catch (error) {
        console.error('Error sending reset password email:', error);
        throw new Error('Failed to send reset password email.');
    }
};