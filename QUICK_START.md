# 快速启动指南

> 本指南适用于在新电脑上首次运行此项目

## 📋 前置要求

在开始之前，请确保你的电脑已安装以下软件：

### 必需软件

1. **Node.js** (推荐 v14+ 或 v16+)
   ```bash
   # 检查 Node.js 版本
   node --version
   
   # 检查 npm 版本
   npm --version
   ```

2. **Docker** 和 **Docker Compose**
   ```bash
   # 检查 Docker 版本
   docker --version
   
   # 检查 Docker Compose 版本
   docker-compose --version
   ```

3. **Git**（用于克隆项目）
   ```bash
   git --version
   ```

### 安装方式

- **Node.js**: 访问 [nodejs.org](https://nodejs.org/) 下载安装
- **Docker**: 访问 [docker.com](https://www.docker.com/get-started) 下载 Docker Desktop
- **Git**: 访问 [git-scm.com](https://git-scm.com/) 下载安装

---

## 🚀 快速启动步骤

### 步骤 1: 克隆项目

```bash
# 克隆项目到本地
git clone https://github.com/Acongm/nestjs-realworld-example-app.git

# 进入项目目录
cd nestjs-realworld-example-app
```

### 步骤 2: 安装依赖

```bash
# 使用 npm 安装依赖
npm install

# 或者使用 yarn（如果已安装）
yarn install
```

**如果遇到证书问题**，可以尝试：
```bash
npm install --strict-ssl=false
```

### 步骤 3: 配置环境变量（可选）

如果需要修改配置，可以复制示例配置文件：

```bash
# 复制配置文件（如果存在）
cp src/config.ts.example src/config.ts
```

### 步骤 4: 启动数据库（MongoDB + MySQL）

项目使用 Docker Compose 来管理数据库服务：

```bash
# 启动所有数据库服务（MongoDB + MySQL）
docker-compose up -d

# 查看容器运行状态
docker-compose ps
```

**等待数据库初始化完成**（约 10-30 秒）：
```bash
# 查看 MongoDB 日志
docker-compose logs mongodb

# 查看 MySQL 日志
docker-compose logs mysql
```

当看到以下信息时，表示数据库已就绪：
- MongoDB: `Waiting for connections`
- MySQL: `ready for connections`

### 步骤 5: 启动应用

```bash
# 开发模式（推荐，代码修改后自动重启）
npm run start:watch

# 或者生产模式
npm start
```

应用启动成功后，你会看到类似以下信息：
```
[Nest] 12345  - 2025/11/14 16:00:00   [NestFactory] Starting Nest application...
[Nest] 12345  - 2025/11/14 16:00:00   [InstanceLoader] TypeOrmModule dependencies initialized
[Nest] 12345  - 2025/11/14 16:00:00   [InstanceLoader] MongooseModule dependencies initialized
[Nest] 12345  - 2025/11/14 16:00:00   [NestApplication] Nest application successfully started
```

### 步骤 6: 验证应用运行

应用默认运行在 `http://localhost:3000`

**测试 API 接口**：

```bash
# 测试定时任务列表接口
curl http://localhost:3000/api/scheduled-tasks

# 测试文章列表接口
curl http://localhost:3000/api/articles
```

**在浏览器中访问**：
- 定时任务列表: http://localhost:3000/api/scheduled-tasks
- 文章列表: http://localhost:3000/api/articles

---

## 📊 数据库连接信息

### MongoDB（用于 scheduled-task 模块）

- **主机**: `localhost`
- **端口**: `27017`
- **数据库**: `nestjsrealworld`
- **用户名**: `admin`
- **密码**: `password123`
- **连接字符串**: `mongodb://admin:password123@localhost:27017/nestjsrealworld?authSource=admin`

### MySQL（用于 Article、User、Tag、Profile 等模块）

- **主机**: `localhost`
- **端口**: `3306`
- **数据库**: `nestjsrealworld`
- **用户名**: `root`
- **密码**: `password123`
- **配置文件**: `ormconfig.json`

---

## 🛠️ 常用命令

### 数据库管理

```bash
# 启动所有数据库服务
docker-compose up -d

# 停止所有数据库服务
docker-compose down

# 查看数据库服务状态
docker-compose ps

# 查看数据库日志
docker-compose logs -f

# 清空所有数据并重新开始
docker-compose down -v
docker-compose up -d
```

### 应用管理

```bash
# 开发模式（自动重启）
npm run start:watch

# 生产模式
npm start

# 构建生产版本
npm run prestart:prod
npm run start:prod

# 运行测试
npm test
```

---

## ❗ 常见问题

### 1. 端口被占用

如果遇到端口被占用错误：

```bash
# 检查端口占用情况
lsof -i :3000  # 应用端口
lsof -i :27017 # MongoDB 端口
lsof -i :3306  # MySQL 端口

# 停止占用端口的进程
kill -9 <PID>
```

### 2. 数据库连接失败

```bash
# 检查 Docker 容器是否运行
docker-compose ps

# 重启数据库服务
docker-compose restart

# 查看详细错误日志
docker-compose logs mongodb
docker-compose logs mysql
```

### 3. 依赖安装失败

```bash
# 清除缓存后重新安装
npm cache clean --force
rm -rf node_modules package-lock.json
npm install
```

### 4. TypeORM 连接 MySQL 失败

确保 MySQL 容器已完全启动（可能需要等待 30-60 秒）：
```bash
# 等待 MySQL 完全启动
docker-compose logs mysql | grep "ready for connections"
```

---

## 📝 项目结构说明

- `src/scheduled-task/` - 定时任务模块（使用 MongoDB）
- `src/article/` - 文章模块（使用 MySQL）
- `src/user/` - 用户模块（使用 MySQL）
- `src/tag/` - 标签模块（使用 MySQL）
- `src/profile/` - 用户资料模块（使用 MySQL）
- `docker-compose.yml` - Docker Compose 配置文件
- `ormconfig.json` - TypeORM 配置文件（MySQL）

---

## 🎯 下一步

- 查看 [API_USAGE.md](./API_USAGE.md) 了解详细的 API 使用说明
- 查看 [TROUBLESHOOTING.md](./TROUBLESHOOTING.md) 了解故障排除指南
- 查看 [README.md](./README.md) 了解项目详细信息

