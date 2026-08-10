# Repository Guidelines

## 项目结构与模块组织

本仓库是基于 VitePress 2 的技术知识库。`Golang/`、`React/`、`Docker/`、`Figma/` 等顶层目录存放各主题的 Markdown 文章，首页为 `index.md`。文章专用图片应放在同级 `assets/` 目录，并使用相对路径引用。

站点配置位于 `.vitepress/config.mts`，主题扩展位于 `.vitepress/theme/`，各主题的侧边栏配置位于 `.vitepress/sidebars/`。无需构建处理的静态资源放入 `public/`。GitHub Pages 部署流程定义在 `.github/workflows/deploy.yml`。

新增文章时必须同步更新对应的侧边栏文件；新增顶层主题时，还需在 `.vitepress/sidebars/index.ts` 中注册。

## 构建、测试与本地开发

- `npm ci`：严格按照 `package-lock.json` 安装依赖，适用于全新环境和 CI。
- `npm run docs:dev`：启动本地开发服务器，默认端口为 `9527`，并允许局域网访问。
- `npm run docs:build`：生成生产站点至 `.vitepress/dist/`，同时检查构建错误和无效链接。
- `npm run docs:preview`：本地预览生产构建结果。

建议使用 Node.js 24，与 GitHub Actions 的运行环境保持一致。

## 编码风格与命名约定

Markdown 文章应仅包含一个一级标题，并使用 `##`、`###` 形成清晰层级。文件名应简洁、稳定且能表达主题；系列文章可采用 `01_first_project.md` 形式编号。侧边栏链接使用主题根路径，例如 `/Figma/01_appearance_learn.md`。

TypeScript 和 CSS 应遵循相邻文件的既有格式，使用含义明确的命名，避免夹带无关格式化。仅在说明设计意图、使用约束或不直观逻辑时添加简洁的中文注释。

## 测试指南

仓库当前未配置独立测试框架或覆盖率要求。提交前至少运行 `npm run docs:build`。涉及导航、样式或图片时，还应运行 `npm run docs:preview`，人工检查受影响页面、侧边栏链接、响应式布局及图片缩放功能。

## 提交与 Pull Request 规范

近期提交记录多为数字占位，未形成有效规范。新提交应使用清晰的 Conventional Commits 格式，例如 `docs(figma): 补充钢笔工具笔记` 或 `fix(theme): 修复页面切换后图片无法缩放`。

Pull Request 应说明改动目的和受影响主题，列出实际执行的验证，并关联相关 Issue。涉及主题、布局或导航等可见变化时应附截图。每个 PR 应聚焦单一目标，并确保新增文章与资源已加入对应侧边栏。
