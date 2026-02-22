const db = require('../utils/database');

// Model representing an APT entity mapped to the `apts` table 
module.exports = class APT {
    constructor(apt_name, actor_type, origin_country, confidence_level, target_sectors, primary_motivation, reported_by) {
        this.apt_name = apt_name;
        this.actor_type = actor_type;
        this.origin_country = origin_country;
        this.confidence_level = confidence_level;
        this.target_sectors = target_sectors;
        this.primary_motivation = primary_motivation;
        this.reported_by = reported_by;
    }

    // Persists a new APT record using a parameterized query (prevents SQL injection) 
    save() {
        return db.execute(
            'INSERT INTO apts (apt_name, actor_type, origin_country, confidence_level, target_sectors, primary_motivation, reported_by) VALUES (?, ?, ?, ?, ?, ?, ?)',
            [
                this.apt_name,
                this.actor_type,
                this.origin_country,
                this.confidence_level,
                this.target_sectors,
                this.primary_motivation,
                this.reported_by
            ]
        );
    }
    
    // Returns total number of APT records ( for dashboard counters) 
    static getCount() {
    return db.execute("SELECT COUNT(id) AS count FROM apts");
    }

    // Retrieves all APT records from DB 
   static fetchAll() {
  return db.execute('SELECT * FROM apts');
}
}
