const express = require('express');

const router = express.Router();
module.exports = router;

router.get('/', (req, res, next) => {
  if (!req.user) return next('route');
  res.sendFile('/public/account.html', { root: __dirname + '/../' });
});
