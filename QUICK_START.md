# 快速启动指南

## 1. 启动 MongoDB（使用 Docker）

```bash
# 启动 MongoDB 容器
docker-compose up -d

# 查看容器是否运行
docker-compose ps
```

## 2. 安装依赖

```bash
npm install
```

如果遇到证书问题，可以尝试：
```bash
npm install --strict-ssl=false
```

## 3. 启动应用

```bash
# 开发模式（推荐，代码修改后自动重启）
npm run start:watch

# 或者生产模式
npm start
```

## 4. 测试 API

应用启动后访问：
- 定时任务列表: `http://localhost:3000/api/scheduled-tasks`
- 文章列表: `http://localhost:3000/api/articles`

## MongoDB 连接信息

- 主机: `localhost`
- 端口: `27017`
- 数据库: `nestjsrealworld`
- 用户名: `admin`
- 密码: `password123`

## 停止 MongoDB

```bash
docker-compose down
```

## 清空数据重新开始

```bash
docker-compose down -v
docker-compose up -d
```

