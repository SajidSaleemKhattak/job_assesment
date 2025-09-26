const logger = require('./logger');

class ErrorHandler {
  constructor() {
    this.handleError = this.handleError.bind(this);
  }

  handleError(err, req, res, next) {
    const statusCode = err.statusCode || 500;
    const message = err.message || 'Internal Server Error';
    
    logger.error(`Error: ${message}`);
    logger.error(err.stack);
    
    res.status(statusCode).json({
      status: 'error',
      statusCode,
      message
    });
  }

  notFound(req, res, next) {
    const error = new Error(`Not Found - ${req.originalUrl}`);
    error.statusCode = 404;
    next(error);
  }

  asyncHandler(fn) {
    return (req, res, next) => {
      Promise.resolve(fn(req, res, next)).catch(next);
    };
  }
}

module.exports = new ErrorHandler();