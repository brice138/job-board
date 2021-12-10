const express = require('express');
const jwt = require('jsonwebtoken');
const router = express.Router();
const dbConn = require('../../models/db');
const bcrypt = require('bcryptjs');
const isNotAuth = require('../../middleware/isNotAuth');

router.get('/', isNotAuth, function (req, res, next) {
  res.render('pages/login-register-form', {
    isLoginPage: true,
    script: 'login',
    submitValue: 'log In',
    variant: 'unlogged',
  });
});

router.post('/', isNotAuth, async function (req, res, next) {
  const { email, password } = req.body;

  try {
    dbConn.query(
      `(SELECT 'people' AS tableName, email, password, id FROM people WHERE email="${email}" )
    UNION
    (SELECT 'companies' AS tableName, email, password, id FROM companies where email="${email}")`,
      async function (err, result) {
        if (err) {
          return res.status(500).json({ msg: 'something went wrong' });
        }
        if (result.length === 0) {
          return res.status(422).send({ err: 'unknown user' });
        }

        let role = 'person';
        if (result[0].tableName === 'companies') {
          role = 'company';
        }
        if (
          email === 'jerome.seccia@gmail.com' ||
          email === 'bvillon138@gmail.com'
        ) {
          role = 'admin';
        }
        const checked = await bcrypt.compare(password, result[0].password);

        if (checked) {
          let payload = {
            user: {
              email: result[0].email,
              id: result[0].id,
              role: role,
            },
          };
          let token = jwt.sign(payload, process.env.TOKEN_SECRET, {
            expiresIn: 3600,
          });
          //console.log(res.body);
          //console.log('yes ?');
          res
            .cookie('access_token', token, {
              httpOnly: true,
              samesite: 'strict',
              maxAge: 3600000,
              secure: true,
            })
            .status(200)
            .json({ message: 'Logged in successfully !!' });
        } else {
          res.status(422).json({ err: 'wrong password' });
        }
      }
    );
  } catch (e) {
    console.log(e);
    res.status(422).json({ err: 'something went wrong' });
  }
});

module.exports = router;
