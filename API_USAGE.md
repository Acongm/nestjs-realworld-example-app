# 定时任务 API 使用指南

## 启动步骤

### 1. 启动 MongoDB

```bash
# 启动 MongoDB 容器
docker-compose up -d

# 查看容器状态
docker-compose ps

# 查看日志（如果需要）
docker-compose logs -f mongodb
```

### 2. 启动应用

```bash
# 开发模式（推荐，代码修改后自动重启）
yarn start:watch

# 或生产模式
yarn start
```

应用启动后会在 `http://localhost:3000` 运行。

## API 接口

### 基础路径
所有接口的基础路径：`http://localhost:3000/api`

---

### 1. 获取定时任务列表

**接口**: `GET /api/scheduled-tasks`

**请求示例**:
```bash
curl http://localhost:3000/api/scheduled-tasks
```

**响应示例**:
```json
{
  "tasks": [
    {
      "id": "security-operations-report-system",
      "enable": true,
      "frequency": "weekly",
      "time": {
        "time": "08:00",
        "week": "Mon"
      },
      "recipient": ["admin@example.com"],
      "pageIds": ["6915a4a1c967bf86ce6623a2"],
      "branchIds": [],
      "cronExpression": "0 0 8 * * 1",
      "created": "2025-11-14T10:00:00.000Z",
      "updated": "2025-11-14T10:00:00.000Z"
    }
  ],
  "tasksCount": 1
}
```

---

### 2. 创建或更新定时任务

**接口**: `PUT /api/scheduled-tasks`

#### 场景 1: 启用任务（enable: true）

**请求示例**:
```bash
curl -X PUT http://localhost:3000/api/scheduled-tasks \
  -H "Content-Type: application/json" \
  -d '{
    "enable": true,
    "frequency": "weekly",
    "time": {
      "time": "08:00",
      "week": "Mon"
    },
    "recipient": [
      "admin@example.com"
    ],
    "pageIds": [
      "6915a4a1c967bf86ce6623a2"
    ],
    "branchIds": []
  }'
```

**请求体说明**:
- `enable`: `true` - 启用任务
- `frequency`: `"daily"` | `"weekly"` | `"monthly"` - 执行频率（枚举）
- `time.time`: `"HH:mm"` - 执行时间（必填）
- `time.week`: `"Mon"` | `"Tue"` | `"Wed"` | `"Thu"` | `"Fri"` | `"Sat"` | `"Sun"` - 星期几（weekly 时必填）
- `time.day`: `1-31` - 日期（monthly 时必填）
- `recipient`: 字符串数组 - 接收人邮箱列表（必填）
- `pageIds`: 字符串数组 - 页面ID列表（必填）
- `branchIds`: 字符串数组 - 分支ID列表（必填）

**注意**: 不需要传入 `id` 字段，系统会自动使用固定的系统 ID。

#### 场景 2: 关闭任务（enable: false）

**请求示例**:
```bash
curl -X PUT http://localhost:3000/api/scheduled-tasks \
  -H "Content-Type: application/json" \
  -d '{
    "enable": false
  }'
```

**请求体说明**:
- `enable`: `false` - 关闭任务
- 其他字段都不需要传

---

## 不同频率的请求示例

### Daily（每天执行）

```json
{
  "enable": true,
  "frequency": "daily",
  "time": {
    "time": "09:00"
  },
  "recipient": ["admin@example.com"],
  "pageIds": ["6915a4a1c967bf86ce6623a2"],
  "branchIds": []
}
```

### Weekly（每周执行）

```json
{
  "enable": true,
  "frequency": "weekly",
  "time": {
    "time": "08:00",
    "week": "Mon"
  },
  "recipient": ["admin@example.com"],
  "pageIds": ["6915a4a1c967bf86ce6623a2"],
  "branchIds": []
}
```

### Monthly（每月执行）

```json
{
  "enable": true,
  "frequency": "monthly",
  "time": {
    "time": "08:00",
    "day": 15
  },
  "recipient": ["admin@example.com"],
  "pageIds": ["6915a4a1c967bf86ce6623a2"],
  "branchIds": []
}
```

---

## 使用 Postman 或类似工具

### 获取列表
- **Method**: `GET`
- **URL**: `http://localhost:3000/api/scheduled-tasks`

### 创建/更新任务
- **Method**: `PUT`
- **URL**: `http://localhost:3000/api/scheduled-tasks`
- **Headers**: 
  - `Content-Type: application/json`
- **Body** (raw JSON):
```json
{
  "enable": true,
  "frequency": "weekly",
  "time": {
    "time": "08:00",
    "week": "Mon"
  },
  "recipient": ["admin@example.com"],
  "pageIds": ["6915a4a1c967bf86ce6623a2"],
  "branchIds": []
}
```

---

## 常见问题

### 1. MongoDB 连接失败

**错误**: `connect ECONNREFUSED 127.0.0.1:27017`

**解决方法**:
```bash
# 确保 Docker 正在运行
docker ps

# 启动 MongoDB
docker-compose up -d

# 检查容器状态
docker-compose ps
```

### 2. 端口被占用

如果 27017 端口被占用，可以修改 `docker-compose.yml` 中的端口映射。

### 3. 验证失败

确保请求体格式正确，特别是：
- `frequency` 必须是枚举值：`"daily"`、`"weekly"` 或 `"monthly"`
- `week` 必须是：`"Mon"`、`"Tue"`、`"Wed"`、`"Thu"`、`"Fri"`、`"Sat"` 或 `"Sun"`
- `day` 必须在 1-31 之间
