module.exports = async function (req, res, next) {
  console.log(req.user.role);
  if (req.user.role != 'person' && req.user.role != 'admin') {
    return res.status(401).json({ err: 'forbidden' });
  }
  next();
};
