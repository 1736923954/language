const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const User = sequelize.define('User', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  username: {
    type: DataTypes.STRING(50),
    unique: true,
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING(100),
    unique: true,
    allowNull: true,
  },
  password_hash: {
    type: DataTypes.STRING(255),
    allowNull: false,
  },
  phone: {
    type: DataTypes.STRING(20),
    allowNull: true,
  },
  avatar_url: {
    type: DataTypes.STRING(255),
    allowNull: true,
  },
  nickname: {
    type: DataTypes.STRING(50),
    allowNull: true,
  },
  level: {
    type: DataTypes.ENUM('A1', 'A2', 'B1', 'B2', 'C1', 'C2'),
    defaultValue: 'B1',
  },
  role: {
    type: DataTypes.ENUM('user', 'admin'),
    defaultValue: 'user',
  },
  last_login: {
    type: DataTypes.DATE,
    allowNull: true,
  },
  is_active: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
  },
  created_at: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
  updated_at: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
}, {
  tableName: 'users',
  timestamps: false,
  indexes: [
    { fields: ['email'] },
    { fields: ['username'] },
    { fields: ['created_at'] },
  ],
});

module.exports = User;
