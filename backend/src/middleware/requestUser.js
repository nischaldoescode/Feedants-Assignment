// request user
// this keeps auth simple for the assignment
export function requestUser(req, _res, next) {
  const headerUserId = req.get('x-user-id');
  req.userId = headerUserId?.trim() || null;
  next();
}
