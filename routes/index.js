const express = require('express');
const passport = require('../lib/passport');
const router = express.Router();
module.exports = router;

router.use('/', require('./account'));
router.get('/docs', (req, res) => res.render('docs', { user: req.user }));
router.get('/login', (req, res) => res.render('login', { user: req.user }));

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

router.get('/change-password', (req, res) => {
  res.render('change-password', { user: req.user });
});

router.get('/logout', (req, res) => {
  req.logout();
  res.redirect('/');
});

router.post('/change-password', (req, res) => {
  const { oldP, newP } = req.body;
  if (req.user.validPassword(oldP)) {
    req.user.password = req.user.hashPassword(newP);
    req.user.save();
    return res.redirect('/?success');
  }
  return res.redirect('/change-password?failed');
});
