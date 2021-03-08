const express = require('express');
const { App } = require('../db');
const router = express.Router();
module.exports = router;

router.param('id', async (req, res, next, id) => {
  if (!/^[0-9]+$/.test(id) || isNaN(parseInt(id, 10))) {
    next(401);
  }
  id = parseInt(id, 10);

  const user = req.user;
  const app = await App.findOne({
    where: {
      UserId: user.id,
      id: id,
      active: true,
    },
  });

  if (!app) {
    next(new Error(401));
  }

  res.locals.app = app;

  next();
});

router.get('/new', (req, res) => {
  res.render('app/new', { user: req.user });
});

router.get('/:id', (req, res) => {
  res.render('app/index', { user: req.user });
});

// create
router.post('/', async (req, res) => {
  const { name, hook = '' } = req.body;
  const apps = await req.user.getApps();
  const limit = req.user.appLimit;
  if (apps && apps.length >= limit) {
    res.status(400).json({ error: 'failed', source: 'At app limit' });
    return;
  }
  try {
    const app = await App.create({
      name,
      hook,
    });
    await req.user.addApp(app);
    res.status(201).redirect(`/app/${app.id}`);
  } catch (e) {
    res.status(400).json({ error: 'failed', source: e.message });
  }
});
