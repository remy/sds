const express = require('express');

const router = express.Router();
module.exports = router;

router.get('/', (req, res) => {
  if (!req.user) return res.render('index', { user: null });
  res.render('account', { user: req.user });
});
