const express = require('express');
const router = express.Router();

router.get('/', (req, res, next) => {
  return res.clearCookie('access_token').status(200).redirect('/');
  //.json({ message: 'Successfully logged out!' });
});

module.exports = router;
