const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');
const path = require('path');
const flash = require('req-flash');
const cors = require('cors');
const fileUpload = require('express-fileupload');
require('dotenv').config(); // Load environment variables
const app = express();

const PORT = process.env.PORT || 5050;

// Routes and Controllers
const appRoutes = require('./src/routes/router-app');

// Use CORS
app.use(cors());

// Configure session
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

// Use bodyParser to handle JSON and URL encoded requests
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(flash());

// Cache control middleware
app.use(function(req, res, next) {
    res.setHeader('Cache-Control', 'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0');
    res.setHeader('Pragma', 'no-cache');
    next();
});

// Set view engine and views directory
app.set('views', path.join(__dirname, 'src/views'));
app.set('view engine', 'ejs');

app.use(fileUpload()); // File upload middleware

// Use app routes
app.use('/', appRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
});

// Start server
app.listen(PORT, () => {
    console.log(`Server running on port: ${PORT}`);
    console.log(`URL: ${process.env.BASE_URL || `http://localhost:${PORT}`}/`);
});
