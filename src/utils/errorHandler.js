const errorHandler = (err, req, res, next) => {
    res.status(err.statusCode || 400).json({
      status: "error",
      message: err.message,
      success: err.success
    });
};

export default errorHandler;