const express = require('express');
const router = express.Router();
const dbConn = require('../../models/db');
const isAuth = require('../../middleware/isAuth');
const isCompany = require('../../middleware/isCompany');
const moment = require('moment');

router.get('/', isAuth, isCompany, function (req, res, next) {
  res.render('pages/createoffer', { variant: 'company' });
});

router.post('/', isAuth, isCompany, async function (req, res, next) {
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
      `INSERT INTO advertisements (title, salary, description, location, contract_type, date, company_id, published)
      VALUES 
        (
          "${title}",
          "${salary}",
          "${description}",
          "${location}",
          "${contractType}",
          "${moment().format('YYYY-MM-DD  HH:mm:ss.000')}",
          "${req.user.id}",
          "${published}"
          )`,
      function (err, result) {
        if (err) {
          console.log(err);
          return res.status(500).json({ err: 'something went wrong' });
        }
        return res.status(200).json({ message: 'Job offer created !' });
      }
    );
  } catch (e) {
    res.status(500).json({ err: 'something went wrong' });
  }
});

module.exports = router;
