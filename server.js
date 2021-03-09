require('renvy'); // env values
const express = require('express');
const session = require('express-session');
const ejs = require('ejs');
const bodyParser = require('body-parser');
const SequelizeStore = require('connect-session-sequelize')(session.Store);
const passport = require('./lib/passport');
const { sequelize } = require('./db');
const expressLayouts = require('express-ejs-layouts');

const app = express();
app.disable('x-powered-by');
app.set('etag', false);

app.set('views', 'public');
app.set('view engine', 'html');
app.set('layout', __dirname + '/public/layout.html');
app.set('layout extractScripts', true);
app.engine('html', ejs.renderFile);

app.locals.HOST = process.env.HOST || 'http://localhost:8000';
// middleware
app.use(expressLayouts);
app.use(
  bodyParser.urlencoded({
    extended: true,
    verify(req, res, buf) {
      res.locals.raw = buf;
      return true;
    },
  })
);
app.use(
  session({
    secret: process.env.SECRET || 'nextcats',
    resave: true,
    saveUninitialized: true,
    name: 'session',
    store: new SequelizeStore({
      db: sequelize,
    }),
  })
);
app.use(passport.initialize());
app.use(passport.session());

// routes
app.use(require('./routes/error'));
app.use('/', require('./routes')); // mount the router
app.use(require('./routes/error'));
app.use(express.static(__dirname + '/public/', { extensions: ['html'] }));

app.listen(process.env.PORT || 8000);
