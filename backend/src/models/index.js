/**
 * Prisma Models Export
 * 
 * 此文件导出 Prisma Client 实例，方便统一导入
 * 使用方式：
 *   const prisma = require('../models');
 *   或
 *   const { prisma } = require('../models');
 */

const prisma = require('../config/database');

module.exports = prisma;
module.exports.prisma = prisma;
module.exports.default = prisma;
