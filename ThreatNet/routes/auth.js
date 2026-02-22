const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth');

router.get('/register-user', authController.getRegister)

router.post('/save-user', authController.saveUser);

router.get('/login', authController.getLogin);

router.post('/login', authController.login);

router.get('/logout', authController.logout);

module.exports = router;