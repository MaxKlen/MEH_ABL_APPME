const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const session = require('express-session');
const morgan = require('morgan');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

// Initialize Express app
const app = express();
const PORT = process.env.PORT || 3000;

// Set up logging
app.use(morgan('dev'));

// Configure view engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Middleware
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(session({
  secret: process.env.SESSION_SECRET || 'abl-group-services-catalog-secret',
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false }
}));

// CORS middleware for development
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  if (req.method === 'OPTIONS') {
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH');
    return res.status(200).json({});
  }
  next();
});

// Routes (will be implemented later)
app.get('/', (req, res) => {
  res.render('index', { 
    title: 'ABL Group Services Catalog',
    activeNav: 'home'
  });
});

// Error handling middleware
app.use((req, res, next) => {
  res.status(404).render('error', {
    title: 'Page Not Found',
    message: 'The page you are looking for does not exist.',
    error: { status: 404 }
  });
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).render('error', {
    title: 'Error',
    message: err.message,
    error: process.env.NODE_ENV === 'development' ? err : {}
  });
});

// Start server - explicitly bind to 0.0.0.0 to allow external access
app.listen(PORT, '0.0.0.0', () => {
  console.log(`ABL Group Services Catalog running on port ${PORT}`);
  console.log(`Server is bound to all network interfaces (0.0.0.0)`);
  console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
});

module.exports = app; // For testing
