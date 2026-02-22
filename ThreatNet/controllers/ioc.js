const IOC = require('../models/ioc');
const User = require('../models/user');

exports.getAddIoc = (req, res, next) => {

    // Render IOC submission page
    res.render('iocs/add-ioc', {
        pageTitle: 'Add New IOC',
        path: '/add-ioc'
    });
};

exports.saveIoc = (req, res, next) => {

    // Extract indicator value separately (core IOC identifier)
    const indicator_value = req.body.indicator_value;

    // Reporter is derived from active authenticated session
    const reported_by = req.session.userId;

    // Create IOC entity from submitted form fields
    const ioc = new IOC(
        indicator_value, 
        req.body.indicator_type, 
        req.body.threat_type, 
        req.body.threat_family, 
        req.body.severity, 
        req.body.threat_description, 
        reported_by
    );
    
    ioc.save()
        .then(() => {

            // Reward logic:
            // Grant points to analyst for contributing intelligence
            return User.addPoints(reported_by, 10);
        })
        .then(() => {

            // Session sync:
            // Update local session points immediately for UI feedback
            if (req.session.points !== undefined) {
                req.session.points += 10;
            } else {
                req.session.points = 10;
            }

            // Ensure session persistence before redirect
            return req.session.save();
        })
        .then(() => {

            // Redirect with success flag to trigger frontend notification
            res.redirect('/?success=true');
        })
        .catch(err => {

            // Centralized error handling for IOC submission failures
            console.error("Save IOC Error:", err);
            res.status(500).render('error', {
                pageTitle: 'Operation Failed',
                errorMessage: 'Critical error: Could not complete the process.',
                errorDetail: err.message
            });
        });
};


// Render initial IOC search page (no results yet)
exports.getSearchIoc = (req, res, next) => {
    res.render('iocs/search-ioc', {
        pageTitle: 'Search IOC',
        path: '/search-ioc',
        results: null,
        searchValue: ''
    });
};


// Handle IOC search request
exports.postSearchIoc = (req, res, next) => {

    // Search based on exact indicator value
    const searchValue = req.body.indicator_value;

    IOC.fetchByValue(searchValue)
        .then(([rows]) => {

            // Render results using same view for consistency
            res.render('iocs/search-ioc', {
                pageTitle: 'Search Results',
                path: '/search-ioc',
                results: rows,
                searchValue: searchValue
            });
        })
        .catch(err => {

            // Error handling for IOC search failures
            console.error("Search IOC Error:", err);

            res.status(500).render('error', {
                pageTitle: 'Search Failed',
                path: '/error',
                errorMessage: 'An error occurred while searching for the IOC.',
                errorDetail: err.message
            });
        });
};