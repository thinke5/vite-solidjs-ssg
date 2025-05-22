> 前端模版，**并非ssr模版**

## Usage

```bash
# 克隆到新文件夹
degit thinke5/vite-solidjs-ssg projectName
# 克隆到当前文件夹
degit thinke5/vite-solidjs-ssg
```

```sh
# 安装依赖，建议使用 pnpm
pnpm i
# 启动开发
npm run dev:rdm
# 启动构建
npm run build:rdm
```

## 文件路由

模版采用文件路由，根据`src/pages`文件夹自动生成路由

## Libs

- solid
- solid-router
- ky
- @tanstack/solid-query
