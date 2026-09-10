# WordsFunny

WordsFunny 是一个英语单词学习网站，围绕单词书、单词详情、学习进度和评论互动组织学习流程。帮助用户轻松学单词！

## 功能介绍

- 以单词书为中心组织学习内容，支持浏览单词书、进入词表、收藏常用单词书，并在全部、已掌握、未掌握之间切换学习范围。
- 提供完整的单词详情页，集中展示音标、发音、记忆提示、释义、短语、例句、同义词和同根词，方便在一个页面完成理解和复习。
- 支持全站单词搜索，搜索结果会带出所属单词书，适合快速定位陌生词或跨单词书查找相关内容。
- 登录后可以记录个人学习进度，标记单词掌握状态，并通过个人资料中的学习日历查看近半年的学习情况。
- 提供账号、评论和主题等基础体验，包括邮箱注册/登录/重设密码、单词评论与点赞、浅色/深色主题，以及桌面端和移动端适配。

## 技术栈

| 分类       | 技术                                                    |
| ---------- | ------------------------------------------------------- |
| 前端       | React, React Router, Vite, HeroUI, Tailwind CSS, Lucide |
| 请求       | oRPC, TanStack Query                                    |
| 状态与表单 | Jotai, React Hook Form, Zod                             |
| 服务端     | oRPC Server, JSON Web Token, Nodemailer                 |
| 数据库     | PostgreSQL, Drizzle ORM                                 |

## 项目结构

```text
app/
  .server/
    common/        服务端公共能力
    db/            数据库连接、表结构和初始化 SQL
    router/        服务端接口
    server.ts      /rpc 请求入口
  common/          公共常量、类型、表单校验和请求客户端
  components/
    global/        全局弹窗、设置、个人资料、移动端抽屉
    layout/        单词书栏、词表栏、单词详情栏
    common/        通用组件
  hooks/           业务 hooks
  routes/          路由文件
public/
  books/           单词书封面
  favicon.svg      网站图标
```

## 开发指南

### 1. 安装依赖

```sh
npm install
```

### 2. 准备数据库

创建 PostgreSQL 数据库。使用 Docker 时可以直接启动一个本地数据库：

```sh
docker run -d \
  --name wordsfunny-postgres \
  -p 5432:5432 \
  -v wordsfunny_postgres_data:/var/lib/postgresql/data \
  -e POSTGRES_USER=postgres \
  -e POSTGRES_PASSWORD=your_password \
  -e POSTGRES_DB=wordsfunny \
  postgres:16-alpine
```

### 3. 配置环境变量

在项目根目录创建 `.env`：

```env
DATABASE_URL="postgresql://postgres:your_password@localhost:5432/wordsfunny"
JWT_SECRET="replace_with_a_long_random_secret"
CRYPTO_SECRET="replace_with_a_long_random_secret"
EMAIL_SERVER_ADDRESS="your_email@163.com"
EMAIL_SERVER_PASS="your_smtp_authorization_code"
```

`EMAIL_SERVER_ADDRESS` 和 `EMAIL_SERVER_PASS` 可选，是用于发送注册和重设密码验证码。
当前代码默认使用 `smtp.163.com`，如果使用其他邮件服务，需要同步调整 `app/.server/common/mail.ts`。

### 4. 初始化表结构

```sh
psql "postgresql://postgres:your_password@localhost:5432/wordsfunny" -f app/.server/db/init.sql
```

### 5. 导入词库数据

```text
https://mypikpak.com/s/VOEs95bTB0KGAg75t0Nrs-oOo1
```

下载数据压缩包，解压后使用 TablePlus、psql 或其他数据库工具导入。导入顺序建议为：

```text
Book -> Word -> Translation / Phrase / Sentence / Synonym / Cognate
```

### 6. 启动项目

本地调试：

```sh
npm run dev
```

默认访问地址：

```text
http://localhost:3001
```

生产构建与启动：

```sh
npm run build
npm run start
```
