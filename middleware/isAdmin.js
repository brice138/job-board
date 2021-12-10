module.exports = async function (req, res, next) {
  if (req.user.role != 'admin') {
    return res.status(401).json({ err: 'forbidden' });
  }
  next();
};
