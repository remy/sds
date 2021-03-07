const express = require('express');
const concat = require('concat-stream');
const { User, Submission } = require('../db/');
const router = express.Router({
  mergeParams: true,
});

module.exports = router;

router.use(async (req, res, next) => {
  const user = await User.findOne({
    where: { id: parseInt(req.params.id, 10) },
  });

  if (!user) {
    return next(new Error(404));
  }

  res.locals.user = user;
  next();
});

router.get('/', async (req, res, next) => {
  res.send(res.locals.user.data);
});

router.post('/', async (req, res, next) => {
  const data = res.locals.raw;
  const S = await Submission.create({
    data,
  });
  await res.locals.user.addSubmission(S);
  res.end('OK');
});
