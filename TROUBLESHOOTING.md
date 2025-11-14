# 故障排查指南

## MongoDB 连接问题

### 错误信息
```
MongooseServerSelectionError: connect ECONNREFUSED 127.0.0.1:27017
```

### 解决方案

#### 方案 1：解决 Docker 网络问题（推荐）

如果 Docker 拉取镜像失败，可以尝试：

1. **配置 Docker 镜像源（国内用户）**

   创建或编辑 `~/.docker/daemon.json`：
   ```json
   {
     "registry-mirrors": [
       "https://docker.mirrors.ustc.edu.cn",
       "https://hub-mirror.c.163.com"
     ]
   }
   ```

   然后重启 Docker：
   ```bash
   # macOS
   # 在 Docker Desktop 中重启，或：
   killall Docker && open /Applications/Docker.app
   ```

2. **手动拉取镜像**
   ```bash
   docker pull mongo:6.0
   docker-compose up -d
   ```

3. **使用代理（如果有）**
   ```bash
   # 设置 Docker 代理
   # 在 Docker Desktop -> Settings -> Resources -> Proxies 中配置
   ```

#### 方案 2：使用本地 MongoDB（如果已安装）

如果本地已安装 MongoDB，修改 `src/app.module.ts`：

```typescript
// 无认证版本
MongooseModule.forRoot('mongodb://localhost:27017/nestjsrealworld')

// 或有认证版本（根据你的配置）
MongooseModule.forRoot('mongodb://username:password@localhost:27017/nestjsrealworld?authSource=admin')
```

#### 方案 3：临时禁用 MongoDB（仅用于测试其他功能）

如果暂时不需要 MongoDB 功能，可以注释掉 MongoDB 相关代码：

1. 在 `src/app.module.ts` 中注释掉 `MongooseModule.forRoot(...)`
2. 在 `src/scheduled-task/scheduled-task.module.ts` 中注释掉 `MongooseModule.forFeature(...)`

**注意**：这样定时任务功能将无法使用。

## 验证 MongoDB 连接

启动 MongoDB 后，验证连接：

```bash
# 检查容器是否运行
docker-compose ps

# 查看 MongoDB 日志
docker-compose logs mongodb

# 测试连接（如果安装了 mongosh）
docker exec -it nestjs-mongodb mongosh -u admin -p password123 --authenticationDatabase admin
```

## 应用启动步骤

1. **确保 MongoDB 运行**
   ```bash
   docker-compose ps
   # 如果没运行，执行：
   docker-compose up -d
   ```

2. **启动应用**
   ```bash
   yarn start:watch
   ```

3. **验证应用启动**
   查看终端输出，应该看到：
   ```
   [Nest] XXXX - YYYY/MM/DD HH:mm:ss [NestFactory] Starting Nest application...
   [Nest] XXXX - YYYY/MM/DD HH:mm:ss [InstanceLoader] MongooseModule dependencies initialized
   [Nest] XXXX - YYYY/MM/DD HH:mm:ss [NestApplication] Nest application successfully started
   ```

