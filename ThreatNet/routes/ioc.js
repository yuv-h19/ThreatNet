const express = require('express');
const router = express.Router();
const iocController = require('../controllers/ioc');
const isAuth = require ('../utils/is-auth.js')

router.get('/add-ioc', isAuth, iocController.getAddIoc);

router.post('/add-ioc', isAuth, iocController.saveIoc);

router.get('/search-ioc', isAuth, iocController.getSearchIoc);

router.post('/search-ioc', isAuth, iocController.postSearchIoc);

module.exports = router;



