const dbConn = require('../models/db');

module.exports = async function (req, res, next) {
  try {
    dbConn.query(
      `SELECT people_id FROM applied WHERE applied.id = ${req.params.id}`,
      function (err, result) {
        if (err) {
          console.log(err);
          res.status(500).json({ err: 'something went wrong' });
        }
        if (result[0].people_id != req.user.id) {
          return res.status(401).json({ message: 'forbidden' });
        }
        next();
      }
    );
  } catch (e) {
    return res.status(401).json({ message: 'forbidden' });
  }
};
