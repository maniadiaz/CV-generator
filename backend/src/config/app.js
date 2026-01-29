const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const compression = require('compression');
const corsConfig = require('./cors');
const errorHandler = require('../middlewares/errorHandler');

const app = express();

// Middlewares de seguridad
app.use(helmet());
app.use(cors(corsConfig));

// Middlewares de parseo
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Logging
app.use(morgan('dev'));

// Compresión
app.use(compression());

// Health check
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

// Rutas principales
app.use('/api', require('../routes'));

// 404 Handler
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: 'Endpoint not found'
  });
});

// Error Handler (debe ser el último middleware)
app.use(errorHandler);

module.exports = app;
