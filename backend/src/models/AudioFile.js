const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const AudioFile = sequelize.define('AudioFile', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  file_name: {
    type: DataTypes.STRING(255),
    allowNull: false,
  },
  file_path: {
    type: DataTypes.STRING(255),
    allowNull: false,
  },
  file_size: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  file_type: {
    type: DataTypes.STRING(20),
    allowNull: true,
  },
  duration: {
    type: DataTypes.FLOAT,
    allowNull: true,
  },
  vocabulary_id: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  sentence_id: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  uploaded_by: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  created_at: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
}, {
  tableName: 'audio_files',
  timestamps: false,
  indexes: [
    { fields: ['vocabulary_id'] },
    { fields: ['sentence_id'] },
  ],
});

module.exports = AudioFile;
