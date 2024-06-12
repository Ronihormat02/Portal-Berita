// router-login.js

const router = require('express').Router();
const loginController = require('../controllers/controller-login');
const verifyUser = require('../configs/verify');
router.post('/signin', loginController.loginAuth);



router.post('/signin', loginController.loginAuth);

router.get('/', loginController.login);
router.get('/logout', loginController.logout);

router.post('/auth', loginController.loginAuth);

// Menambahkan penanganan kesalahan untuk rute signin
router.post('/signin', (req, res) => {
    res.status(400).json({ message: 'Gagal masuk' });
});
module.exports = router;
