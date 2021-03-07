const { Sequelize, DataTypes } = require('sequelize');

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
      allowNull: false,
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

User.hasMany(Submission);

sequelize
  .sync({ force: false })
  .then(async () => {})
  .catch((e) => {
    console.log('db sync fail:' + e.message);
  });

module.exports = { User, Submission };
