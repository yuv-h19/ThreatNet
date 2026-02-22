const express = require('express');
const router = express.Router();
const isAuth = require ('../utils/is-auth.js')

router.get('/campaign-confirmation', isAuth, (req, res) => {
    res.render('campaigns/campaign-confirmation', {
        pageTitle: 'Campaign Submitted',
        path: '/campaign-confirmation'
    }); 
});

module.exports = router;


