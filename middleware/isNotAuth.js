module.exports = async function (req, res, next) {
  const token = req.cookies.access_token;
  if (token) {
    return res.status(401).json({ err: 'Already logged in' });
  }
  next();
};
