const express = require('express');
const router = express.Router();
const isAuth = require('../utils/is-auth.js');

router.get('/attack-techniques', isAuth, (req, res) => {
    res.render('techniques/attack-techniques');
});

router.get('/phishing-details', isAuth, (req, res, next) => {
    res.render('techniques/phishing-details');
});

module.exports = router;
