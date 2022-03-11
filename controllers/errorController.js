const AppError = require('./../utils/appError');

const handleCastErrorDB = (err) => {
  const message = `Invalid ${err.path} is ${err.value}.`;
  return new AppError(message, 400);
};

const handleDuplicateFields = (err) => {
  // const value = err.errmsg.match(/["'])(\\?.)*?\1/); // deprecated wala yung errmsg sa fields ng error gawa ni jonas
  const value = err.keyValue.name; // Experiment ako nakasolove

  const message = `Duplicate field value: "${value}". PLease use another value`;
  return new AppError(message, 400);
};

const handleValidationErrorDB = (err) => {
  const errors = Object.values(err.errors).map((el) => el.message);
  const message = `Invalid input data. ${errors.join('. ')}`;
  return new AppError(message, 400);
};

const handleJWTError = () =>
  new AppError('Invalid token. Please log in again!', 401);

const handleJWTExpiredError = () =>
  new AppError('Your token has expired! Please log in again', 401);

//////////////////// Method for response both development and production.
const sendErrorDev = (err, req, res) => {
  // A) API
  if (req.originalUrl.startsWith('/api')) {
    return res.status(err.statusCode).json({
      status: err.status,
      error: err,
      message: err.message,
      stack: err.stack,
    });
  }
  // B) RENDERED WEBSITE
  console.error('Error', err);
  return res.status(err.statusCode).render('error', {
    title: 'Something went wrong!',
    msg: err.message,
  });
};

const sendErrorProd = (err, req, res) => {
  // A) API
  if (req.originalUrl.startsWith('/api')) {
    // A) Operational, trusted error: send message to client
    if (err.isOperational) {
      return res.status(err.statusCode).json({
        status: err.status,
        message: err.message,
      });
    }
    // B) Programming or other unknown error: don't want leak error to clients
    // 1) Log error
    console.error('Error', err);
    // 2) Send a generic message
    return res.status(500).json({
      status: 'error',
      message: 'Something went very wrong!',
    });
  }
  // B) RENDERED WEBSIZTE
  // A) Operational, trusted error: send message to client
  if (err.isOperational) {
    return res.status(err.statusCode).render('error', {
      title: 'Something went wrong!',
      msg: err.message,
    });
  }
  // B) Programming or other unknown error: don't want leak error to clients
  // 1) Log error
  console.error('Error', err);
  // 2) Send a generic message
  return res.status(err.statusCode).render('error', {
    title: 'Something went wrong!',
    msg: 'Please try again later',
  });
};

module.exports = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  if (process.env.NODE_ENV === 'development') {
    sendErrorDev(err, req, res);
  } else if (process.env.NODE_ENV === 'production') {
    let error = { ...err };
    error.message = err.message;
    error.name = err.name;

    // Gagawing operational yung error
    if (error.name === 'CastError') error = handleCastErrorDB(error); // para sa cast error -- get tour
    if (error.code === 11000) error = handleDuplicateFields(error); // para sa duplicate fields  -- create tour
    if (error.name === 'ValidationError')
      // para sa validation error -- update tour
      error = handleValidationErrorDB(error);
    if (error.name === 'JsonWebTokenError') error = handleJWTError(); // para sa maling token o imbentong token
    if (error.name === 'TokenExpiredError')
      // para sa expired na token HAHAHA
      error = handleJWTExpiredError();

    sendErrorProd(error, req, res);
  }
};
