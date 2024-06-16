// router-app.js

const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const userController = require('../controllers/userController');
const jwtAuth = require('../middlewares/jwt-auth');
const authMiddleware = require('../middlewares/authMiddleware');
const newsController = require('../controllers/newsController');
const favoriteController = require('../controllers/favoriteController');
const commentController = require('../controllers/commentController');
const categoryController = require('../controllers/categoryController');
const { uploadFile } = require('../controllers/controller-upload');
const gantiPasswordController = require('../controllers/gantiPasswordController'); // Sesuaikan path dan nama file dengan struktur direktori Anda


router.post('/auth/signup', authController.signup);
router.post('/auth/signin', authController.signin);

router.get('/users', jwtAuth.verifyToken, userController.getAllUsers);
router.get('/users/:userId', userController.getUser);
router.put('/users/:userId', jwtAuth.verifyToken, userController.updateUser);
router.delete('/users/:userId', jwtAuth.verifyToken, userController.deleteUser);

//router.get('/news', jwtAuth.verifyToken, newsController.getAllNews); // Perubahan disini
router.get('/news', newsController.getAllNews);
router.get('/news/:id', newsController.getNewsById);

router.post('/news', jwtAuth.verifyToken, newsController.addNews);
router.put('/news/:id', jwtAuth.verifyToken, newsController.updateNews);
router.delete('/news/:id', jwtAuth.verifyToken, newsController.deleteNews);
router.get('/news/category/:id_category', newsController.getNewsByCategory);


router.get('/categories', categoryController.getAllCategories);
router.post('/categories',jwtAuth.verifyToken, categoryController.addCategory);
router.put('/categories/:id', jwtAuth.verifyToken,categoryController.updateCategory);  // Tambahkan ini untuk memperbarui kategori
router.delete('/categories/:id', jwtAuth.verifyToken,categoryController.deleteCategory);  // Tambahkan ini untuk menghapus kategori

router.get('/favorites', jwtAuth.verifyToken, favoriteController.getAllFavorites);
router.put('/favorites/:favoriteId', jwtAuth.verifyToken, favoriteController.updateFavorite);
router.post('/news/favorite', jwtAuth.verifyToken, favoriteController.addFavorite);
router.delete('/news/favorite/:newsId', jwtAuth.verifyToken, favoriteController.removeFavorite);

router.get('/comments/:newsId', commentController.getCommentsByNewsId);
router.post('/comments/add', jwtAuth.verifyToken, commentController.addComment); 
router.delete('/comments/:id', jwtAuth.verifyToken, commentController.deleteComment); 

router.get('/files', jwtAuth.verifyToken, uploadFile);
router.post('/upload', jwtAuth.verifyToken, uploadFile);
router.put('/files/:fileName', jwtAuth.verifyToken, uploadFile);
router.delete('/files/:fileName', jwtAuth.verifyToken,uploadFile);

router.put('/change-password', jwtAuth.verifyToken, gantiPasswordController.changePassword);



module.exports = router;
