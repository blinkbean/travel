# 漫旅中国 ManTravel

## 跨域问题解决说明

### 问题描述
之前前端代码直接调用 `http://localhost:1337` API，当从远程访问网站时会出现跨域（CORS）问题。

### 解决方案

#### 1. Nginx 反向代理配置
已在 [`nginx.conf`](nginx.conf) 中添加 API 反向代理配置：
- 所有 `/api/*` 请求会被转发到 Strapi 后端 `http://localhost:1337/api/*`
- 配置了 CORS 头，允许跨域访问
- 处理 OPTIONS 预检请求

#### 2. 前端代码修改
已将所有前端代码中的 `http://localhost:1337` 改为相对路径 `/api`：
- [`js/main.js`](js/main.js) - 目的地、线路、评价、瞬间等 API 调用
- [`js/destination.js`](js/destination.js) - 目的地详情 API 调用
- [`js/tour.js`](js/tour.js) - 线路详情 API 调用

### 部署步骤

1. **更新 Nginx 配置**
   ```bash
   sudo cp nginx.conf /etc/nginx/conf.d/travel.conf
   sudo nginx -t
   sudo systemctl reload nginx
   ```

2. **确保 Strapi 服务运行**
   确保 Strapi 在服务器上运行于 `http://localhost:1337`

3. **上传前端文件**
   使用 [`deploy.sh`](deploy.sh) 或 [`deploy-scp.sh`](deploy-scp.sh) 脚本部署前端文件

4. **验证配置**
   - 访问网站主页面
   - 打开浏览器开发者工具，查看 Network 标签
   - 确认 API 请求成功（状态码 200）
   - 确认没有 CORS 错误

### 技术架构
- **前端**: 纯静态 HTML/CSS/JavaScript
- **后端**: Strapi CMS (运行在 localhost:1337)
- **Web 服务器**: Nginx (反向代理 + 静态资源服务)
- **SSL**: HTTPS 加密（参见 [DEPLOY_HTTPS.md](DEPLOY_HTTPS.md)）

### 目录结构
```
travel/
├── index.html          # 首页
├── destination.html    # 目的地页面
├── tour.html          # 线路页面
├── css/               # 样式文件
├── js/                # JavaScript 文件
│   ├── main.js        # 主要功能
│   ├── destination.js # 目的地功能
│   ├── tour.js        # 线路功能
│   └── i18n.js        # 国际化
├── nginx.conf         # Nginx 配置文件
└── deploy*.sh         # 部署脚本
```
