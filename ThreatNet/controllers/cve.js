const CVE = require('../models/cve');
const User = require('../models/user');

exports.saveCve = (req, res, next) => {

    // Extract CVE form fields from request body
    const cve_id = req.body.cve_id;
    const vulnerability_name = req.body.vulnerability_name;
    const cvss_score = parseFloat(req.body.cvss_score);
    const attack_vector = req.body.attack_vector;
    const attack_complexity = req.body.attack_complexity;
    const affected_product = req.body.affected_product;

    // Reporter is taken from active session (if logged in)
    const reported_by = req.session.userId || null;

    // Create new CVE model instance
    const cve = new CVE(
        cve_id, 
        vulnerability_name, 
        cvss_score, 
        attack_vector, 
        attack_complexity, 
        affected_product, 
        reported_by
    );
    
    cve.save()
        .then(() => {

            // Reward system:
            // After successful save, grant points to the reporting user
            return User.addPoints(reported_by, 10);
        })
        .then(() => {

            // Session sync:
            // Update local session points so UI reflects change instantly
            if (req.session.points !== undefined) {
                req.session.points += 10;
            } else {
                req.session.points = 10;
            }

            // Ensure session persistence before redirect
            return req.session.save();
        })
        .then(() => {

            // Redirect with success flag to trigger UI popup
            res.redirect('/?success=true'); 
        })
        .catch(err => {

            // Centralized error handling for DB failures
            console.error("Save CVE Error:", err);
            res.status(500).render('error', {
                pageTitle: 'Operation Failed',
                path: '/error',
                errorMessage: 'Critical error: Could not save the CVE report to the database.',
                errorDetail: err.message
            });
        });
};


exports.getDatabase = (req, res, next) => {

    // Optional filtering via query string (?productName=...)
    const productName = req.query.productName || '';

    // Parallel database requests:
    // 1) Statistics aggregation
    // 2) CVE data retrieval (filtered or full list)
    Promise.all([
        CVE.getStats(),
        productName ? CVE.findByProduct(productName) : CVE.fetchAll()
    ])
    .then(([[statsRows], [cveRows]]) => {

        // Provide safe fallback when DB contains no rows
        const stats = statsRows[0] || { total: 0, critical: 0, high: 0, medium: 0 };

        res.render('cves/search-cve', {
            cves: cveRows,
            stats: stats,
            query: productName,
            path: '/cve-database',
            pageTitle: 'CVE Database'
        });
    })
    .catch(err => {

        // Error handling for DB read operations
        console.error("Load Database Error:", err);
        res.status(500).render('error', {
            pageTitle: 'Database Error',
            path: '/error',
            errorMessage: 'We encountered an issue while loading the CVE statistics.',
            errorDetail: err.message
        });
    });
};