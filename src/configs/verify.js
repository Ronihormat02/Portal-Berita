//verify.js
const isLogout = (req, res, next) => {
    // Logika pengecekan apakah pengguna sudah logout
    // Contoh: if (!req.session.userId) { ... }
    next(); // Panggil next() jika pengguna telah logout
};

module.exports = {
    isLogout
};
