const express = require('express');
const router = express.Router();
const dbConn = require('../../models/db');
const isAuth = require('../../middleware/isAuth');
const isPerson = require('../../middleware/isPerson');
const isAuthor = require('../../middleware/isPersonAuthor');

router.get('/:id', isAuth, isPerson, isAuthor, function (req, res, next) {
  try {
    dbConn.query(
      `SELECT message, id FROM applied WHERE people_id = ${req.user.id} AND id = ${req.params.id}`,
      function (err, result) {
        if (err) {
          console.log(err);
          return res.status(500).json({ err: 'something went wrong' });
        }
        res.render('pages/updateApplication', {
          result: result,
          variant: 'person',
        });
      }
    );
  } catch (e) {
    return res.status(500).json({ err: 'something went wrong' });
  }
});

router.put('/:id', isAuth, isPerson, isAuthor, function (req, res, next) {
  const { message } = req.body;
  dbConn.query(
    `UPDATE applied
        SET
        message = "${message}"
        WHERE people_id = ${req.user.id} AND id = ${req.params.id}`,
    function (err, result) {
      if (err) {
        console.log(err);
        return res.status(500).json({ err: 'something went wrong' });
      }
      res.status(200).json({ message: 'Successfully updated application !' });
    }
  );
});

module.exports = router;
