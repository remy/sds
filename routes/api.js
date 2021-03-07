const express = require('express');
const { User, Submission } = require('../db/');
const router = express.Router({
  mergeParams: true,
});

module.exports = router;

router.use((req, res, next) => {
  if (!req.user) {
    return next(new Error(401));
  }

  next();
});

router.get('/me', async (req, res) => {
  /** @type {User} */
  const user = req.user;
  const submissions = (await user.getSubmissions())
    .map((_) => {
      const s = _.get();
      delete s.UserId;
      s.data = Array.from(s.data);
      return s;
    })
    .reverse();
  const { id, email, data } = user.get();
  res.json({ id, email, data: Array.from(data || []), submissions });
});

router.delete('/submission/:id', async (req, res) => {
  const id = parseInt(req.params.id, 10);
  await Submission.destroy({
    where: {
      UserId: req.user.id,
      id,
    },
  });
  res.json(true);
});
