const prisma = require('../src/models');
const { hashPassword } = require('../src/utils/password');

const vocabularyData = [
  // Work Category (工作相关)
  {
    word: 'meeting',
    phonetic: '/ˈmiːtɪŋ/',
    definition: 'An assembly of people for discussion',
    definition_zh: '会议',
    part_of_speech: 'noun',
    difficulty_level: 'A2',
    category: 'Work',
    sentences: [
      { english_text: 'We have a meeting at 2 PM today.', chinese_translation: '我们今天下午2点有个会议。', usage_context: 'workplace' },
      { english_text: 'The meeting was very productive.', chinese_translation: '这次会议很有成效。', usage_context: 'workplace' },
      { english_text: 'Can you reschedule the meeting?', chinese_translation: '你能重新安排会议吗？', usage_context: 'workplace' },
    ],
  },
  {
    word: 'deadline',
    phonetic: '/ˈdedlaɪn/',
    definition: 'The latest time or date by which something should be completed',
    definition_zh: '截止日期',
    part_of_speech: 'noun',
    difficulty_level: 'B1',
    category: 'Work',
    sentences: [
      { english_text: 'The deadline for the project is next Friday.', chinese_translation: '项目的截止日期是下周五。', usage_context: 'workplace' },
      { english_text: 'We need to meet the deadline.', chinese_translation: '我们需要赶上截止日期。', usage_context: 'workplace' },
      { english_text: 'The deadline has been extended.', chinese_translation: '截止日期已延长。', usage_context: 'workplace' },
    ],
  },
  {
    word: 'presentation',
    phonetic: '/ˌprezənˈteɪʃən/',
    definition: 'The action of presenting something to an audience',
    definition_zh: '演示，展示',
    part_of_speech: 'noun',
    difficulty_level: 'B1',
    category: 'Work',
    sentences: [
      { english_text: 'I will give a presentation tomorrow.', chinese_translation: '我明天会做一个演示。', usage_context: 'workplace' },
      { english_text: 'The presentation was well-received.', chinese_translation: '演示得到了很好的反应。', usage_context: 'workplace' },
      { english_text: 'Can you help me prepare the presentation?', chinese_translation: '你能帮我准备演示吗？', usage_context: 'workplace' },
    ],
  },
  {
    word: 'colleague',
    phonetic: '/ˈkɒliːɡ/',
    definition: 'A person with whom one works in a profession or business',
    definition_zh: '同事',
    part_of_speech: 'noun',
    difficulty_level: 'B1',
    category: 'Work',
    sentences: [
      { english_text: 'My colleague helped me with the project.', chinese_translation: '我的同事帮我完成了项目。', usage_context: 'workplace' },
      { english_text: 'I have lunch with my colleagues every day.', chinese_translation: '我每天和同事一起吃午饭。', usage_context: 'workplace' },
      { english_text: 'She is a great colleague to work with.', chinese_translation: '她是一个很好的合作同事。', usage_context: 'workplace' },
    ],
  },
  {
    word: 'project',
    phonetic: '/ˈprɒdʒekt/',
    definition: 'An individual or collaborative enterprise that is carefully planned',
    definition_zh: '项目',
    part_of_speech: 'noun',
    difficulty_level: 'A2',
    category: 'Work',
    sentences: [
      { english_text: 'I am working on a new project.', chinese_translation: '我在做一个新项目。', usage_context: 'workplace' },
      { english_text: 'The project is on schedule.', chinese_translation: '项目按计划进行。', usage_context: 'workplace' },
      { english_text: 'How is your project going?', chinese_translation: '你的项目进展如何？', usage_context: 'workplace' },
    ],
  },
  {
    word: 'conference',
    phonetic: '/ˈkɒnfərəns/',
    definition: 'A formal meeting of people with a shared interest',
    definition_zh: '会议，大会',
    part_of_speech: 'noun',
    difficulty_level: 'B1',
    category: 'Work',
    sentences: [
      { english_text: 'I will attend the conference next month.', chinese_translation: '我下个月将参加这个会议。', usage_context: 'workplace' },
      { english_text: 'The conference was held in New York.', chinese_translation: '会议在纽约举行。', usage_context: 'workplace' },
      { english_text: 'There are many speakers at the conference.', chinese_translation: '会议上有很多发言人。', usage_context: 'workplace' },
    ],
  },
  {
    word: 'schedule',
    phonetic: '/ˈʃedʒuːl/',
    definition: 'A plan that lists times at which events are intended to happen',
    definition_zh: '日程表，时间表',
    part_of_speech: 'noun',
    difficulty_level: 'B1',
    category: 'Work',
    sentences: [
      { english_text: 'Can you check your schedule?', chinese_translation: '你能查看你的日程表吗？', usage_context: 'workplace' },
      { english_text: 'The schedule has been changed.', chinese_translation: '日程已更改。', usage_context: 'workplace' },
      { english_text: 'I have a busy schedule this week.', chinese_translation: '我这周日程很满。', usage_context: 'workplace' },
    ],
  },
  {
    word: 'report',
    phonetic: '/rɪˈpɔːt/',
    definition: 'An account given of a particular matter',
    definition_zh: '报告',
    part_of_speech: 'noun',
    difficulty_level: 'B1',
    category: 'Work',
    sentences: [
      { english_text: 'I need to submit the report by Friday.', chinese_translation: '我需要在周五前提交报告。', usage_context: 'workplace' },
      { english_text: 'The report shows good progress.', chinese_translation: '报告显示进展良好。', usage_context: 'workplace' },
      { english_text: 'Can you write the report?', chinese_translation: '你能写这份报告吗？', usage_context: 'workplace' },
    ],
  },
  {
    word: 'email',
    phonetic: '/ˈiːmeɪl/',
    definition: 'Electronic mail; messages distributed by electronic means',
    definition_zh: '电子邮件',
    part_of_speech: 'noun',
    difficulty_level: 'A2',
    category: 'Work',
    sentences: [
      { english_text: 'I received your email this morning.', chinese_translation: '我今早收到了你的邮件。', usage_context: 'workplace' },
      { english_text: 'Please send me an email with the details.', chinese_translation: '请给我发邮件，说明详情。', usage_context: 'workplace' },
      { english_text: 'I have 50 unread emails.', chinese_translation: '我有50封未读邮件。', usage_context: 'workplace' },
    ],
  },
  {
    word: 'budget',
    phonetic: '/ˈbʌdʒɪt/',
    definition: 'The amount of money needed or available for spending',
    definition_zh: '预算',
    part_of_speech: 'noun',
    difficulty_level: 'B1',
    category: 'Work',
    sentences: [
      { english_text: 'We need to stay within the budget.', chinese_translation: '我们需要在预算范围内。', usage_context: 'workplace' },
      { english_text: 'The budget has been approved.', chinese_translation: '预算已获批准。', usage_context: 'workplace' },
      { english_text: 'What is the budget for this project?', chinese_translation: '这个项目的预算是多少？', usage_context: 'workplace' },
    ],
  },

  // Daily Life Category (日常生活)
  {
    word: 'breakfast',
    phonetic: '/ˈbrekfəst/',
    definition: 'The first meal of the day',
    definition_zh: '早餐',
    part_of_speech: 'noun',
    difficulty_level: 'A1',
    category: 'Daily Life',
    sentences: [
      { english_text: 'I eat breakfast at 7 AM.', chinese_translation: '我早上7点吃早餐。', usage_context: 'daily' },
      { english_text: 'What do you usually have for breakfast?', chinese_translation: '你通常早餐吃什么？', usage_context: 'daily' },
      { english_text: 'Breakfast is the most important meal.', chinese_translation: '早餐是最重要的一餐。', usage_context: 'daily' },
    ],
  },
  {
    word: 'weather',
    phonetic: '/ˈweðə/',
    definition: 'The state of the atmosphere at a particular place and time',
    definition_zh: '天气',
    part_of_speech: 'noun',
    difficulty_level: 'A1',
    category: 'Daily Life',
    sentences: [
      { english_text: 'The weather is nice today.', chinese_translation: '今天天气很好。', usage_context: 'daily' },
      { english_text: 'What is the weather like tomorrow?', chinese_translation: '明天天气怎么样？', usage_context: 'daily' },
      { english_text: 'The weather has been rainy all week.', chinese_translation: '整周都在下雨。', usage_context: 'daily' },
    ],
  },
  {
    word: 'shopping',
    phonetic: '/ˈʃɒpɪŋ/',
    definition: 'The activity of buying goods from shops',
    definition_zh: '购物',
    part_of_speech: 'noun',
    difficulty_level: 'A2',
    category: 'Daily Life',
    sentences: [
      { english_text: 'I go shopping every weekend.', chinese_translation: '我每个周末都去购物。', usage_context: 'daily' },
      { english_text: 'Can you help me with shopping?', chinese_translation: '你能帮我购物吗？', usage_context: 'daily' },
      { english_text: 'I love shopping for clothes.', chinese_translation: '我喜欢购物买衣服。', usage_context: 'daily' },
    ],
  },
  {
    word: 'exercise',
    phonetic: '/ˈeksəsaɪz/',
    definition: 'Activity requiring physical effort done to sustain or improve health',
    definition_zh: '运动，锻炼',
    part_of_speech: 'noun',
    difficulty_level: 'B1',
    category: 'Daily Life',
    sentences: [
      { english_text: 'I do exercise every morning.', chinese_translation: '我每天早上运动。', usage_context: 'daily' },
      { english_text: 'Regular exercise is good for health.', chinese_translation: '定期运动对健康有益。', usage_context: 'daily' },
      { english_text: 'What kind of exercise do you prefer?', chinese_translation: '你喜欢什么样的运动？', usage_context: 'daily' },
    ],
  },
  {
    word: 'cooking',
    phonetic: '/ˈkʊkɪŋ/',
    definition: 'The practice of preparing food by heating',
    definition_zh: '烹饪',
    part_of_speech: 'noun',
    difficulty_level: 'A2',
    category: 'Daily Life',
    sentences: [
      { english_text: 'I enjoy cooking on weekends.', chinese_translation: '我喜欢在周末做饭。', usage_context: 'daily' },
      { english_text: 'Cooking is a useful skill.', chinese_translation: '烹饪是一项有用的技能。', usage_context: 'daily' },
      { english_text: 'Can you teach me cooking?', chinese_translation: '你能教我做饭吗？', usage_context: 'daily' },
    ],
  },
  {
    word: 'movie',
    phonetic: '/ˈmuːvi/',
    definition: 'A story or event recorded by a camera as a set of moving images',
    definition_zh: '电影',
    part_of_speech: 'noun',
    difficulty_level: 'A2',
    category: 'Daily Life',
    sentences: [
      { english_text: 'I watched a movie last night.', chinese_translation: '我昨晚看了一部电影。', usage_context: 'daily' },
      { english_text: 'What is your favorite movie?', chinese_translation: '你最喜欢的电影是什么？', usage_context: 'daily' },
      { english_text: 'Let\'s go to the cinema to watch a movie.', chinese_translation: '我们去电影院看电影吧。', usage_context: 'daily' },
    ],
  },
  {
    word: 'travel',
    phonetic: '/ˈtrævəl/',
    definition: 'The act of going from one place to another',
    definition_zh: '旅行',
    part_of_speech: 'noun',
    difficulty_level: 'B1',
    category: 'Daily Life',
    sentences: [
      { english_text: 'I love to travel around the world.', chinese_translation: '我喜欢环游世界。', usage_context: 'daily' },
      { english_text: 'Where do you want to travel?', chinese_translation: '你想去哪里旅行？', usage_context: 'daily' },
      { english_text: 'Traveling is a great way to learn.', chinese_translation: '旅行是学习的好方法。', usage_context: 'daily' },
    ],
  },
  {
    word: 'hobby',
    phonetic: '/ˈhɒbi/',
    definition: 'An activity done regularly in one\'s leisure time for pleasure',
    definition_zh: '爱好',
    part_of_speech: 'noun',
    difficulty_level: 'B1',
    category: 'Daily Life',
    sentences: [
      { english_text: 'Reading is my favorite hobby.', chinese_translation: '阅读是我最喜欢的爱好。', usage_context: 'daily' },
      { english_text: 'What are your hobbies?', chinese_translation: '你的爱好是什么？', usage_context: 'daily' },
      { english_text: 'I spend my free time on my hobbies.', chinese_translation: '我用空闲时间做爱好。', usage_context: 'daily' },
    ],
  },
  {
    word: 'friend',
    phonetic: '/frend/',
    definition: 'A person with whom one has a bond of mutual affection',
    definition_zh: '朋友',
    part_of_speech: 'noun',
    difficulty_level: 'A1',
    category: 'Daily Life',
    sentences: [
      { english_text: 'I have many good friends.', chinese_translation: '我有很多好朋友。', usage_context: 'daily' },
      { english_text: 'My best friend is very supportive.', chinese_translation: '我最好的朋友非常支持我。', usage_context: 'daily' },
      { english_text: 'I meet my friends every week.', chinese_translation: '我每周都见朋友。', usage_context: 'daily' },
    ],
  },

  // Communication Category (沟通交流)
  {
    word: 'conversation',
    phonetic: '/ˌkɒnvəˈseɪʃən/',
    definition: 'Informal interchange of ideas by spoken words',
    definition_zh: '对话，谈话',
    part_of_speech: 'noun',
    difficulty_level: 'B1',
    category: 'Communication',
    sentences: [
      { english_text: 'We had a long conversation yesterday.', chinese_translation: '我们昨天进行了一次长谈。', usage_context: 'communication' },
      { english_text: 'I enjoy having conversations with you.', chinese_translation: '我喜欢和你谈话。', usage_context: 'communication' },
      { english_text: 'The conversation was very interesting.', chinese_translation: '这次对话很有趣。', usage_context: 'communication' },
    ],
  },
  {
    word: 'question',
    phonetic: '/ˈkwestʃən/',
    definition: 'A sentence worded or expressed so as to elicit information',
    definition_zh: '问题，疑问',
    part_of_speech: 'noun',
    difficulty_level: 'A1',
    category: 'Communication',
    sentences: [
      { english_text: 'Do you have any questions?', chinese_translation: '你有什么问题吗？', usage_context: 'communication' },
      { english_text: 'That\'s a good question.', chinese_translation: '这是个好问题。', usage_context: 'communication' },
      { english_text: 'I have a question for you.', chinese_translation: '我有个问题要问你。', usage_context: 'communication' },
    ],
  },
  {
    word: 'answer',
    phonetic: '/ˈɑːnsə/',
    definition: 'A response or reply to a question or request',
    definition_zh: '回答，答案',
    part_of_speech: 'noun',
    difficulty_level: 'A1',
    category: 'Communication',
    sentences: [
      { english_text: 'Can you answer my question?', chinese_translation: '你能回答我的问题吗？', usage_context: 'communication' },
      { english_text: 'The answer is yes.', chinese_translation: '答案是肯定的。', usage_context: 'communication' },
      { english_text: 'I don\'t know the answer.', chinese_translation: '我不知道答案。', usage_context: 'communication' },
    ],
  },
  {
    word: 'opinion',
    phonetic: '/əˈpɪnjən/',
    definition: 'A view or judgment formed about something',
    definition_zh: '意见，观点',
    part_of_speech: 'noun',
    difficulty_level: 'B1',
    category: 'Communication',
    sentences: [
      { english_text: 'What is your opinion on this?', chinese_translation: '你对此有什么看法？', usage_context: 'communication' },
      { english_text: 'In my opinion, this is the best choice.', chinese_translation: '在我看来，这是最好的选择。', usage_context: 'communication' },
      { english_text: 'Everyone has different opinions.', chinese_translation: '每个人都有不同的观点。', usage_context: 'communication' },
    ],
  },
  {
    word: 'suggestion',
    phonetic: '/səˈdʒestʃən/',
    definition: 'An idea or plan put forward for consideration',
    definition_zh: '建议',
    part_of_speech: 'noun',
    difficulty_level: 'B1',
    category: 'Communication',
    sentences: [
      { english_text: 'Do you have any suggestions?', chinese_translation: '你有什么建议吗？', usage_context: 'communication' },
      { english_text: 'That\'s a great suggestion.', chinese_translation: '这是个很好的建议。', usage_context: 'communication' },
      { english_text: 'I have a suggestion for you.', chinese_translation: '我有个建议给你。', usage_context: 'communication' },
    ],
  },
  {
    word: 'agree',
    phonetic: '/əˈɡriː/',
    definition: 'To have the same opinion as someone else',
    definition_zh: '同意',
    part_of_speech: 'verb',
    difficulty_level: 'B1',
    category: 'Communication',
    sentences: [
      { english_text: 'I agree with you.', chinese_translation: '我同意你的看法。', usage_context: 'communication' },
      { english_text: 'Do you agree with this plan?', chinese_translation: '你同意这个计划吗？', usage_context: 'communication' },
      { english_text: 'We all agree on this decision.', chinese_translation: '我们都同意这个决定。', usage_context: 'communication' },
    ],
  },
  {
    word: 'disagree',
    phonetic: '/ˌdɪsəˈɡriː/',
    definition: 'To have a different opinion from someone else',
    definition_zh: '不同意',
    part_of_speech: 'verb',
    difficulty_level: 'B1',
    category: 'Communication',
    sentences: [
      { english_text: 'I disagree with your opinion.', chinese_translation: '我不同意你的观点。', usage_context: 'communication' },
      { english_text: 'We disagree on this issue.', chinese_translation: '我们在这个问题上有分歧。', usage_context: 'communication' },
      { english_text: 'It\'s okay to disagree.', chinese_translation: '不同意是可以的。', usage_context: 'communication' },
    ],
  },
  {
    word: 'discuss',
    phonetic: '/dɪˈskʌs/',
    definition: 'To talk about something with another person or group',
    definition_zh: '讨论',
    part_of_speech: 'verb',
    difficulty_level: 'B1',
    category: 'Communication',
    sentences: [
      { english_text: 'Let\'s discuss this matter.', chinese_translation: '让我们讨论这个问题。', usage_context: 'communication' },
      { english_text: 'We need to discuss the plan.', chinese_translation: '我们需要讨论这个计划。', usage_context: 'communication' },
      { english_text: 'Can we discuss this later?', chinese_translation: '我们能稍后讨论这个吗？', usage_context: 'communication' },
    ],
  },
  {
    word: 'explain',
    phonetic: '/ɪkˈspleɪn/',
    definition: 'To make something clear or easy to understand',
    definition_zh: '解释',
    part_of_speech: 'verb',
    difficulty_level: 'B1',
    category: 'Communication',
    sentences: [
      { english_text: 'Can you explain this to me?', chinese_translation: '你能给我解释一下吗？', usage_context: 'communication' },
      { english_text: 'Let me explain the situation.', chinese_translation: '让我解释一下情况。', usage_context: 'communication' },
      { english_text: 'Please explain your decision.', chinese_translation: '请解释你的决定。', usage_context: 'communication' },
    ],
  },
];

async function seedDatabase() {
  try {
    console.log('Starting database seeding...');

    // 创建管理员用户
    const adminPassword = await hashPassword('admin123');
    const adminUser = await prisma.user.upsert({
      where: { username: 'admin' },
      update: {
        password_hash: adminPassword,
        role: 'admin',
        is_active: true,
      },
      create: {
        username: 'admin',
        email: 'admin@example.com',
        password_hash: adminPassword,
        nickname: 'Administrator',
        role: 'admin',
        is_active: true,
      },
    });
    console.log('Admin user created/updated');

    // 创建分类
    const categoriesData = [
      { name: 'Work', description: 'Work-related vocabulary', sort_order: 1 },
      { name: 'Daily Life', description: 'Daily life vocabulary', sort_order: 2 },
      { name: 'Communication', description: 'Communication and conversation', sort_order: 3 },
      { name: 'Business', description: 'Business English', sort_order: 4 },
      { name: 'Travel', description: 'Travel-related vocabulary', sort_order: 5 },
      { name: 'Health', description: 'Health and wellness', sort_order: 6 },
      { name: 'Technology', description: 'Technology and IT', sort_order: 7 },
      { name: 'Education', description: 'Education-related vocabulary', sort_order: 8 },
    ];

    const categories = await Promise.all(
      categoriesData.map((cat) =>
        prisma.category.upsert({
          where: { name: cat.name },
          update: cat,
          create: cat,
        })
      )
    );
    console.log(`Created/Updated ${categories.length} categories`);

    // 创建词汇和句子
    let totalVocabularies = 0;
    let totalSentences = 0;

    for (const vocabData of vocabularyData) {
      const category = categories.find((c) => c.name === vocabData.category);
      if (!category) continue;

      const vocab = await prisma.vocabulary.upsert({
        where: {
          unique_word_category: {
            word: vocabData.word,
            category_id: category.id,
          },
        },
        update: {
          phonetic: vocabData.phonetic,
          definition: vocabData.definition,
          definition_zh: vocabData.definition_zh,
          part_of_speech: vocabData.part_of_speech,
          difficulty_level: vocabData.difficulty_level,
        },
        create: {
          word: vocabData.word,
          phonetic: vocabData.phonetic,
          definition: vocabData.definition,
          definition_zh: vocabData.definition_zh,
          part_of_speech: vocabData.part_of_speech,
          difficulty_level: vocabData.difficulty_level,
          category_id: category.id,
          created_by: adminUser.id,
          example_count: vocabData.sentences.length,
        },
      });

      totalVocabularies++;

      // 删除旧的句子（如果存在）
      await prisma.sentence.deleteMany({
        where: { vocabulary_id: vocab.id },
      });

      // 创建句子
      const sentencesData = vocabData.sentences.map((s) => ({
        vocabulary_id: vocab.id,
        english_text: s.english_text,
        chinese_translation: s.chinese_translation,
        usage_context: s.usage_context,
        difficulty_level: vocabData.difficulty_level,
        created_by: adminUser.id,
      }));

      await prisma.sentence.createMany({
        data: sentencesData,
      });
      totalSentences += sentencesData.length;
    }

    console.log(`Created/Updated ${totalVocabularies} vocabularies`);
    console.log(`Created ${totalSentences} sentences`);
    console.log('Database seeding completed successfully!');

    await prisma.$disconnect();
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    await prisma.$disconnect();
    process.exit(1);
  }
}

seedDatabase();
