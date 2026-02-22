const db = require('../utils/database');

module.exports = class User {
    // Initialize user object with profile and professional attributes
    constructor(username, password, first_name, last_name, phone, email, company, job_role, country, years_of_experience, points = 0) {
        this.username = username;
        this.password = password;
        this.first_name = first_name;
        this.last_name = last_name;
        this.phone = phone;
        this.email = email;
        this.company = company;
        this.job_role = job_role;
        this.country = country;
        this.years_of_experience = years_of_experience;
        this.points = points;
    }

    // Register a new user in the database
    save() {
        return db.execute(
            'INSERT INTO users (username, password_hash, first_name, last_name, phone, email, company, job_role, country, years_of_experience, points) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
            [
                this.username, 
                this.password, 
                this.first_name, 
                this.last_name, 
                this.phone, 
                this.email, 
                this.company, 
                this.job_role, 
                this.country, 
                this.years_of_experience, 
                0
            ]
        );
    }

    // Fetch user details by username
    static getByName(username) {
        return db.execute('SELECT * FROM users WHERE username = ?', [username]);
    }

    // Fetch user details by email
    static getByEmail(email) {
        return db.execute('SELECT * FROM users WHERE email = ?', [email]);
    }

    // Update user points as part of the reward system
    static addPoints(userId, amount) {
        return db.execute(
            'UPDATE users SET points = points + ? WHERE id = ?',
            [amount, userId]
        );
    }
};