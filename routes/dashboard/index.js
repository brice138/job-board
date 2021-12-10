const express = require('express');
const router = express.Router();
const dbConn = require('../../models/db');
const jwt = require('jsonwebtoken');

router.get('/', function (req, res, next) {
  let variant = 'unlogged';
  if (req.cookies.access_token) {
    isLogged = true;
    const token = req.cookies.access_token;
    const decoded = jwt.verify(token, process.env.TOKEN_SECRET);
    variant = decoded.user.role;
  }

  //console.log(isLogged, isCompany);

  dbConn.query(
    `SELECT advertisements.id, name, title, date, contract_type, location FROM advertisements
    INNER JOIN
    companies ON advertisements.company_id = companies.id WHERE published="1"`,
    (err, rows) => {
      //console.log(rows);
      if (err) {
        return res.status(500).json({ msg: 'something went wrong' });
      }
      res.render('pages/index', {
        variant: variant,
        rows: rows,
      });
    }
  );
});

router.get('/ad/:id', function (req, res, next) {
  dbConn.query(
    `SELECT description, salary FROM advertisements WHERE id="${req.params.id}"`,
    (err, rows) => {
      //console.log(rows);
      if (err) {
        console.log(err);
        return res.status(500).json({ msg: 'something went wrong' });
      }
      res
        .status(200)
        .json({ description: rows[0].description, salary: rows[0].salary });
    }
  );
});

module.exports = router;

//router.get('/search', function (res, res, next) {});
