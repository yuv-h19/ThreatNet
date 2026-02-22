const db = require('../utils/database');

module.exports = class IOC {
    // Initialize IOC instance with threat intelligence data
    constructor(indicator_value, indicator_type, threat_type, threat_family, severity, threat_description, reported_by) {
        this.indicator_value = indicator_value;
        this.indicator_type = indicator_type;
        this.threat_type = threat_type;
        this.threat_family = threat_family;
        this.severity = severity;
        this.threat_description = threat_description;
        this.reported_by = reported_by;
    }

    // Insert the IOC record into the database
    save() {
        return db.execute(
            'INSERT INTO iocs (indicator_value, indicator_type, threat_type, threat_family, severity, threat_description, reported_by) VALUES (?, ?, ?, ?, ?, ?, ?)',
            [
                this.indicator_value,
                this.indicator_type,
                this.threat_type,
                this.threat_family,
                this.severity,
                this.threat_description,
                this.reported_by
            ]
        );
    }

    // Retrieve a single IOC by its specific value
    static fetchByValue(value) {
        return db.execute('SELECT * FROM iocs WHERE indicator_value = ?', [value]);
    }

    // Get the total count of all reported IOCs
    static getCount() {
        return db.execute("SELECT COUNT(id) AS count FROM iocs");
    }
};