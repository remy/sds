const express = require('express');
const passport = require('../lib/passport');
const router = express.Router();
module.exports = router;

router.use('/', require('./account'));

router.post(
  '/login',
  passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/login?failed',
  })
);

router.use('/:id([0-9]+)', require('./data'));

// all further routes are protected

const requireUser = (req, res, next) => {
  if (!req.user) {
    return next(new Error(401));
  }
  next();
};

router.use('/app', requireUser, require('./app'));
router.use('/api', requireUser, require('./api'));
