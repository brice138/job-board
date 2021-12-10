const express = require('express');
const router = express.Router();
const dbConn = require('../../models/db');

router.get('/', function (req, res, next) {
  res.json({ msg: 'Message depuis le fichier index' });
});

module.exports = router;
