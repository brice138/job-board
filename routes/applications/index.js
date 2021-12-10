const express = require('express');
const router = express.Router();
const dbConn = require('../../models/db');
const isAuth = require('../../middleware/isAuth');
const isPerson = require('../../middleware/isPerson');

router.get('/', isAuth, isPerson, function (req, res, next) {
  dbConn.query(
    `SELECT 
        title,
        name,
        location,
        salary,
        contract_type,
        description,
        message,
        advertisement_id,
        applied.id AS id,
        applied.date AS application_date,
        advertisements.date AS advertisement_date 
    FROM applied
    INNER JOIN
        advertisements ON applied.advertisement_id = advertisements.id
    INNER JOIN
        companies ON advertisements.company_id = companies.id
    WHERE people_id = ${req.user.id}`,
    (err, rows) => {
      //console.log(rows);
      if (err) {
        console.log(err);
        return res.status(500).json({ msg: 'something went wrong' });
      }
      res.render('pages/applications', {
        rows: rows,
        variant: 'person',
      });
    }
  );
});

module.exports = router;
