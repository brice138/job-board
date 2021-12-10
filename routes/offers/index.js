const express = require('express');
const router = express.Router();
const dbConn = require('../../models/db');
const isAuth = require('../../middleware/isAuth');
const isCompany = require('../../middleware/isCompany');
const isAuthor = require('../../middleware/isCompanyAuthor');

router.get('/', isAuth, isCompany, async function (req, res, next) {
  try {
    dbConn.query(
      `SELECT
            title,
            description,
            salary,
            location,
            advertisements.date AS date,
            published,
            contract_type,
            advertisements.id AS id,
            GROUP_CONCAT(applied.id) AS applicationId,
            GROUP_CONCAT(applied.people_id) AS peopleId,
            GROUP_CONCAT(people.name) as peopleName,
            GROUP_CONCAT(people.first_name) as peopleFirstName,
            GROUP_CONCAT(applied.message) as applicationMessage
        FROM
          advertisements
        LEFT JOIN applied ON applied.advertisement_id = advertisements.id
          LEFT JOIN people ON people.id = applied.people_id
        WHERE
          company_id = ${req.user.id}
        GROUP BY
          id`,
      (err, rows) => {
        //console.log(rows);
        if (err) {
          console.log(err);
          return res.status(500).json({ err: 'something went wrong' });
        }
        //console.log(rows);
        res.render('pages/offers', {
          rows: rows,
          variant: 'company',
        });
      }
    );
  } catch (e) {
    return res.status(200).json({ err: 'something went wrong' });
  }
});

router.get(
  '/viewApplicants/:id',
  isAuth,
  isCompany,
  isAuthor,
  async function (req, res, next) {
    dbConn.query(
      `SELECT * FROM applied
      LEFT JOIN people ON people_id = people.id
      WHERE advertisement_id = ${req.params.id}`,
      function (err, rows) {
        if (err) {
          console.log(err);
          return res.status(500).json({ err: 'something went wrong' });
        }
        res.render('pages/viewApplicants', {
          rows: rows,
          variant: 'company',
        });
      }
    );
  }
);

module.exports = router;
