const express = require('express');
const router = express.Router();
const dbConn = require('../../models/db');
const jwt = require('jsonwebtoken');
const isAuth = require('../../middleware/isAuth');
const isPerson = require('../../middleware/isPerson');
const moment = require('moment');

router.get('/:id', (req, res, next) => {
  let isLogged = false;
  if (req.cookies.access_token) {
    //console.log(req.cookies.access_token);
    isLogged = true;
    const token = req.cookies.access_token;
    const decoded = jwt.verify(token, process.env.TOKEN_SECRET);
    if (decoded.user.role !== 'person' && decoded.user.role !== 'admin') {
      return res.status(401).json({ message: 'Forbidden' });
    }
    dbConn.query(
      `SELECT name, first_name, email, phone FROM people WHERE id = '${decoded.user.id}'`,
      function (err, result) {
        if (err) {
          console.log(err);
          return res.status(500).json({ msg: 'something went wrong' });
        }
        return res.render('pages/apply', {
          isLogged: isLogged,
          result: result,
          adId: req.params.id,
          variant: 'person',
        });
      }
    );
  } else {
    return res.render('pages/apply', {
      isLogged: isLogged,
      adId: req.params.id,
      variant: 'unlogged',
    });
  }
});

router.post('/:id', async function (req, res, next) {
  const advertisementId = req.params.id;
  let newId = 0;
  const {
    email,
    lastName,
    firstName,
    birthDate,
    phone,
    address,
    postalCode,
    website,
    gender,
    message,
  } = req.body;
  //console.log(req.body);
  try {
    await new Promise(function (resolve, reject) {
      dbConn.query(
        `INSERT INTO people (email, name, password, first_name, birth_date, phone, address, postal_code, website, gender) 
        SELECT "${email}", "${lastName}", "", "${firstName}", "${birthDate}", "${phone}", "${address}", "${postalCode}", "${website}", "${gender}" FROM DUAL WHERE NOT EXISTS(
        (SELECT 1 FROM people WHERE email = '${email}') 
        UNION 
        (SELECT 1 FROM companies WHERE email = '${email}')) LIMIT 1 `,
        async function (err, result) {
          if (err) {
            console.log(err);
            return reject(
              res.status(500).json({ err: 'something went wrong' })
            );
          }
          //console.log(result);
          if (result.affectedRows === 0) {
            return reject(
              res.status(409).json({ err: 'Email already in use' })
            );
          }
          return resolve((newId = result.insertId));
        }
      );
    });
    if (newId !== 0) {
      if (req.files) {
        const cvFile = req.files.cv;
        const uploadPath = `upload/people/${newId}/${cvFile.name}`;
        await cvFile.mv(uploadPath, function (err) {
          if (err) {
            return res.status(500).json({ err: 'something went wrong' });
          }
        });
        await new Promise(function (resolve, reject) {
          dbConn.query(
            `UPDATE people SET cv = ? WHERE id=${newId}`,
            `/people/${newId}/${cvFile.name}`,
            function (err, result) {
              if (err) {
                console.log(err);
                return reject(
                  res.status(500).json({ err: 'something went wrong' })
                );
              }
              return resolve();
            }
          );
        });
      }
      await new Promise(function (resolve, reject) {
        dbConn.query(
          `INSERT INTO applied (message, people_id, advertisement_id, date)
          SELECT "${message}",
            "${newId}",
            "${advertisementId}",
            "${moment().format('YYYY-MM-DD  HH:mm:ss.000')}"`,
          function (err, result) {
            if (err) {
              console.log(err);
              return reject(
                res.status(200).json({ err: 'something went wrong' })
              );
            }
            return resolve(
              res.status(200).json({
                message:
                  'Successfully applied, please login for further details',
              })
            );
          }
        );
      });
    }
  } catch (e) {
    return e;
  }
});

router.post('/auth/:id', isAuth, isPerson, (req, res, next) => {
  const { message } = req.body;
  const advertisementId = req.params.id;
  const personId = req.user.id;
  dbConn.query(
    `INSERT INTO applied (message, people_id, advertisement_id, date)
    SELECT "${message}",
      "${personId}",
      "${advertisementId}",
      "${moment().format('YYYY-MM-DD  HH:mm:ss.000')}"
    WHERE NOT EXISTS
    (SELECT 1 FROM applied WHERE advertisement_id = ${advertisementId} AND people_id = ${personId})`,
    function (err, result) {
      if (err) {
        return res.status(500).json({ err: 'something went wrong' });
      }
      if (result.affectedRows === 0) {
        return res.status(409).json({ err: 'You already applied to this ad' });
      }
      res.status(200).json({ message: 'Applied successfully !' });
    }
  );
});

module.exports = router;
