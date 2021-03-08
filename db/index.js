const { Sequelize, DataTypes } = require('sequelize');
const bcrypt = require('bcryptjs');

const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: process.env.DB_FILE || 'next.db',
  logging: false,
});

const TEXT = 0;
const HEX = 1;

const Submission = sequelize.define('Submission', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  data: DataTypes.BLOB,
  key: DataTypes.STRING,
});

const App = sequelize.define('App', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  name: DataTypes.STRING,
  hook: DataTypes.STRING,
  data: {
    type: DataTypes.BLOB,
  },
  active: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
  },
  submissions: {
    type: Submission,
  },
});

App.hasMany(Submission);

const User = sequelize.define('User', {
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
    unique: true,
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  appLimit: {
    type: DataTypes.INTEGER,
    defaultValue: 3,
  },
  viewAs: { type: DataTypes.INTEGER, defaultValue: TEXT },
  apps: {
    type: App,
  },
});

User.addHook('beforeCreate', (newUser) => {
  newUser.password = bcrypt.hashSync(
    newUser.password,
    bcrypt.genSaltSync(10),
    null
  );
});

User.hasMany(App);

User.prototype.validPassword = function (pw) {
  return bcrypt.compareSync(pw, this.password);
};

User.prototype.hashPassword = function (pw) {
  return bcrypt.hashSync(pw, bcrypt.genSaltSync(10), null);
};

sequelize
  .sync({ force: false })
  .then(async () => {
    // try {
    // } catch (e) {
    //   // nop
    // }

    const users = await User.findAll();
    console.log('users: ' + users.length);
  })
  .catch((e) => {
    console.log('db sync fail:' + e.message);
  });

module.exports = { User, Submission, App, sequelize, TEXT, HEX };
