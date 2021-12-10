const express = require('express');
const router = express.Router();
const dbConn = require('../../models/db');
const isAuth = require('../../middleware/isAuth');

router.delete('/', isAuth, async function (req, res, next) {
  const email = req.user.email;
  const id = req.user.id;
  const accountType = req.user.role;
  try {
    if (accountType === 'person') {
      dbConn.query(
        `DELETE FROM people where email='${email}' AND id='${id}'`,
        function (err, result) {
          if (err) {
            console.log(err);
            return res.status(500).json({ err: 'something went wrong' });
          }
          return res
            .clearCookie('access_token')
            .status(200)
            .json({ message: 'Account deleted successfully !' });
        }
      );
    } else if (accountType === 'company') {
      dbConn.query(
        `DELETE from companies where email='${email}' AND id='${id}'`,
        function (err, result) {
          if (err) {
            console.log(err);
            return res.status(500).json({ err: 'something went wrong' });
          }
          return res
            .clearCookie('access_token')
            .status(200)
            .json({ message: 'Account deleted successfully !' });
        }
      );
    } else if (accountType === 'admin') {
      return res
        .status(403)
        .json({
          err: 'Do you really want to delete your admin account this way ?',
        });
    }
  } catch (e) {
    return res.status(500).json({ err: 'something went wrong' });
  }
});

module.exports = router;
