// const ErrorHandler = require('../utils/errorHandler');

// module.exports = (err, req, res, next) => {
//   // Wrong Mongodb Id error
//   if (err.name === 'castError') {
//     const message = `Resource Not Found. Invalid ${err.path}`;
//     err = new ErrorHandler(message, 400);
//   }

//   err.statusCode = err.statusCode || 500;
//   err.message = err.message || 'Internal Server Error';

//   //mongoose duplicate key error
//   if (err.code === 11000) {
//     const message = `Duplicate ${Object.keys(err.keyValue)} Entered`;
//     err = new ErrorHandler(message, 400);
//   }

//   //Wrong JWT error
//   if (err.name === 'jsonWebTokenError') {
//     const message = 'JSON web Token is invalid, Try again';
//     err = new ErrorHandler(message, 400);
//   }

//   //JWT expire error

//   if (err.name === 'TokenExpiredError') {
//     const message = 'JSON web Token is Expired, Try again';
//     err = new ErrorHandler(message, 400);
//   }

//   res.status(err.statusCode).json({
//     success: false,
//     // error: err.stack,
//     message: err.message,
//   });
// };

const ErrorHandler = require('../utils/errorhandler');

module.exports = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.message = err.message || 'Internal Server Error';

  // Wrong Mongodb Id error
  if (err.name === 'CastError') {
    const message = `Resource not found. Invalid: ${err.path}`;
    err = new ErrorHandler(message, 400);
  }

  // Mongoose duplicate key error
  if (err.code === 11000) {
    const message = `Duplicate ${Object.keys(err.keyValue)} Entered`;
    err = new ErrorHandler(message, 400);
  }

  // Wrong JWT error
  if (err.name === 'JsonWebTokenError') {
    const message = `Json Web Token is invalid, Try again `;
    err = new ErrorHandler(message, 400);
  }

  // JWT EXPIRE error
  if (err.name === 'TokenExpiredError') {
    const message = `Json Web Token is Expired, Try again `;
    err = new ErrorHandler(message, 400);
  }

  res.status(err.statusCode).json({
    success: false,
    message: err.message,
  });
};
