const express = require('express');
const router = express.Router();
const dbConn = require('../../models/db');
const isAuth = require('../../middleware/isAuth');
const isCompany = require('../../middleware/isCompany');
const isAuthor = require('../../middleware/isCompanyAuthor');

router.delete(
  '/:id',
  isAuth,
  isCompany,
  isAuthor,
  async function (req, res, next) {
    try {
      dbConn.query(
        `DELETE FROM advertisements
        WHERE id = ${req.params.id}`,
        function (err, result) {
          if (err) {
            console.log(err);
            return res.status(500).json({ err: 'something went wrong' });
          }
          console.log(result);
          return res
            .status(200)
            .json({ message: 'Advertisement deleted with success !' });
        }
      );
    } catch (e) {
      return res.status(500).json({ err: 'something went wrong' });
    }
  }
);

module.exports = router;
