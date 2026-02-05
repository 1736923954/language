# TabBar 图标说明

## 📁 图标文件位置

TabBar 图标文件应放在 `static/tabbar/` 目录下。

## 📋 所需图标文件

需要准备以下 8 个图标文件：

| 文件名 | 说明 | 尺寸建议 |
|--------|------|----------|
| `home.png` | 首页图标（未选中） | 81x81px |
| `home-active.png` | 首页图标（选中） | 81x81px |
| `learn.png` | 学习图标（未选中） | 81x81px |
| `learn-active.png` | 学习图标（选中） | 81x81px |
| `progress.png` | 进度图标（未选中） | 81x81px |
| `progress-active.png` | 进度图标（选中） | 81x81px |
| `profile.png` | 个人图标（未选中） | 81x81px |
| `profile-active.png` | 个人图标（选中） | 81x81px |

## 🎨 图标设计建议

### 颜色
- **未选中状态**：灰色 (#9ca3af)
- **选中状态**：主色调绿色 (#58cc02)

### 风格
- 使用线性图标风格
- 简洁明了，易于识别
- 与整体设计风格一致

### 图标建议
- **Home**：房子图标
- **Learn**：书本/学习图标
- **Progress**：图表/进度图标
- **Profile**：用户/个人图标

## 🔧 如果没有图标文件

如果暂时没有图标文件，可以：

1. **使用在线图标库**：
   - [IconFont](https://www.iconfont.cn/)
   - [Feather Icons](https://feathericons.com/)
   - [Heroicons](https://heroicons.com/)

2. **使用 uview-plus 图标**：
   修改 `pages.json` 中的 TabBar 配置，暂时移除图标路径，只使用文字。

3. **临时方案**：
   可以先使用占位图标，后续再替换。

## 📝 注意事项

- 图标文件必须是 PNG 格式
- 建议使用 2 倍图（81x81px）以获得更好的显示效果
- 图标应该居中显示
- 选中和未选中状态应该有明显的视觉区别
