const path = require('path');
const express = require('express');
const router = express.Router();
const cveController = require('../controllers/cve');
const isAuth = require('../utils/is-auth.js');

router.get('/add-cve', isAuth, (req, res, next) => {
    res.render('cves/report-cve'); 
});

router.post('/save-cve', isAuth, cveController.saveCve);

router.get('/cve-database', isAuth, cveController.getDatabase);

router.get('/search-cves', isAuth, cveController.getDatabase);

module.exports = router;