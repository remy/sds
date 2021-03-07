const express = require('express');
const fileUpload = require('express-fileupload');

const { resolve } = require('path');
const passport = require('../lib/passport');
const router = express.Router();
module.exports = router;

router.use(fileUpload({}));

router.get('/', (req, res) => {
  res.sendFile('/private/account.html', { root: __dirname + '/../' });
});

router.post('/', async (req, res) => {
  if (!req.files || Object.keys(req.files).length === 0) {
    return res.status(400).send('No files were uploaded.');
  }

  const file = req.files.file;
  req.user.data = Buffer.from(file.data);
  await req.user.save();
  res.send(true);
});
