const express = require('express');
const router = express.Router();
const aptController = require('../controllers/apt'); 
const isAuth = require('../utils/is-auth'); 

router.get('/attack-groups', isAuth, aptController.getAttackGroups);

router.get('/add-apt', isAuth, aptController.getAddApt);

router.post('/add-apt', isAuth, aptController.postAddApt);

module.exports = router;