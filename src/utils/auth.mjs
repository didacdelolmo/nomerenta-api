export const authenticate = (user, req) => {
  req.session.userId = user._id;
};

export const authenticated = (req) => {
  return req.session?.userId;
};
