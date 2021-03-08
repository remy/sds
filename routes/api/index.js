const express = require('express');
const { User } = require('../../db');
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

router.use('/app', require('./app'));

router.get('/me', async (req, res) => {
  /** @type {User} */
  const user = req.user;
  const apps = await Promise.all(
    (await user.getApps()).map(async (_) => {
      const app = _.get();
      delete app.UserId;
      app.data = Array.from(app.data || []);

      app.submissions = _.submissions
        ? await _.getSubmissions().map((_) => _.get())
        : [];

      return app;
    })
  );

  res.json({
    apps,
    user: {
      viewAs: user.viewAs,
      appLimit: user.appLimit,
      email: user.email,
      id: user.id,
    },
  });
});
