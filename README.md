# 38μs Trading Platform - Admin Panel

## 项目简介

38μs Trading Platform 的管理端系统，基于 Vue 3 + Element Plus 构建的现代化管理界面。

## 功能特性

### 🔐 认证系统
- 管理员登录/注册
- JWT Token 认证
- 路由守卫保护

### 👥 用户管理
- 用户列表查看
- 用户搜索功能
- 用户删除操作

### 📋 记录管理
- 提交记录列表
- 记录状态管理（待审核/已通过/已拒绝）
- 审核功能（通过/拒绝）
- 审核备注
- 记录删除

### 📊 仪表板
- 统计数据展示
- 最近提交记录
- 数据概览

## 技术栈

- **前端框架**: Vue 3 (Composition API)
- **UI 组件库**: Element Plus
- **状态管理**: Pinia
- **路由**: Vue Router 4
- **HTTP 客户端**: Axios
- **构建工具**: Vite
- **开发语言**: JavaScript

## 项目结构

```
admin-panel/
├── src/
│   ├── api/                 # API 接口
│   │   ├── request.js       # Axios 配置
│   │   ├── auth.js          # 认证接口
│   │   └── submission.js    # 提交记录接口
│   ├── layout/              # 布局组件
│   │   └── AdminLayout.vue  # 管理端布局
│   ├── router/              # 路由配置
│   │   └── index.js
│   ├── stores/              # 状态管理
│   │   └── auth.js          # 认证状态
│   ├── views/               # 页面组件
│   │   ├── Login.vue        # 登录页
│   │   ├── Register.vue     # 注册页
│   │   ├── Dashboard.vue    # 仪表板
│   │   ├── UserManagement.vue      # 用户管理
│   │   └── SubmissionManagement.vue # 记录管理
│   ├── App.vue              # 根组件
│   └── main.js              # 入口文件
├── index.html
├── package.json
└── vite.config.js
```

## 快速开始

### 安装依赖
```bash
npm install
```

### 启动开发服务器
```bash
npm run dev
```

### 构建生产版本
```bash
npm run build
```

### 预览生产版本
```bash
npm run preview
```

## 环境配置

### 开发环境
创建 `.env.development` 文件：
```
VITE_API_BASE_URL=http://localhost:8080/api
VITE_APP_TITLE=38μs Trading Platform Admin
```

### 生产环境
创建 `.env.production` 文件：
```
VITE_API_BASE_URL=https://api.38microseconds.com/api
VITE_APP_TITLE=38μs Trading Platform Admin
```

## API 接口

### 认证接口
- `POST /api/auth/login` - 管理员登录
- `POST /api/auth/register` - 管理员注册

### 提交记录接口
- `GET /api/submission/all` - 获取所有提交记录
- `PUT /api/submission/review/{id}` - 审核提交记录
- `DELETE /api/submission/{id}` - 删除提交记录

## 主要功能

### 登录系统
- 用户名/密码登录
- 表单验证
- 错误提示
- 自动跳转

### 用户管理
- 分页显示用户列表
- 用户名搜索
- 用户删除确认
- 显示用户提交数量

### 记录管理
- 分页显示提交记录
- 按状态筛选（待审核/已通过/已拒绝）
- 用户名搜索
- 审核操作（通过/拒绝）
- 审核备注功能
- 记录删除

### 仪表板
- 统计卡片显示
- 最近提交记录表格
- 状态标签显示

## 开发说明

### 路由守卫
- 未登录用户自动跳转到登录页
- 已登录用户访问登录页自动跳转到仪表板

### 状态管理
- 使用 Pinia 管理认证状态
- Token 自动存储到 localStorage
- 登出时清理本地数据

### API 调用
- 统一的 Axios 配置
- 自动添加 Authorization 头
- 统一错误处理
- 401 状态码自动跳转登录

## 部署说明

1. 构建项目：`npm run build`
2. 将 `dist` 目录部署到 Web 服务器
3. 配置 Nginx 反向代理（可选）
4. 确保后端 API 服务正常运行

## 注意事项

- 确保后端 API 服务已启动
- 检查 CORS 配置
- 确认 API 基础 URL 配置正确
- 管理员账号需要先在后端注册
