> 前端模版，**并非ssr模版**

注意点

1. 默认禁用了`i18n`，需要可以在`src/router.tsx`里开启
2. 注意修改CDN配置
3. 路径如果搜索参数是必须的，那么SSG时应该配置合适的值

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

模版采用文件路由，根据`src/routes`文件夹自动生成路由

## Libs

- solid-js
- @tanstack/solid-router
- @tanstack/solid-query
- ky
