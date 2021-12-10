const express = require('express');
const router = express.Router();
const dbConn = require('../../models/db');
const isAuth = require('../../middleware/isAuth');
const isCompany = require('../../middleware/isCompany');

router.get('/', isAuth, isCompany, function (req, res, next) {
  dbConn.query(
    `SELECT * FROM companies WHERE id = ${req.user.id}`,
    function (err, result) {
      if (err) {
        console.log(err);
        return res.status(500).json({ err: 'something went wrong' });
      }
      res.render('pages/company', {
        result: result,
        variant: 'company',
      });
    }
  );
});

router.post('/', isAuth, isCompany, async function (req, res, next) {
  console.log(req.body);
  const {
    companyName,
    city,
    phone,
    activities,
    numberEmployees,
    siret,
    postalCode,
    website,
    contactName,
    password,
  } = req.body;
  const id = req.user.id;
  try {
    const salt = await bcrypt.genSalt(10);
    let hashedpassword = await bcrypt.hash(password, salt);
    dbConn.query(
      `UPDATE companies SET
      name = IF (LENGTH('${companyName}')>0,'${companyName}', name),
      password = IF (LENGTH('${password}')>0,'${hashedpassword}', password),
      city = IF (LENGTH('${city}')>0,'${city}', city),
      phone = IF (LENGTH('${phone}')>0,'${phone}', phone),
      activities = IF (LENGTH('${activities}')>0,'${activities}', activities),
      number_employees = IF (LENGTH('${numberEmployees}')>0,'${numberEmployees}', number_employees),
      siret = IF (LENGTH('${siret}')>0,'${siret}', activities),
      postal_code = IF (LENGTH('${postalCode}')>0,'${postalCode}', postal_code),
      website = IF (LENGTH('${website}')>0,'${website}', website),
      contact_name = IF (LENGTH('${contactName}')>0, '${contactName}', contact_name)
      WHERE id = ${id}`,
      function (err, result) {
        if (err) {
          console.log(err);
          return res.status(500).json({ err: 'something went wrong' });
        }
        res.status(200).json({ message: 'Change successful !' });
      }
    );
  } catch (e) {
    res.status(500).json({ err: 'something went wrong' });
  }
});

module.exports = router;
