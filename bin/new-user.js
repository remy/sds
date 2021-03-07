const { User } = require('../db');

const user = User.create({
  email: 'remy@remysharp.com',
  password: 'remy99',
});
