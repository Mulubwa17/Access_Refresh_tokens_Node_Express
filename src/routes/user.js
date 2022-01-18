const express = require('express');

const router = express.Router();

const userController = require('../controllers/userController');

const { auth } = require('../middleware/auth');


router.post('/register', userController.newUser);

router.get('/profile/:_id', auth, userController.getUser);

router.get('/list', auth, userController.getUsers);

router.put('/update/:_id', auth, userController.updateUser);

router.delete('/delete/:_id', auth, userController.deleteUser);

router.post('/login', userController.loginUser);

router.post('/refresh', userController.refreshTokenUser);

router.get('/logout', userController.logoutUser);

module.exports = router;