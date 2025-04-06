# Model Rocket Control Station

This is a model rocket control program built with TypeScript and @material/web components. The application provides a user interface for monitoring and controlling various parameters and functions of model rockets.

# 模型火箭控制站

这是一个使用 TypeScript 和 @material/web 组件库构建的模型火箭控制程序。该应用程序提供了一个用户界面，用于监控和控制模型火箭的各种参数和功能。

## 功能特点

- **实时遥测数据监控**：显示高度、速度、加速度和温度等关键数据
- **传感器数据查看**：查看加速度计、陀螺仪、气压计和GPS等传感器数据
- **系统设置**：配置连接、遥测和发射参数
- **设备连接管理**：连接和断开与火箭的通信
- **响应式设计**：适配不同屏幕尺寸的设备

## 技术栈

- **TypeScript**：提供类型安全和更好的开发体验
- **@material/web**：Material Design 3 的 Web Components 实现
- **Vite**：现代前端构建工具
- **CSS Grid & Flexbox**：用于响应式布局

## 开始使用

### 安装依赖

```bash
npm install
```

### 启动开发服务器

```bash
npm start
```

### 构建生产版本

```bash
npm run build
```

### 预览生产构建

```bash
npm run preview
```

## 项目结构

```
model-rocket-station/
├── src/
│   ├── modules/           # TypeScript 模块
│   │   ├── connection.ts  # 连接管理
│   │   ├── navigation.ts  # 导航管理
│   │   ├── sensors.ts     # 传感器数据管理
│   │   ├── settings.ts    # 设置管理
│   │   └── telemetry.ts   # 遥测数据管理
│   ├── styles/            # CSS 样式文件
│   │   └── main.css       # 主样式文件
│   └── main.ts            # 主入口文件
├── index.html             # HTML 入口文件
├── tsconfig.json          # TypeScript 配置
├── vite.config.ts         # Vite 配置
└── package.json           # 项目配置和依赖
```

## 自定义

你可以通过修改以下文件来自定义应用程序：

- `src/styles/main.css`：修改样式和主题颜色
- `index.html`：修改页面结构
- `src/modules/`：修改功能模块的实现

## 注意事项

这是一个模拟应用程序，不包含与实际硬件的通信功能。在实际应用中，你需要实现与火箭硬件的通信协议。
