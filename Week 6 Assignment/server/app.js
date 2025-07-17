// server/app.js - Main Express app with logging, error handler, and performance monitoring
const express = require('express');
const morgan = require('morgan');
const errorHandler = require('./tests/unit/errorHandler'); // Use the error handler from tests/unit for demonstration

const app = express();

// Middleware for JSON parsing
app.use(express.json());

// Performance monitoring and logging
app.use(morgan('dev'));

// Example route
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});

// Add your other routes here

// Global error handler (should be last)
app.use(errorHandler);

module.exports = app; 