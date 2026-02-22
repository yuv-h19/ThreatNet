// Import models for threat intelligence categories
const APT = require('../models/apt');
const IOC = require('../models/ioc');
const CVE = require('../models/cve');

// Helper function to fetch counts from all threat data tables concurrently
function getDashboardStatistics() {
    return Promise.all([
        APT.getCount(),
        IOC.getCount(),
        CVE.getCount()
    ]);
}

// Controller to handle the main landing page request
exports.runHomePage = (req, res, next) => {

    // Retrieve the user from the current session
    const sessionUser = req.session.user;

    // Fetch dashboard statistics before rendering the page
    getDashboardStatistics()
        .then(results => {

            // Destructure database count results
            const apts = results[0];
            const iocs = results[1];
            const cves = results[2];

            // Render homepage for unauthorized guests
            if (sessionUser == undefined) {
                return res.render('index', {
                    user: '',
                    attackGroupsCount: apts[0][0].count,
                    iocCount: iocs[0][0].count,
                    cveCount: cves[0][0].count
                });
            }

            // Render homepage for logged-in users
            res.render('index', {
                user: sessionUser,
                attackGroupsCount: apts[0][0].count,
                iocCount: iocs[0][0].count,
                cveCount: cves[0][0].count
            });

        })
        .catch(err => {
            // Log error and render homepage with zeroed values on failure
            console.error(err);
            res.render('index', {
                user: '',
                attackGroupsCount: 0,
                iocCount: 0,
                cveCount: 0
            });
        });
};

// Controller to handle non-existent routes
exports.get404 = (req, res, next) => {
    res.status(404).render('file_not_found', { pageTitle: 'Page Not Found' });
};