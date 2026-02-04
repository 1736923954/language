const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Vocabulary = sequelize.define('Vocabulary', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  word: {
    type: DataTypes.STRING(100),
    allowNull: false,
  },
  phonetic: {
    type: DataTypes.STRING(100),
    allowNull: true,
  },
  definition: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  definition_zh: {
    type: DataTypes.STRING(255),
    allowNull: true,
  },
  part_of_speech: {
    type: DataTypes.STRING(20),
    allowNull: true,
  },
  difficulty_level: {
    type: DataTypes.ENUM('A1', 'A2', 'B1', 'B2', 'C1', 'C2'),
    defaultValue: 'B1',
  },
  category_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  audio_url: {
    type: DataTypes.STRING(255),
    allowNull: true,
  },
  image_url: {
    type: DataTypes.STRING(255),
    allowNull: true,
  },
  example_count: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
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
  tableName: 'vocabularies',
  timestamps: false,
  indexes: [
    { fields: ['word'] },
    { fields: ['category_id'] },
    { fields: ['difficulty_level'] },
    { fields: ['is_active'] },
  ],
  uniqueKeys: {
    unique_word_category: {
      fields: ['word', 'category_id'],
    },
  },
});

module.exports = Vocabulary;
