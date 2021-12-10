const express = require('express');
const router = express.Router();
const dbConn = require('../../models/db');
const bcrypt = require('bcryptjs');
const isNotAuth = require('../../middleware/isNotAuth');

router.get('/', isNotAuth, function (req, res, next) {
  res.render('pages/login-register-form', {
    isLoginPage: false,
    script: 'register',
    submitValue: 'Register',
    variant: 'unlogged',
  });
});

router.post('/candidate', isNotAuth, async function (req, res, next) {
  const { email, password } = req.body;
  try {
    const salt = await bcrypt.genSalt(10);
    let hashedpassword = await bcrypt.hash(password, salt);
    dbConn.query(
      `INSERT INTO people (email, password) SELECT "${email}", "${hashedpassword}" FROM DUAL
      WHERE NOT EXISTS
      ((SELECT 1 FROM people WHERE email = "${email}") 
      UNION
      (SELECT 1 FROM companies WHERE email = "${email}"))
      LIMIT 1 `,
      function (err, result) {
        if (err) {
          console.log(err);
          return res.status(500).json({ msg: 'something went wrong' });
        }
        if (result.affectedRows === 0) {
          return res.status(409).json({ err: 'email already in use' });
        }
        return res.status(200).json({ message: 'Registered with success !' });
      }
    );
  } catch (e) {
    console.log(e);
    res.status(500).json({ err: 'Something went wrong' });
  }
});

router.post('/company', isNotAuth, async function (req, res, next) {
  const { email, password } = req.body;

  try {
    const salt = await bcrypt.genSalt(10);
    let hashedpassword = await bcrypt.hash(password, salt);
    dbConn.query(
      `INSERT INTO companies (email, password) 
      SELECT "${email}", "${hashedpassword}" FROM DUAL WHERE NOT EXISTS(
      (SELECT 1 FROM people WHERE email = '${email}') 
      UNION 
      (SELECT 1 FROM companies WHERE email = '${email}')) LIMIT 1 `,
      function (err, result) {
        if (err) {
          return res.status(500).json({ err: 'something went wrong' });
        }
        if (result.affectedRows === 0) {
          return res.status(409).json({ err: 'email already in use' });
        }
        return res.status(200).json({ message: 'Registered with success !' });
      }
    );
  } catch (e) {
    console.log(e);
    res.status(500).json({ err: 'Something went wrong' });
  }
});

module.exports = router;
