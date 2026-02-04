const Service = require('node-windows').Service;

const svc = new Service({
  name: 'English Learning API'
});

svc.on('uninstall', () => {
  console.log('✓ 服务卸载成功！');
});

svc.on('error', (err) => {
  console.error('✗ 服务卸载失败:', err);
});

console.log('正在卸载服务...');
svc.uninstall();
