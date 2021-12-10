const express = require('express');
const router = express.Router();
const dbConn = require('../../models/db');
const moment = require('moment');
const bcrypt = require('bcryptjs');
const isAuth = require('../../middleware/isAuth');
const isAdmin = require('../../middleware/isAdmin');

router.get('/', isAuth, isAdmin, async function (req, res, next) {
  let peopleRows;
  let companiesRows;
  let advertisementsRows;
  let appliedRows;
  await new Promise(function (resolve, reject) {
    dbConn.query(`SELECT * FROM people ORDER BY id`, function (err, rows) {
      if (err) {
        console.log(err);
        return reject(res.status(500).json({ err: 'something went wrong' }));
      }
      return resolve((peopleRows = rows));
    });
  });

  await new Promise(function (resolve, reject) {
    dbConn.query(`SELECT * FROM companies ORDER BY id`, function (err, rows) {
      if (err) {
        console.log(err);
        return reject(res.status(500).json({ err: 'something went wrong' }));
      }
      return resolve((companiesRows = rows));
    });
  });

  await new Promise(function (resolve, reject) {
    dbConn.query(
      `SELECT *, advertisements.id as id FROM advertisements LEFT JOIN companies ON advertisements.company_id = companies.id ORDER BY advertisements.id`,
      function (err, rows) {
        if (err) {
          console.log(err);
          return reject(res.status(500).json({ err: 'something went wrong' }));
        }
        return resolve((advertisementsRows = rows));
      }
    );
  });

  await new Promise(function (resolve, reject) {
    dbConn.query(
      `SELECT *, applied.id as id FROM applied 
      LEFT JOIN advertisements ON applied.advertisement_id = advertisements.id 
      LEFT JOIN people on applied.people_id = people.id
      ORDER BY applied.id`,
      function (err, rows) {
        if (err) {
          console.log(err);
          return reject(res.status(500).json({ err: 'something went wrong' }));
        }
        return resolve((appliedRows = rows));
      }
    );
  });
  res.render('pages/admin', {
    peopleRows: peopleRows,
    companiesRows: companiesRows,
    advertisementsRows: advertisementsRows,
    appliedRows: appliedRows,
    variant: 'admin',
  });
});

router.post('/person/create', isAuth, isAdmin, async function (req, res, next) {
  console.log(req.body);
  //console.log(req.files);
  const {
    email,
    password,
    lastName,
    firstName,
    birthDate,
    phone,
    address,
    postalCode,
    website,
    gender,
  } = req.body;
  let newId = 0;
  try {
    const salt = await bcrypt.genSalt(10);
    let hashedpassword = await bcrypt.hash(password, salt);
    await new Promise(function (resolve, reject) {
      dbConn.query(
        `INSERT INTO people (email, name, password, first_name, birth_date, phone, address, postal_code, website, gender) 
        SELECT
          "${email}",
          "${lastName}",
          "${hashedpassword}",
          "${firstName}",
          IF (LENGTH("${birthDate}")>0, "${birthDate}", NULL),
          "${phone}",
          "${address}",
          "${postalCode}",
          "${website}",
          "${gender}" 
        FROM DUAL WHERE NOT EXISTS(
        (SELECT 1 FROM people WHERE email = '${email}') 
        UNION 
        (SELECT 1 FROM companies WHERE email = '${email}')) LIMIT 1`,
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
        if (req.files.cv) {
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
        console.log(req.files.picture);
        if (req.files.picture) {
          const pictureFile = req.files.picture;
          const uploadPath = `upload/people/${newId}/${pictureFile.name}`;
          await pictureFile.mv(uploadPath, function (err) {
            if (err) {
              return res.status(500).json({ err: 'something went wrong' });
            }
          });

          await new Promise(function (resolve, reject) {
            dbConn.query(
              `UPDATE people SET picture = ? WHERE id=${newId}`,
              `/people/${newId}/${pictureFile.name}`,
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
      }
      return res
        .status(200)
        .json({ message: 'Succesfully created new person !' });
    }
  } catch (e) {
    return e;
  }
});

router.put(
  '/person/update/:id',
  isAuth,
  isAdmin,
  async function (req, res, next) {
    const {
      email,
      password,
      lastName,
      firstName,
      birthDate,
      phone,
      address,
      postalCode,
      website,
      gender,
    } = req.body;

    const id = req.params.id;
    const salt = await bcrypt.genSalt(10);
    let hashedpassword = await bcrypt.hash(password, salt);
    try {
      if (req.files) {
        if (req.files.cv) {
          const cvFile = req.files.cv;
          const uploadPath = `upload/people/${id}/${cvFile.name}`;
          await cvFile.mv(uploadPath, function (err) {
            if (err) {
              return res.status(500).json({ err: 'something went wrong' });
            }
          });
          await new Promise(function (resolve, reject) {
            dbConn.query(
              `UPDATE people SET cv = ? WHERE id=${id}`,
              `/people/${id}/${cvFile.name}`,
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
        if (req.files.picture) {
          const pictureFile = req.files.picture;
          const uploadPath = `upload/people/${id}/${pictureFile.name}`;
          await pictureFile.mv(uploadPath, function (err) {
            if (err) {
              return res.status(500).json({ err: 'something went wrong' });
            }
          });
          await new Promise(function (resolve, reject) {
            dbConn.query(
              `UPDATE people SET picture = ? WHERE id=${id}`,
              `/people/${id}/${pictureFile.name}`,
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
      }
      await new Promise(function (resolve, reject) {
        dbConn.query(
          `UPDATE people 
        SET name = IF (LENGTH("${lastName}")>0,"${lastName}", name),
        email = IF (LENGTH('${email}')>0, '${email}', email),
            password = IF (LENGTH('${password}')>0, '${hashedpassword}', password),
            first_name = IF (LENGTH('${firstName}')>0,'${firstName}', name),
            birth_date = IF (LENGTH('${birthDate}')>0, '${birthDate}', birth_date),
            phone = IF (LENGTH('${phone}')>0, '${phone}', phone),
            address = IF (LENGTH('${address}')>0, '${address}', address),
            postal_code = IF (LENGTH('${postalCode}')>0, '${postalCode}', postal_code),
            website = IF (LENGTH('${website}')>0, '${website}', website),
            gender = IF (LENGTH('${gender}')>0, '${gender}', gender)
        WHERE id = ${id}`,
          async function (err, result) {
            if (err) {
              console.log(err);
              return reject(
                res.status(500).json({ err: 'something went wrong' })
              );
            }
            console.log(result);

            return resolve(
              res
                .status(200)
                .json({ message: 'Successfully updated person profile !' })
            );
          }
        );
      });
      return;
    } catch (e) {
      return e;
    }
  }
);

router.delete(
  '/person/destroy/:id',
  isAuth,
  isAdmin,
  function (req, res, next) {
    dbConn.query(
      `DELETE FROM people WHERE id = ${req.params.id}`,
      function (err, result) {
        if (err) {
          return res.status(500).json({ err: 'something went wrong' });
        }
        return res
          .status(200)
          .json({ message: 'Successfully deleted person account !' });
      }
    );
  }
);

router.post(
  '/company/create',
  isAuth,
  isAdmin,
  async function (req, res, next) {
    const {
      email,
      password,
      companyName,
      phone,
      siret,
      city,
      postalCode,
      activities,
      numberEmployees,
      website,
      contactName,
    } = req.body;

    try {
      const salt = await bcrypt.genSalt(10);
      let hashedpassword = await bcrypt.hash(password, salt);
      dbConn.query(
        `INSERT INTO companies (email, password, name, phone, siret, city, postal_code, activities, number_employees, website, contact_name) 
      SELECT "${email}", "${hashedpassword}", "${companyName}", "${phone}", "${siret}", "${city}", "${postalCode}", "${activities}", "${numberEmployees}", "${website}", "${contactName}" 
      FROM DUAL WHERE NOT EXISTS(
      (SELECT 1 FROM people WHERE email = '${email}') 
      UNION 
      (SELECT 1 FROM companies WHERE email = '${email}')
      ) LIMIT 1 `,
        function (err, result) {
          if (err) {
            console.log(err);
            return res.status(500).json({ err: 'something went wrong' });
          }
          if (result.affectedRows === 0) {
            return res.status(409).json({ err: 'email already in use' });
          }
          return res
            .status(200)
            .json({ message: 'Successfully new company !' });
        }
      );
    } catch (e) {
      res.status(500).json({ err: 'Something went wrong' });
    }
  }
);

router.put(
  '/company/update/:id',
  isAuth,
  isAdmin,
  async function (req, res, next) {
    const {
      email,
      password,
      companyName,
      phone,
      siret,
      city,
      postalCode,
      activities,
      numberEmployees,
      website,
      contactName,
    } = req.body;

    const id = req.params.id;

    const salt = await bcrypt.genSalt(10);
    let hashedpassword = await bcrypt.hash(password, salt);

    dbConn.query(
      `UPDATE companies 
    SET name = IF (LENGTH("${companyName}")>0,"${companyName}", name),
      email = IF (LENGTH('${email}')>0, '${email}', email),
      password = IF (LENGTH('${password}')>0, '${hashedpassword}', password),
      phone = IF (LENGTH('${phone}')>0, '${phone}', phone),
      siret = IF (LENGTH('${siret}')>0, '${siret}', siret),
      city = IF (LENGTH('${city}')>0, '${city}', city),
      postal_code = IF (LENGTH('${postalCode}')>0, '${postalCode}', postal_code),
      activities = IF (LENGTH('${activities}')>0, '${activities}', activities),
      number_employees = IF (LENGTH('${numberEmployees}')>0, '${numberEmployees}', number_employees),
      website = IF (LENGTH('${website}')>0, '${website}', website),
      contact_name = IF (LENGTH('${contactName}')>0, '${contactName}', contact_name)
    WHERE id = ${id}`,
      function (err, result) {
        if (err) {
          console.log(err);
          return res.status(500).json({ err: 'something went wrong' });
        }
        return res
          .status(200)
          .json({ message: 'Successfully updated company !' });
      }
    );
  }
);

router.delete(
  '/company/destroy/:id',
  isAuth,
  isAdmin,
  function (req, res, next) {
    dbConn.query(
      `DELETE FROM companies WHERE id = ${req.params.id}`,
      function (err, result) {
        if (err) {
          return res.status(500).json({ err: 'something went wrong' });
        }
        return res
          .status(200)
          .json({ message: 'Successfully deleted company account !' });
      }
    );
  }
);

router.post('/offers/create', isAuth, isAdmin, function (req, res, next) {
  const {
    companyId,
    title,
    salary,
    description,
    location,
    contractType,
    isVisible,
  } = req.body;
  let published = 0;

  if (isVisible) {
    published = 1;
  } else {
    published = 0;
  }

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
        "${companyId}",
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
});

router.put('/offers/update/:id', isAuth, isAdmin, function (req, res, next) {
  console.log(req.body);
  const {
    companyId,
    title,
    salary,
    description,
    location,
    contractType,
    isVisible,
  } = req.body;

  const id = req.params.id;

  let published = 0;

  if (isVisible) {
    published = 1;
  } else {
    published = 0;
  }

  dbConn.query(
    `UPDATE advertisements 
    SET company_id = IF (LENGTH("${companyId}")>0,"${companyId}", company_id),
      title = IF (LENGTH('${title}')>0, '${title}', title),
      salary = IF (LENGTH('${salary}')>0, '${salary}', salary),
      description = IF (LENGTH('${description}')>0, '${description}', description),
      location = IF (LENGTH('${location}')>0, '${location}', location),
      contract_type = IF (LENGTH('${contractType}')>0, '${contractType}', contract_type),
      published = "${published}"
    WHERE id = ${id}`,
    function (err, result) {
      if (err) {
        console.log(err);
        return res.status(500).json({ err: 'something went wrong' });
      }
      return res
        .status(200)
        .json({ message: 'Successfully updated advertisement !' });
    }
  );
});

router.delete(
  '/offers/destroy/:id',
  isAuth,
  isAdmin,
  function (req, res, next) {
    dbConn.query(
      `DELETE FROM advertisements WHERE id = ${req.params.id}`,
      function (err, result) {
        if (err) {
          return res.status(500).json({ err: 'something went wrong' });
        }
        return res
          .status(200)
          .json({ message: 'Successfully deleted advertisement !' });
      }
    );
  }
);

router.post('/applications/create', isAuth, isAdmin, function (req, res, next) {
  const { advertisementId, personId, message } = req.body;
  dbConn.query(
    `INSERT INTO applied (message, people_id, advertisement_id, date)
    SELECT "${message}", "${personId}", "${advertisementId}", "${moment().format(
      'YYYY-MM-DD  HH:mm:ss.000'
    )}"`,
    function (err, result) {
      if (err) {
        console.log(err);
        return res.status(500).json({ err: 'something went wrong' });
      }
      return res.status(200).json({ message: 'Application created !' });
    }
  );
});

router.put(
  '/applications/update/:id',
  isAuth,
  isAdmin,
  function (req, res, next) {
    const { advertisementId, personId, message } = req.body;
    const id = req.params.id;
    dbConn.query(
      `UPDATE applied 
    SET advertisement_id = IF (LENGTH("${advertisementId}")>0,"${advertisementId}", advertisement_id),
        people_id = IF (LENGTH("${personId}")>0,"${personId}", people_id),
        message = IF (LENGTH("${message}")>0,"${message}", message)
    WHERE id = ${id}`,
      function (err, result) {
        if (err) {
          console.log(err);
          return res.status(500).json({ err: 'something went wrong' });
        }
        return res
          .status(200)
          .json({ message: 'Successfully updated application !' });
      }
    );
  }
);

router.delete(
  '/applications/destroy/:id',
  isAuth,
  isAdmin,
  function (req, res, next) {
    dbConn.query(
      `DELETE FROM applied WHERE id = ${req.params.id}`,
      function (err, result) {
        if (err) {
          return res.status(500).json({ err: 'something went wrong' });
        }
        return res
          .status(200)
          .json({ message: 'Successfully deleted application !' });
      }
    );
  }
);

module.exports = router;
