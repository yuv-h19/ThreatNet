const APT = require('../models/apt');
const User = require('../models/user');

// Fetches all APT records and renders the attack-groups gallery view 
exports.getAttackGroups = (req, res, next) => {
    APT.fetchAll()
        .then(([rows]) => {
            res.render('apts/attack-groups', {
                groups: rows,         
                pageTitle: 'Attack Groups',
                isLoggedIn: req.session.isLoggedIn,
                user: req.session.user,
                role: req.session.role
            });
        })

        // Centralized handling for gallery load failures (logs + error page render) 
        .catch(err => {
            console.error("Load Attack Groups Error:", err);

            res.status(500).render('error', {
                pageTitle: 'Attack Groups Error',
                path: '/error',
                errorMessage: 'An error occurred while loading the Attack Groups gallery.',
                errorDetail: err.message
            });
        });
};

// Reads and maps POSTed form fields into an APT model instance 
exports.getAddApt = (req, res, next) => {
    res.render('apts/add-apt', {
        pageTitle: 'Report APT',
        isLoggedIn: req.session.isLoggedIn,
        user: req.session.user,
        role: req.session.role
    });
};

exports.postAddApt = (req, res, next) => {
    const apt_name = req.body.apt_name;
    const actor_type = req.body.actor_type;
    const origin_country = req.body.origin_country;
    const confidence_level = req.body.confidence_level;
    const target_sectors = req.body.target_sectors;
    const primary_motivation = req.body.primary_motivation;
    const reported_by = req.session.userId || null;

    const apt = new APT(
        apt_name,
        actor_type,
        origin_country,
        confidence_level,
        target_sectors,
        primary_motivation,
        reported_by
    );
    
    apt.save()
        // Awards points to the reporting user after successful DB insert 
        .then(() => {
            return User.addPoints(reported_by, 10);
        })
         // Syncs session points for immediate UI updates 
        .then(() => {
            if (req.session.points !== undefined) {
                req.session.points += 10;
            } else {
                req.session.points = 10;
            }
            return req.session.save();
        })
        //Redirects to home with a success flag 
        .then(() => {
            res.redirect('/?success=true'); 
        })
        // Centralized handling for insert/points/session failures 
        .catch(err => {
            console.error("Save APT Error:", err);
            res.status(500).render('error', {
                pageTitle: 'APT Operation Failed',
                path: '/error',
                errorMessage: 'Critical error: Could not save the APT report to the database.',
                errorDetail: err.message
            });
        });
};
    
