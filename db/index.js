const { Sequelize, DataTypes } = require('sequelize');
const bcrypt = require('bcryptjs');

const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: 'next.db',
  logging: false,
});

const Submission = sequelize.define('Submission', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  data: DataTypes.BLOB,
  key: DataTypes.STRING,
});

const User = sequelize.define(
  'User',
  {
    // Model attributes are defined here
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    data: {
      type: DataTypes.BLOB,
    },
    submissions: {
      type: Submission,
    },
  },
  {
    // Other model options go here
  }
);

User.addHook('beforeCreate', (newUser) => {
  newUser.password = bcrypt.hashSync(
    newUser.password,
    bcrypt.genSaltSync(10),
    null
  );
});

User.hasMany(Submission);

User.prototype.validPassword = function (pw) {
  return bcrypt.compareSync(pw, this.password);
};

sequelize
  .sync({ force: false })
  .then(async () => {
    const users = await User.findAll();
    console.log('users: ' + users.length);
  })
  .catch((e) => {
    console.log('db sync fail:' + e.message);
  });

module.exports = { User, Submission, sequelize };
