module.exports = {
  sendResponse: (res, statusCode, data) => {
    res.status(statusCode).json({
      status: statusCode,
      message: statusCode === 200 ? "ok" : "internal_server_error",
      data
    });
    res.end();
  }
};
