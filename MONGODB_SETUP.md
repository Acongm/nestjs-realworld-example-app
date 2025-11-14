# MongoDB 本地运行指南

## 前置要求

- Docker 已安装并运行
- Node.js 和 npm 已安装

## 快速开始

### 1. 启动 MongoDB（使用 Docker）

```bash
# 启动 MongoDB 容器
docker-compose up -d

# 查看容器状态
docker-compose ps

# 查看日志
docker-compose logs -f mongodb
```

### 2. 安装依赖（如果还没安装）

```bash
npm install
```

### 3. 配置应用

确保 `src/config.ts` 文件存在（如果不存在会自动从示例文件复制）：

```bash
cp src/config.ts.example src/config.ts
```

### 4. 启动应用

```bash
# 开发模式（自动重启）
npm run start:watch

# 或者生产模式
npm start
```

### 5. 测试 API

应用启动后，访问：
- API 基础路径: `http://localhost:3000/api`
- 文章列表: `http://localhost:3000/api/articles`
- 定时任务列表: `http://localhost:3000/api/scheduled-tasks`

## MongoDB 连接信息

- **主机**: localhost
- **端口**: 27017
- **数据库名**: nestjsrealworld
- **用户名**: admin
- **密码**: password123
- **认证数据库**: admin

## 常用 Docker 命令

```bash
# 停止 MongoDB
docker-compose down

# 停止并删除数据卷（会清空所有数据）
docker-compose down -v

# 重启 MongoDB
docker-compose restart

# 进入 MongoDB 容器
docker exec -it nestjs-mongodb bash

# 使用 MongoDB Shell 连接
docker exec -it nestjs-mongodb mongosh -u admin -p password123 --authenticationDatabase admin
```

## 数据持久化

MongoDB 数据存储在 Docker volume `mongodb_data` 中，即使容器停止，数据也会保留。

如果需要清空数据重新开始：

```bash
docker-compose down -v
docker-compose up -d
```

## 故障排查

### 端口被占用

如果 27017 端口被占用，可以修改 `docker-compose.yml` 中的端口映射：

```yaml
ports:
  - "27018:27017"  # 改为其他端口
```

同时需要更新 `ormconfig.json` 中的端口号。

### 连接失败

1. 确保 Docker 容器正在运行：`docker-compose ps`
2. 检查容器日志：`docker-compose logs mongodb`
3. 验证网络连接：`docker exec -it nestjs-mongodb mongosh --eval "db.adminCommand('ping')"`

## 环境变量配置（可选）

如果需要自定义 MongoDB 配置，可以创建 `.env` 文件：

```env
MONGO_HOST=localhost
MONGO_PORT=27017
MONGO_USERNAME=admin
MONGO_PASSWORD=password123
MONGO_DATABASE=nestjsrealworld
```

然后在 `ormconfig.json` 中使用环境变量（需要安装 `dotenv` 包）。

