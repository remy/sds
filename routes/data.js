const express = require('express');
const axios = require('axios');
const { App, Submission } = require('../db');
const router = express.Router({
  mergeParams: true,
});

module.exports = router;

router.use(async (req, res, next) => {
  const app = await App.findOne({
    where: { id: parseInt(req.params.id, 10), active: true },
  });

  if (!app) {
    return next(new Error(404));
  }

  res.locals.app = app;
  next();
});

router.get('/', async (req, res) => {
  res.send(res.locals.app.data);
});

router.post('/', async (req, res) => {
  console.log(`POST /${res.locals.app.id}`, res.locals.raw);
  const data = res.locals.raw;
  const S = await Submission.create({
    data,
  });
  const app = res.locals.app;
  await app.addSubmission(S);

  if (app.hook) {
    axios
      .post(app.hook, {
        data,
      })
      .then(({ status, data }) => {
        if (status === 200) {
          app.data = data;
          return app.save();
        }
      });
  }

  res.end('OK');
});
