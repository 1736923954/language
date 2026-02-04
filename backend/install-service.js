const Service = require('node-windows').Service;
const path = require('path');

const svc = new Service({
  name: 'English Learning API',
  description: 'English Learning Backend API Service',
  script: path.join(__dirname, 'server.js'),
  nodeOptions: [
    '--max_old_space_size=512'
  ],
  env: [
    {
      name: 'NODE_ENV',
      value: 'production'
    }
  ]
});

svc.on('install', () => {
  console.log('✓ 服务安装成功！');
  console.log('正在启动服务...');
  svc.start();
});

svc.on('start', () => {
  console.log('✓ 服务启动成功！');
  console.log('服务名称: English Learning API');
  console.log('管理命令:');
  console.log('  启动: net start "English Learning API"');
  console.log('  停止: net stop "English Learning API"');
});

svc.on('error', (err) => {
  console.error('✗ 服务安装失败:', err);
});

svc.install();
