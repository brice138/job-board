const express = require('express');
const router = express.Router();
const dbConn = require('../../models/db');
const isAuth = require('../../middleware/isAuth');
const isCompany = require('../../middleware/isCompany');
const isAuthor = require('../../middleware/isCompanyAuthor');

router.get(
  '/:id',
  isAuth,
  isCompany,
  isAuthor,
  async function (req, res, next) {
    try {
      dbConn.query(
        `SELECT * FROM advertisements WHERE company_id = ${req.user.id} AND id = ${req.params.id}`,
        function (err, result) {
          if (err) {
            console.log(err);
            return res.status(500).json({ err: 'something went wrong' });
          }
          res.render(`pages/updateOffer`, {
            result: result,
            variant: 'company',
          });
        }
      );
    } catch (e) {
      return res.status(500).json({ err: 'something went wrong' });
    }
  }
);

router.put('/:id', isAuth, isCompany, isAuthor, function (req, res, next) {
  const { title, salary, description, location, contractType, isVisible } =
    req.body;
  let published = 0;

  if (isVisible) {
    published = 1;
  } else {
    published = 0;
  }

  try {
    dbConn.query(
      `UPDATE advertisements
        SET 
        title = '${title}',
        salary = '${salary}',
        description = '${description}',
        location = '${location}',
        contract_type = '${contractType}',
        published = '${published}'
        WHERE id = ${req.params.id}`,
      function (err, result) {
        if (err) {
          console.log(err);
          return res.status(500).json({ err: 'something went wrong' });
        }
        res
          .status(200)
          .json({ message: 'Successfully updated advertisement !' });
      }
    );
  } catch (e) {
    return res.status(500).json({ err: 'something went wrong' });
  }
});

module.exports = router;
