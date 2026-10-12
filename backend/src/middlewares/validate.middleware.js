import { ApiError } from '../utils/apiError.js';

const formatIssues = (error) =>
  error.issues.map((issue) => ({
    field: issue.path.join('.'),
    message: issue.message,
  }));

export const validateBody = (schema) => (req, res, next) => {
  const result = schema.safeParse(req.body ?? {});

  if (!result.success) {
    return next(new ApiError(400, 'Validation failed', formatIssues(result.error)));
  }

  req.body = result.data;
  next();
};

export const validateQuery = (schema) => (req, res, next) => {
  const result = schema.safeParse(req.query);

  if (!result.success) {
    return next(new ApiError(400, 'Invalid query parameters', formatIssues(result.error)));
  }

  res.locals.query = result.data;
  next();
};

export const validateParams = (schema) => (req, res, next) => {
  const result = schema.safeParse(req.params);

  if (!result.success) {
    return next(new ApiError(400, 'Invalid request parameters', formatIssues(result.error)));
  }

  res.locals.params = result.data;
  next();
};
