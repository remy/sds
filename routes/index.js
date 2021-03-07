const express = require('express');
const { resolve } = require('path');
const passport = require('../lib/passport');
const router = express.Router();
module.exports = router;

router.use(
  '/account',
  (req, res, next) => {
    if (!req.user) {
      return res.redirect('/login');
    }

    next();
  },
  require('./account')
);

router.post(
  '/login',
  passport.authenticate('local', {
    successRedirect: '/account',
    failureRedirect: '/login?failed',
  })
);

router.use('/:id([0-9]+)', require('./user'));
router.use('/api', require('./api'));
