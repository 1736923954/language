// 成功响应
const success = (res, data = null, message = 'Success', statusCode = 200) => {
  return res.status(statusCode).json({
    code: statusCode,
    message,
    data,
    timestamp: new Date().toISOString(),
  });
};

// 错误响应
const error = (res, message = 'Error', statusCode = 500, data = null) => {
  return res.status(statusCode).json({
    code: statusCode,
    message,
    data,
    timestamp: new Date().toISOString(),
  });
};

// 分页响应
const paginated = (res, data, total, page, limit, message = 'Success') => {
  return res.status(200).json({
    code: 200,
    message,
    data,
    pagination: {
      total,
      page: parseInt(page),
      limit: parseInt(limit),
      pages: Math.ceil(total / limit),
    },
    timestamp: new Date().toISOString(),
  });
};

module.exports = {
  success,
  error,
  paginated,
};
