const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Category = sequelize.define('Category', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  name: {
    type: DataTypes.STRING(50),
    unique: true,
    allowNull: false,
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  icon_url: {
    type: DataTypes.STRING(255),
    allowNull: true,
  },
  sort_order: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
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
  tableName: 'categories',
  timestamps: false,
  indexes: [
    { fields: ['sort_order'] },
  ],
});

module.exports = Category;
