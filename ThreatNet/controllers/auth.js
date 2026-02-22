const User = require('../models/user');
const bcrypt = require('bcryptjs');

exports.getRegister = (req, res, next) => {

    // Render registration view
    res.render('auth/register', { 
        error: "",
        isLoggedIn: req.session.isLoggedIn || false 
    });
};

exports.saveUser = (req, res, next) => {

    // Extract all user profile fields from registration form
    const { 
        username, 
        password, 
        first_name, 
        last_name, 
        phone, 
        email, 
        company, 
        job_role, 
        country, 
        years_of_experience 
    } = req.body;

    // Validate mandatory fields (NOT NULL in SQL)
    const requiredFields = { 
        'Username': username, 
        'Password': password, 
        'First Name': first_name, 
        'Last Name': last_name, 
        'Email': email 
    };

    const missingField = Object.keys(requiredFields).find(key => !requiredFields[key] || requiredFields[key].trim() === "");

    if (missingField) {
        return res.render('auth/register', { 
            error: `Missing field: ${missingField} is required.`,
            isLoggedIn: false 
        });
    }

    // Validate uniqueness of username before creating account
    User.getByName(username)
        .then(([rows]) => {

            // Prevent duplicate usernames
            if (rows.length > 0) {
                return res.render('auth/register', { 
                    error: "User with this user name already exists",
                    isLoggedIn: false
                });
            }

            // Validate uniqueness of email (inserted into the chain)
            return User.getByEmail(email)
                .then(([emailRows]) => {
                    
                    // Prevent duplicate emails
                    if (emailRows.length > 0) {
                        return res.render('auth/register', { 
                            error: "User with this email already exists",
                            isLoggedIn: false
                        });
                    }

                    // Security: Hash password using bcrypt
                    return bcrypt.hash(password, 12)
                        .then(hashedPassword => {

                            // Handelling empty "Years of Experience" field
                            const yearsExp = years_of_experience || null;

                            // Create new User entity
                            const user = new User(
                                username, 
                                hashedPassword, 
                                first_name, 
                                last_name, 
                                phone, 
                                email, 
                                company, 
                                job_role, 
                                country, 
                                yearsExp
                            );
                            return user.save();
                        })
                        .then(([result]) => {

                            // Auto-login flow after successful registration
                            req.session.isLoggedIn = true;
                            req.session.user = username;
                            req.session.firstName = first_name;
                            req.session.role = job_role;
                            req.session.userId = result.insertId;
                            req.session.points = 0

                            // Persist session before redirect
                            return req.session.save(err => {
                                if (err) console.log(err);
                                res.redirect('/'); 
                            });
                        });
                });
        })
        .catch(err => {

            // Registration error handling
            console.log(err);
            res.render('auth/register', { 
                error: "An unexpected error occurred during registration.",
                isLoggedIn: false
            });
        });
};


exports.getLogin = (req, res, next) => {

    // Render login page
    res.render('auth/login', { 
        error: "",
        isLoggedIn: req.session.isLoggedIn || false
    });
};

exports.login = (req, res, next) => {

    // Credentials submitted from login form
    const username = req.body.user; 
    const password = req.body.password;

    User.getByName(username)
        .then(([rows]) => {

            // If username not found -> generic error (avoid account enumeration)
            if (rows.length === 0) {
                return res.render('auth/login', { 
                    error: "Invalid Username",
                    isLoggedIn: false 
                });
            }

            const user = rows[0];

            // Compare plain password with stored bcrypt hash
            return bcrypt.compare(password, user.password_hash)
                .then(doMatch => {

                    if (doMatch) {

                        // Initialize authenticated session
                        req.session.isLoggedIn = true;
                        req.session.user = user.username;
                        req.session.firstName = user.first_name;
                        req.session.role = user.job_role;
                        req.session.userId = user.id;
                        req.session.points = user.points;

                        // Ensure session stored before redirect
                        return req.session.save(err => {
                            if (err) console.log(err);
                            res.redirect('/');
                        });
                    }

                    // Incorrect password case
                    res.render('auth/login', { 
                        error: "Invalid Password",
                        isLoggedIn: false
                    });
                });
        })
        .catch(err => {

            // Login error fallback
            console.log(err);
            res.redirect('/login');
        });
};


// Logout handler
exports.logout = (req, res, next) => {

    // Destroy server-side session and clear session cookie
    req.session.destroy(err => {
        if (err) console.log(err);
        res.clearCookie('connect.sid'); 
        res.redirect('/login');
    });
};