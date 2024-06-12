// router-app.js

const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const userController = require('../controllers/userController');
const jwtAuth = require('../middlewares/jwt-auth');
const authMiddleware = require('../middlewares/authMiddleware');
const homeController = require('../controllers/controller-home');
const profileController = require('../controllers/controller-profile');
const newsController = require('../controllers/newsController');
const favoriteController = require('../controllers/favoriteController');
const commentController = require('../controllers/commentController');
const categoryController = require('../controllers/categoryController');


router.post('/auth/signup', authController.signup);
router.post('/auth/signin', authController.signin);

router.get('/users', jwtAuth.verifyToken, userController.getAllUsers);
router.get('/users/:userId', jwtAuth.verifyToken, userController.getUser);
router.put('/users/:userId', jwtAuth.verifyToken, userController.updateUser);
router.delete('/users/:userId', jwtAuth.verifyToken, userController.deleteUser);

//router.get('/news', jwtAuth.verifyToken, newsController.getAllNews); // Perubahan disini
router.get('/news', newsController.getAllNews);

router.post('/news', jwtAuth.verifyToken, newsController.addNews);
router.put('/news/:id', jwtAuth.verifyToken, newsController.updateNews);
router.delete('/news/:id', jwtAuth.verifyToken, newsController.deleteNews);
router.get('/news/category/:id_category', jwtAuth.verifyToken, newsController.getNewsByCategory); // Perubahan disini


router.get('/categories', categoryController.getAllCategories);
router.post('/categories', categoryController.addCategory);
router.put('/categories/:id', categoryController.updateCategory);  // Tambahkan ini untuk memperbarui kategori
router.delete('/categories/:id', categoryController.deleteCategory);  // Tambahkan ini untuk menghapus kategori

router.post('/news/favorite', jwtAuth.verifyToken, favoriteController.addFavorite);
router.delete('/news/favorite/:newsId', jwtAuth.verifyToken, favoriteController.removeFavorite);
router.get('/favorites', favoriteController.getAllfavorites);
router.put('/favorites/:favoriteId', favoriteController.updateFavorite);

router.post('/comments/add', jwtAuth.verifyToken, commentController.addComment); 
router.get('/news/:id/comments', jwtAuth.verifyToken, commentController.getCommentsByNewsId); 
router.delete('/comments/:id', jwtAuth.verifyToken, commentController.deleteComment); 


module.exports = router;
