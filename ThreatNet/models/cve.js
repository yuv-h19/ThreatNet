const db = require('../utils/database');

module.exports = class CVE {
    // Initialize CVE object with vulnerability details
    constructor(cve_id, vulnerability_name, cvss_score, attack_vector, attack_complexity, affected_product, reported_by) {
        this.cve_id = cve_id;
        this.vulnerability_name = vulnerability_name;
        this.cvss_score = cvss_score;
        this.attack_vector = attack_vector;
        this.attack_complexity = attack_complexity;
        this.affected_product = affected_product;
        this.reported_by = reported_by;
    }

    // Save a new CVE entry into the database
    save() {
        return db.execute(
            'INSERT INTO cves (cve_id, vulnerability_name, cvss_score, attack_vector, attack_complexity, affected_product, reported_by) VALUES (?, ?, ?, ?, ?, ?, ?)',
            [
                this.cve_id,
                this.vulnerability_name,
                this.cvss_score,
                this.attack_vector,
                this.attack_complexity,
                this.affected_product,
                this.reported_by
            ]
        );
    }

    // Search vulnerabilities filtering by product name
    static findByProduct(product) {
        return db.execute(
            'SELECT * FROM cves WHERE affected_product LIKE ? ORDER BY created_at DESC',
            [`%${product}%`]
        );
    }

    // Generate severity statistics based on CVSS thresholds
    static getStats() {
        return db.execute(`
            SELECT 
                COUNT(*) as total,
                SUM(CASE WHEN cvss_score >= 9 THEN 1 ELSE 0 END) as critical,
                SUM(CASE WHEN cvss_score >= 7 AND cvss_score < 9 THEN 1 ELSE 0 END) as high,
                SUM(CASE WHEN cvss_score < 7 THEN 1 ELSE 0 END) as medium
            FROM cves
        `);
    }

    // Fetch the 20 most recent vulnerability records
    static fetchAll() {
        return db.execute('SELECT * FROM cves ORDER BY created_at DESC LIMIT 20');
    }

    // Retrieve the total count of registered CVEs
    static getCount() {
        return db.execute("SELECT COUNT(id) AS count FROM cves");
    }
};