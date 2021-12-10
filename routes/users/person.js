const express = require('express');
const router = express.Router();
const dbConn = require('../../models/db');
const isAuth = require('../../middleware/isAuth');
const isPerson = require('../../middleware/isPerson');
const bcrypt = require('bcryptjs');

router.get('/', isAuth, isPerson, function (req, res, next) {
  dbConn.query(
    `SELECT * FROM people WHERE id = ${req.user.id}`,
    function (err, result) {
      res.render('pages/person', {
        result: result,
        variant: 'person',
      });
    }
  );
});

router.post('/', isAuth, isPerson, async function (req, res, next) {
  const {
    lastName,
    firstName,
    birthDate,
    phone,
    address,
    postalCode,
    website,
    gender,
    password,
  } = req.body;

  const id = req.user.id;
  try {
    const salt = await bcrypt.genSalt(10);
    let hashedpassword = await bcrypt.hash(password, salt);
    dbConn.query(
      `UPDATE people SET 
      name = IF (LENGTH("${lastName}")>0,"${lastName}", name),
      password = IF (LENGTH("${password}")>0,"${hashedpassword}", password),
      first_name = IF (LENGTH('${firstName}')>0,'${firstName}', name),
      birth_date = IF (LENGTH('${birthDate}')>0, '${birthDate}', birth_date),
      phone = IF (LENGTH('${phone}')>0, '${phone}', phone),
      address = IF (LENGTH('${address}')>0, '${address}', address),
      postal_code = IF (LENGTH('${postalCode}')>0, '${postalCode}', postal_code),
      website = IF (LENGTH('${website}')>0, '${website}', website),
      gender = IF (LENGTH('${gender}')>0, '${gender}', gender)
      WHERE id = ${id}`,
      function (err, result) {
        //console.log(result);
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

router.post('/cv', isAuth, isPerson, async function (req, res, next) {
  if (!req.files) {
    return res.status(500).json({ err: 'no file detected !' });
  }
  const id = req.user.id;
  const cvFile = req.files.cv;
  const uploadPath = `upload/people/${id}/${cvFile.name}`;
  await cvFile.mv(uploadPath, function (err) {
    if (err) return res.status(500).json({ err: 'something went wrong' });
    try {
      dbConn.query(
        `UPDATE people SET cv = ? WHERE id = ${id}`,
        `/people/${id}/${cvFile.name}`,
        function (err, result) {
          if (err) console.log(err);
          res.status(200).json({ message: 'Successfully uploaded CV !' });
        }
      );
    } catch (e) {
      res.status(500).json({ err: 'something went wrong' });
    }
  });
});

router.post('/picture', isAuth, isPerson, async function (req, res, next) {
  if (!req.files) {
    return res.status(500).json({ err: 'no file detected !' });
  }
  const id = req.user.id;
  const pictureFile = req.files.picture;
  const uploadPath = `upload/people/${id}/${pictureFile.name}`;
  await pictureFile.mv(uploadPath, function (err) {
    if (err) return res.status(500).json({ err: err });
    try {
      dbConn.query(
        `UPDATE people SET picture = ? WHERE id = ${id}`,
        `/people/${id}/${pictureFile.name}`,
        function (err, result) {
          if (err) console.log(err);
          res.status(200).json({ message: 'Successfully uploaded picture !' });
        }
      );
    } catch (e) {
      res.status(500).json({ err: 'something went wrong' });
    }
  });
});

module.exports = router;
