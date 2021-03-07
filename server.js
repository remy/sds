require('renvy'); // env values
const express = require('express');
// const cookieParser = require('cookie-parser');
const session = require('express-session');
const bodyParser = require('body-parser');
const passport = require('./lib/passport');

const app = express();
app.disable('x-powered-by');
app.set('etag', false);

// middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(
  session({
    secret: process.env.SECRET || 'nextcats',
    resave: true,
    saveUninitialized: false,
  })
);
app.use(passport.initialize());
app.use(passport.session());

// routes
app.use(require('./routes/error'));
app.use('/', require('./routes')); // mount the router
app.use(require('./routes/error'));
app.use(express.static(__dirname + '/public/', { extensions: ['html'] }));

app.listen(process.env.PORT);
