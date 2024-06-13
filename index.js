const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');
const path = require('path');
const flash = require('req-flash');
const cors = require('cors');
const bcrypt = require('bcrypt');
const fileUpload = require('express-fileupload'); // Pastikan ini ditambahkan
require('dotenv').config();
const app = express();

const PORT = process.env.PORT || 5050;

const loginRoutes = require('./src/routes/router-login');
const registerRoutes = require('./src/routes/router-register');
const appRoutes = require('./src/routes/router-app');
const forgotPasswordController = require('./src/controllers/forgotPasswordController');

// Gunakan CORS
app.use(cors());

// Konfigurasi session
app.use(session({
    resave: false,
    saveUninitialized: false,
    secret: 't@1k0ch3ng',
    name: 'secretName',
    cookie: {
        sameSite: true,
        maxAge: 60000
    },
}));

// Gunakan bodyParser untuk menangani request JSON dan URL encoded
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(flash());

// Middleware untuk cache control
app.use(function(req, res, next) {
    res.setHeader('Cache-Control', 'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0');
    res.setHeader('Pragma', 'no-cache');
    next();
});

// Set view engine dan direktori views
app.set('views', path.join(__dirname, 'src/views'));
app.set('view engine', 'ejs');

app.use(fileUpload()); // Pastikan ini ditambahkan

// Rute login dan register tanpa middleware verifyToken
app.use('/login', loginRoutes);
app.use('/register', registerRoutes);

// Rute lainnya dengan middleware verifyToken jika diperlukan di dalam router
app.use('/', appRoutes);

app.post('/forgot-password', forgotPasswordController.sendResetPasswordEmail);

// Middleware untuk menangani kesalahan
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
});

// Mulai server
app.listen(PORT, () => {
    console.log(`Server Berjalan di Port : ${PORT}`);
    console.log(`URL: http://localhost:${PORT}/`);
});
