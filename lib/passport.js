const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const { User } = require('../db/');

const strategy = new LocalStrategy(
  {
    usernameField: 'email',
  },
  async (email, password, callback) => {
    User.findOne({ where: { email } })
      .then((user) => {
        if (!user) {
          return callback(null, false, { message: 'Incorrect username.' });
        }
        if (!user.validPassword(password)) {
          return callback(null, false, { message: 'Incorrect password.' });
        }
        return callback(null, user);
      })
      .catch((error) => {
        return callback(error);
      });
  }
);

passport.use('local', strategy);

// Configure Passport authenticated session persistence.
//
// In order to restore authentication state across HTTP requests, Passport needs
// to serialize users into and deserialize users out of the session.  The
// typical implementation of this is as simple as supplying the user ID when
// serializing, and querying the user record by ID from the database when
// deserializing.
passport.serializeUser(function (user, callback) {
  callback(null, user.id);
});

passport.deserializeUser(async (id, callback) => {
  const user = await User.findByPk(id);
  callback(null, user);
});

module.exports = passport;
