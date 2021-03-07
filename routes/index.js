const express = require('express');
const passport = require('../lib/passport');
const router = express.Router();
module.exports = router;

router.use('/account', (req, res, next) => {
  res.status(201).send(req.user);
});

router.post(
  '/login',
  passport.authenticate('local', {
    successRedirect: '/account',
    failureRedirect: '/login?failed',
  })
);

// router.get('/login', (req, res) =>
//   res.sendFile(__dirname + '/../public/login.html')
// );

router.use('/:id([0-9]+)', require('./user'));
