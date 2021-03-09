require('renvy');
const { User } = require('../db');

User.create({
  email: 'sam@example.com',
  password: 'example99',
});
