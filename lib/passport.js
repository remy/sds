const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const { User } = require('../db/');

// // hardcoded users, ideally the users should be stored in a database
// var users = [{ id: 111, username: 'amy@amy', password: 'amyspassword' }];

// // passport needs ability to serialize and unserialize users out of session
// passport.serializeUser(function (user, done) {
//   done(null, users[0].id);
// });
// passport.deserializeUser(function (id, done) {
//   done(null, users[0]);
// });

// // passport local strategy for local-login, local refers to this app
// passport.use(
//   'local',
//   new LocalStrategy(
//     {
//       usernameField: 'email',
//     },
//     function (username, password, done) {
//       console.log('here');
//       if (username === users[0].username && password === users[0].password) {
//         return done(null, users[0]);
//       } else {
//         return done(null, false, { message: 'User not found.' });
//       }
//     }
//   )
// );

// module.exports = passport;

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
  console.log('serialised');
  callback(null, user.id);
});

passport.deserializeUser(async (id, callback) => {
  console.log('deserialised');

  const user = await Users.findById(id);
  callback(null, user);
});

module.exports = passport;
