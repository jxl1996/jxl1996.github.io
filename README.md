# CodeNotesVitePress

基于 VitePress 2 构建的个人技术知识库。

## 本地开发

```bash
npm ci
npm run docs:dev
```

生产构建：

```bash
npm run docs:build
```

## 在文档中展示 PDF

项目已经全局注册 `PdfViewer` 组件。PDF 不需要放在 `public` 目录，可以放在任意文章子目录中，例如：

```text
Flutter/
├─ pdf/
│  └─ 20260922_01.pdf
└─ pdf_demo.md
```

在 `Flutter/pdf_demo.md` 中通过相对路径导入 PDF：

```md
<script setup>
import renderingPdf from './pdf/20260922_01.pdf?url'
</script>

# PDF 阅读示例

<PdfViewer
  :src="renderingPdf"
  title="Flutter PDF 文档"
/>
```

`?url` 是 Vite 的资源导入查询参数。它让导入结果成为构建后的资源 URL，而不是尝试把 PDF 当成 JavaScript 模块解析；生产构建时 Vite 也会自动处理文件名哈希和站点基础路径。

组件参数：

| 参数 | 是否必填 | 默认值 | 说明 |
| --- | --- | --- | --- |
| `src` | 是 | - | 通过 `?url` 导入得到的站内 PDF 地址 |
| `title` | 是 | - | 阅读器标题，同时用于无障碍标签和下载文件名 |
| `height` | 否 | `75vh` | 阅读区域高度，支持任意合法 CSS 高度值 |

如需调整阅读区域高度：

```md
<PdfViewer
  :src="renderingPdf"
  title="Flutter PDF 文档"
  height="88vh"
/>
```

阅读器支持翻页、缩放、适应宽度、旋转、全屏、下载、搜索、缩略图和文档目录。打印、标注以及加载外部 PDF 不在支持范围内。

> 现有访问门属于客户端访问控制。构建后的 PDF 是静态资源，知道文件地址的用户仍可能直接访问；如需严格保密，需要在服务端增加真正的鉴权和文件响应控制。
