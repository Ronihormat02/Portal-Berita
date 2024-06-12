// forgotPasswordController.js

const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { jwtSecret } = require('../configs/jwtConfig');
const { sendResetPasswordEmail, generateResetPasswordToken } = require('../services/emailService');


exports.sendResetPasswordEmail = async (req, res) => {
    try {
        const { email } = req.body;

        // Generate token reset password
        const resetToken = generateResetPasswordToken(email);

        // Buat tautan reset password
        const resetLink = `http:/localhost:5050/reset-password?token=${resetToken}`;

        // Kirim email reset password
        await sendResetPasswordEmail(email, resetLink);

        return res.status(200).json({ message: 'Reset password email sent successfully.' });
    } catch (error) {
        console.error('Error sending reset password email:', error);
        return res.status(500).json({ message: 'Internal server error.' });
    }
};
// Endpoint untuk melakukan reset password
exports.resetPassword = async (req, res) => {
    try {
        const { email, token, newPassword } = req.body;

        // Di sini Anda perlu melakukan verifikasi token
        // Jika token valid, lanjutkan dengan proses reset password
        // Jika tidak valid, berikan respons dengan pesan yang sesuai

        // Contoh: verifikasi token
        jwt.verify(token, jwtSecret, async (err, decoded) => {
            if (err) {
                console.error('Error verifikasi token:', err);
                return res.status(401).json({ message: 'Invalid token' });
            }

            // Lakukan reset password di sini
            // Misalnya: hash password baru dan update ke database
            const hashedPassword = await bcrypt.hash(newPassword, 10);
            // Update password di database sesuai email yang didapatkan dari token
            // Contoh: await User.updateOne({ email: decoded.email }, { password: hashedPassword });

            return res.status(200).json({ message: 'Password reset successfully.' });
        });
    } catch (error) {
        console.error('Error resetting password:', error);
        return res.status(500).json({ message: 'Internal server error.' });
    }
};

// Fungsi untuk menentukan peran pengguna berdasarkan alamat email
const determineRole = (email) => {
    if (email.endsWith('@admin.com')) {
        return 'admin';
    } else if (email.endsWith('@superadmin.com')) {
        return 'superadmin';
    } else {
        return 'user';
    }
};
