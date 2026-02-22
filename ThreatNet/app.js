const express = require('express');
const session = require('express-session');
const path = require('path');
const app = express();

app.set('view engine', 'ejs');

// Middleware for serving static files and parsing request bodies
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: true }));

// Configure session management with security settings
app.use(session({
    secret: "threatnet_research_secret_ervwcrevwe45t",
    saveUninitialized: false,
    resave: false 
}));

// Global middleware to pass session data to all rendered views
app.use((req, res, next) => {
    res.locals.isLoggedIn = req.session.isLoggedIn || false;
    res.locals.user = req.session.user || '';
    res.locals.firstName = req.session.firstName || '';
    res.locals.role = req.session.role || 'Guest';
    res.locals.points = req.session.points || 0;
    next();
});

// Import route modules and administrative controllers
const authRoutes = require('./routes/auth');
const adminController = require('./controllers/admin');
const adminRoutes = require('./routes/admin');
const iocRoutes = require('./routes/ioc');
const cveRoutes = require('./routes/cve');
const aptRoutes = require('./routes/apt');
const campaignRoutes = require('./routes/campaign');
const techniquesRoutes = require('./routes/techniques');

// Mount application routes and define the 404 fallback handler
app.use(authRoutes);
app.use(adminRoutes);
app.use(iocRoutes);
app.use(cveRoutes);
app.use(aptRoutes);
app.use(campaignRoutes);
app.use('/', techniquesRoutes);
app.use(adminController.get404);

// Initialize the server and listen for incoming traffic
app.listen(3000, '0.0.0.0', () => {
    console.log("ThreatNet is live and accessible at http://vmedu444.mtacloud.co.il:3000/");
});