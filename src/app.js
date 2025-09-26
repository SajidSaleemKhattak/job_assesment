const express = require('express');
const cors = require('cors');
const path = require('path');
const config = require('./config/config');
const logger = require('./utils/logger');
const errorHandler = require('./utils/errorHandler');

// Import routes 
const jobRoutes = require('./routes/jobRoutes');
const candidateRoutes = require('./routes/candidateRoutes');
const applicationRoutes = require('./routes/applicationRoutes');

// Initialize express app
const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Static files
app.use(express.static(path.join(__dirname, 'views')));

// Routes
app.use('/api/jobs', jobRoutes);
app.use('/api/candidates', candidateRoutes);
app.use('/api/applications', applicationRoutes);

// Basic home route
app.get('/', (req, res) => {
  res.send(`
    <h1>Job Automation System</h1>
    <p>API endpoints:</p>
    <ul>
      <li><a href="/api/jobs">/api/jobs</a> - Get all jobs</li>
      <li><a href="/api/candidates">/api/candidates</a> - Get all candidates</li>
      <li><a href="/api/applications/matches">/api/applications/matches</a> - Get all matches</li>
    </ul>
  `);
});

// Error handling
app.use(errorHandler.notFound);
app.use(errorHandler.handleError);

// Start server
const PORT = config.port;
app.listen(PORT, () => {
  logger.info(`Server running on port ${PORT}`);
});

module.exports = app;