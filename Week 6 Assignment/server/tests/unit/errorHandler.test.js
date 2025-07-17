// errorHandler.js - Sample global error handler middleware
function errorHandler(err, req, res, next) {
  res.status(err.status || 500).json({
    error: err.message || 'Internal Server Error',
  });
}

module.exports = errorHandler;

// errorHandler.test.js - Unit test for error handler middleware
const errorHandler = require('./errorHandler');

describe('Global Error Handler Middleware', () => {
  it('should send error response with status and message', () => {
    const err = { status: 400, message: 'Bad Request' };
    const req = {};
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    const next = jest.fn();

    errorHandler(err, req, res, next);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ error: 'Bad Request' });
  });

  it('should default to 500 and generic message if not provided', () => {
    const err = {};
    const req = {};
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    const next = jest.fn();

    errorHandler(err, req, res, next);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ error: 'Internal Server Error' });
  });
}); 