const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const UserProgress = sequelize.define('UserProgress', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  user_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  vocabulary_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  status: {
    type: DataTypes.ENUM('learning', 'reviewing', 'mastered'),
    defaultValue: 'learning',
  },
  correct_count: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
  wrong_count: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
  last_reviewed_at: {
    type: DataTypes.DATE,
    allowNull: true,
  },
  next_review_at: {
    type: DataTypes.DATE,
    allowNull: true,
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
  tableName: 'user_progress',
  timestamps: false,
  indexes: [
    { fields: ['user_id'] },
    { fields: ['status'] },
    { fields: ['next_review_at'] },
  ],
  uniqueKeys: {
    unique_user_vocab: {
      fields: ['user_id', 'vocabulary_id'],
    },
  },
});

module.exports = UserProgress;
