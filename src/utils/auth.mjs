export const authenticate = (user, req) => {
  req.session.userId = user._id;
};

export const authenticated = (req) => {
  return req.session?.userId;
};

export const unauthenticate = async (req, res) => {
  await req.session.destroy();
  res.clearCookie('connect.sid', { path: '/' });
};
