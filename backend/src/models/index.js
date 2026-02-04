const User = require('./User');
const Category = require('./Category');
const Vocabulary = require('./Vocabulary');
const Sentence = require('./Sentence');
const UserProgress = require('./UserProgress');
const AudioFile = require('./AudioFile');

// 定义关系
Category.hasMany(Vocabulary, { foreignKey: 'category_id' });
Vocabulary.belongsTo(Category, { foreignKey: 'category_id' });

Vocabulary.hasMany(Sentence, { foreignKey: 'vocabulary_id' });
Sentence.belongsTo(Vocabulary, { foreignKey: 'vocabulary_id' });

User.hasMany(UserProgress, { foreignKey: 'user_id' });
UserProgress.belongsTo(User, { foreignKey: 'user_id' });

Vocabulary.hasMany(UserProgress, { foreignKey: 'vocabulary_id' });
UserProgress.belongsTo(Vocabulary, { foreignKey: 'vocabulary_id' });

User.hasMany(AudioFile, { foreignKey: 'uploaded_by' });
AudioFile.belongsTo(User, { foreignKey: 'uploaded_by' });

Vocabulary.hasMany(AudioFile, { foreignKey: 'vocabulary_id' });
AudioFile.belongsTo(Vocabulary, { foreignKey: 'vocabulary_id' });

Sentence.hasMany(AudioFile, { foreignKey: 'sentence_id' });
AudioFile.belongsTo(Sentence, { foreignKey: 'sentence_id' });

module.exports = {
  User,
  Category,
  Vocabulary,
  Sentence,
  UserProgress,
  AudioFile,
};
