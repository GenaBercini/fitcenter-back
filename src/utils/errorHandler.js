const errorHandler = (err, req, res, next) => {

  const statusCode = err.statusCode || 500;

  res.status(statusCode).json({
    status: "error",
    success: err.success || false,
    message: err.message || "Error interno del servidor",
  });
};

export default errorHandler