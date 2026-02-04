const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Sentence = sequelize.define('Sentence', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  vocabulary_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  english_text: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  chinese_translation: {
    type: DataTypes.STRING(500),
    allowNull: true,
  },
  audio_url: {
    type: DataTypes.STRING(255),
    allowNull: true,
  },
  usage_context: {
    type: DataTypes.STRING(100),
    allowNull: true,
  },
  difficulty_level: {
    type: DataTypes.ENUM('A1', 'A2', 'B1', 'B2', 'C1', 'C2'),
    defaultValue: 'B1',
  },
  created_by: {
    type: DataTypes.INTEGER,
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
  tableName: 'sentences',
  timestamps: false,
  indexes: [
    { fields: ['vocabulary_id'] },
    { fields: ['difficulty_level'] },
    { fields: ['is_active'] },
  ],
});

module.exports = Sentence;
