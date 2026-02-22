const express = require('express');
const router = express.Router();
const adminController = require('../controllers/admin');
const isAuth = require('../utils/is-auth');

router.get('/', adminController.runHomePage);

module.exports = router;