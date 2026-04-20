# 图片预览功能 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 为 VitePress 文档正文图片增加零依赖的点击预览能力，支持全屏灯箱、鼠标滚轮缩放、按钮缩放与关闭。

**Architecture:** 在主题层新增一个独立的 `ImagePreview` 组件，由 `.vitepress/theme/index.ts` 挂载到全站布局中。组件通过限定在 `.vp-doc` 范围内的事件委托识别正文图片点击，维护预览开关、图片地址和缩放比例，并在路由切换后继续对新页面生效；样式统一放在 `.vitepress/theme/custom.css`。

**Tech Stack:** VitePress 2 alpha、Vue 3 组合式 API、TypeScript、CSS

---

## File Structure

- Modify: `.vitepress/theme/index.ts`
  - 挂载新的图片预览组件，保持默认主题行为不变。
- Create: `.vitepress/theme/components/ImagePreview.vue`
  - 维护预览状态、目标图片、缩放逻辑、键盘与滚轮交互、点击关闭。
- Modify: `.vitepress/theme/custom.css`
  - 添加正文图片可点击样式，以及预览遮罩层、工具栏、按钮、图片容器样式。
- Verify against: `MQTT/01_mqtt_basic.md`
  - 作为本地手工验证图片预览的样例页面。

### Task 1: 挂载主题层图片预览组件

**Files:**
- Modify: `.vitepress/theme/index.ts:1-4`
- Create: `.vitepress/theme/components/ImagePreview.vue`

- [ ] **Step 1: 先写最小挂载代码骨架**

```ts
import DefaultTheme from 'vitepress/theme'
import type { Theme } from 'vitepress'
import ImagePreview from './components/ImagePreview.vue'
import './custom.css'

const theme: Theme = {
  ...DefaultTheme,
  Layout() {
    return (
      <>
        <DefaultTheme.Layout />
        <ImagePreview />
      </>
    )
  }
}

export default theme
```

- [ ] **Step 2: 在 `.vitepress/theme/index.ts` 中按现有风格接入组件**

```ts
import DefaultTheme from 'vitepress/theme'
import type { Theme } from 'vitepress'
import { h, Fragment } from 'vue'
import ImagePreview from './components/ImagePreview.vue'
import './custom.css'

const theme: Theme = {
    ...DefaultTheme,
    Layout() {
        return h(Fragment, [
            h(DefaultTheme.Layout),
            h(ImagePreview)
        ])
    }
}

export default theme
```

- [ ] **Step 3: 创建可渲染但默认不显示的组件骨架**

```vue
<script setup lang="ts">
import { ref } from 'vue'

const isOpen = ref(false)
</script>

<template>
  <div v-if="isOpen" class="image-preview-overlay"></div>
</template>
```

- [ ] **Step 4: 运行生产构建确认主题挂载没有语法错误**

Run: `npm run docs:build`
Expected: build 成功，输出包含 `build complete` 或等价成功信息，没有 `index.ts` / `.vue` 语法错误

- [ ] **Step 5: 提交这一小步**

```bash
git add .vitepress/theme/index.ts .vitepress/theme/components/ImagePreview.vue
git commit -m "feat: mount image preview component"
```

### Task 2: 实现正文图片点击打开与关闭

**Files:**
- Modify: `.vitepress/theme/components/ImagePreview.vue`

- [ ] **Step 1: 先写状态与事件目标的最小结构**

```ts
const isOpen = ref(false)
const imageSrc = ref('')
const imageAlt = ref('')

const openPreview = (src: string, alt: string) => {
  imageSrc.value = src
  imageAlt.value = alt
  isOpen.value = true
}

const closePreview = () => {
  isOpen.value = false
  imageSrc.value = ''
  imageAlt.value = ''
}
```

- [ ] **Step 2: 加入正文图片点击委托，只处理 `.vp-doc img`**

```ts
const handleDocumentClick = (event: MouseEvent) => {
  const target = event.target
  if (!(target instanceof HTMLImageElement)) {
    return
  }

  const docContainer = target.closest('.vp-doc')
  if (!docContainer) {
    return
  }

  event.preventDefault()
  event.stopPropagation()
  openPreview(target.currentSrc || target.src, target.alt || '')
}
```

- [ ] **Step 3: 在组件挂载和卸载时注册、清理点击与键盘事件**

```ts
const handleKeydown = (event: KeyboardEvent) => {
  if (event.key === 'Escape' && isOpen.value) {
    closePreview()
  }
}

onMounted(() => {
  document.addEventListener('click', handleDocumentClick)
  document.addEventListener('keydown', handleKeydown)
})

onBeforeUnmount(() => {
  document.removeEventListener('click', handleDocumentClick)
  document.removeEventListener('keydown', handleKeydown)
})
```

- [ ] **Step 4: 写出预览层模板，支持图片显示、遮罩关闭、按钮关闭**

```vue
<template>
  <Teleport to="body">
    <div
      v-if="isOpen"
      class="image-preview-overlay"
      @click="closePreview"
    >
      <button
        class="image-preview-close"
        type="button"
        aria-label="关闭图片预览"
        @click.stop="closePreview"
      >
        ×
      </button>

      <div class="image-preview-content" @click.stop>
        <img
          class="image-preview-image"
          :src="imageSrc"
          :alt="imageAlt"
        >
      </div>
    </div>
  </Teleport>
</template>
```

- [ ] **Step 5: 用完整组件实现替换骨架**

```vue
<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from 'vue'

const isOpen = ref(false)
const imageSrc = ref('')
const imageAlt = ref('')

const openPreview = (src: string, alt: string) => {
  imageSrc.value = src
  imageAlt.value = alt
  isOpen.value = true
}

const closePreview = () => {
  isOpen.value = false
  imageSrc.value = ''
  imageAlt.value = ''
}

const handleDocumentClick = (event: MouseEvent) => {
  const target = event.target
  if (!(target instanceof HTMLImageElement)) {
    return
  }

  const docContainer = target.closest('.vp-doc')
  if (!docContainer) {
    return
  }

  event.preventDefault()
  event.stopPropagation()
  openPreview(target.currentSrc || target.src, target.alt || '')
}

const handleKeydown = (event: KeyboardEvent) => {
  if (event.key === 'Escape' && isOpen.value) {
    closePreview()
  }
}

onMounted(() => {
  document.addEventListener('click', handleDocumentClick)
  document.addEventListener('keydown', handleKeydown)
})

onBeforeUnmount(() => {
  document.removeEventListener('click', handleDocumentClick)
  document.removeEventListener('keydown', handleKeydown)
})
</script>

<template>
  <Teleport to="body">
    <div
      v-if="isOpen"
      class="image-preview-overlay"
      @click="closePreview"
    >
      <button
        class="image-preview-close"
        type="button"
        aria-label="关闭图片预览"
        @click.stop="closePreview"
      >
        ×
      </button>

      <div class="image-preview-content" @click.stop>
        <img
          class="image-preview-image"
          :src="imageSrc"
          :alt="imageAlt"
        >
      </div>
    </div>
  </Teleport>
</template>
```

- [ ] **Step 6: 运行生产构建确认点击与预览结构能通过编译**

Run: `npm run docs:build`
Expected: build 成功，无 `ImagePreview.vue` 编译错误

- [ ] **Step 7: 提交这一小步**

```bash
git add .vitepress/theme/components/ImagePreview.vue
git commit -m "feat: add image preview overlay"
```

### Task 3: 实现缩放状态、滚轮缩放与工具栏按钮

**Files:**
- Modify: `.vitepress/theme/components/ImagePreview.vue`

- [ ] **Step 1: 增加缩放状态与边界控制函数**

```ts
const minScale = 0.5
const maxScale = 4
const scaleStep = 0.25
const scale = ref(1)

const clampScale = (value: number) => {
  return Math.min(maxScale, Math.max(minScale, Number(value.toFixed(2))))
}

const resetScale = () => {
  scale.value = 1
}

const zoomIn = () => {
  scale.value = clampScale(scale.value + scaleStep)
}

const zoomOut = () => {
  scale.value = clampScale(scale.value - scaleStep)
}
```

- [ ] **Step 2: 在打开和关闭预览时重置缩放**

```ts
const openPreview = (src: string, alt: string) => {
  imageSrc.value = src
  imageAlt.value = alt
  scale.value = 1
  isOpen.value = true
}

const closePreview = () => {
  isOpen.value = false
  imageSrc.value = ''
  imageAlt.value = ''
  scale.value = 1
}
```

- [ ] **Step 3: 增加滚轮缩放处理，只在预览开启时生效**

```ts
const handleWheel = (event: WheelEvent) => {
  if (!isOpen.value) {
    return
  }

  event.preventDefault()
  if (event.deltaY < 0) {
    zoomIn()
    return
  }

  zoomOut()
}
```

- [ ] **Step 4: 注册和清理滚轮事件**

```ts
onMounted(() => {
  document.addEventListener('click', handleDocumentClick)
  document.addEventListener('keydown', handleKeydown)
  document.addEventListener('wheel', handleWheel, { passive: false })
})

onBeforeUnmount(() => {
  document.removeEventListener('click', handleDocumentClick)
  document.removeEventListener('keydown', handleKeydown)
  document.removeEventListener('wheel', handleWheel)
})
```

- [ ] **Step 5: 在模板中加入缩放工具栏与变换样式**

```vue
<div class="image-preview-toolbar" @click.stop>
  <button type="button" aria-label="缩小图片" @click="zoomOut">-</button>
  <button type="button" aria-label="重置缩放" @click="resetScale">{{ scale.toFixed(2) }}x</button>
  <button type="button" aria-label="放大图片" @click="zoomIn">+</button>
</div>

<img
  class="image-preview-image"
  :src="imageSrc"
  :alt="imageAlt"
  :style="{ transform: `scale(${scale})` }"
>
```

- [ ] **Step 6: 用完整组件实现替换上一任务版本**

```vue
<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from 'vue'

const minScale = 0.5
const maxScale = 4
const scaleStep = 0.25

const isOpen = ref(false)
const imageSrc = ref('')
const imageAlt = ref('')
const scale = ref(1)

const clampScale = (value: number) => {
  return Math.min(maxScale, Math.max(minScale, Number(value.toFixed(2))))
}

const resetScale = () => {
  scale.value = 1
}

const zoomIn = () => {
  scale.value = clampScale(scale.value + scaleStep)
}

const zoomOut = () => {
  scale.value = clampScale(scale.value - scaleStep)
}

const openPreview = (src: string, alt: string) => {
  imageSrc.value = src
  imageAlt.value = alt
  scale.value = 1
  isOpen.value = true
}

const closePreview = () => {
  isOpen.value = false
  imageSrc.value = ''
  imageAlt.value = ''
  scale.value = 1
}

const handleDocumentClick = (event: MouseEvent) => {
  const target = event.target
  if (!(target instanceof HTMLImageElement)) {
    return
  }

  const docContainer = target.closest('.vp-doc')
  if (!docContainer) {
    return
  }

  event.preventDefault()
  event.stopPropagation()
  openPreview(target.currentSrc || target.src, target.alt || '')
}

const handleKeydown = (event: KeyboardEvent) => {
  if (event.key === 'Escape' && isOpen.value) {
    closePreview()
  }
}

const handleWheel = (event: WheelEvent) => {
  if (!isOpen.value) {
    return
  }

  event.preventDefault()
  if (event.deltaY < 0) {
    zoomIn()
    return
  }

  zoomOut()
}

onMounted(() => {
  document.addEventListener('click', handleDocumentClick)
  document.addEventListener('keydown', handleKeydown)
  document.addEventListener('wheel', handleWheel, { passive: false })
})

onBeforeUnmount(() => {
  document.removeEventListener('click', handleDocumentClick)
  document.removeEventListener('keydown', handleKeydown)
  document.removeEventListener('wheel', handleWheel)
})
</script>

<template>
  <Teleport to="body">
    <div
      v-if="isOpen"
      class="image-preview-overlay"
      @click="closePreview"
    >
      <button
        class="image-preview-close"
        type="button"
        aria-label="关闭图片预览"
        @click.stop="closePreview"
      >
        ×
      </button>

      <div class="image-preview-toolbar" @click.stop>
        <button type="button" aria-label="缩小图片" @click="zoomOut">-</button>
        <button type="button" aria-label="重置缩放" @click="resetScale">{{ scale.toFixed(2) }}x</button>
        <button type="button" aria-label="放大图片" @click="zoomIn">+</button>
      </div>

      <div class="image-preview-content" @click.stop>
        <img
          class="image-preview-image"
          :src="imageSrc"
          :alt="imageAlt"
          :style="{ transform: `scale(${scale})` }"
        >
      </div>
    </div>
  </Teleport>
</template>
```

- [ ] **Step 7: 运行生产构建确认缩放逻辑通过编译**

Run: `npm run docs:build`
Expected: build 成功，无滚轮事件或模板绑定错误

- [ ] **Step 8: 提交这一小步**

```bash
git add .vitepress/theme/components/ImagePreview.vue
git commit -m "feat: add zoom controls for image preview"
```

### Task 4: 补齐预览样式并限定正文图片可点击态

**Files:**
- Modify: `.vitepress/theme/custom.css`

- [ ] **Step 1: 为正文图片增加可点击态，不影响非正文图片**

```css
.vp-doc img {
    cursor: zoom-in;
}
```

- [ ] **Step 2: 添加预览遮罩层与内容容器样式**

```css
.image-preview-overlay {
    position: fixed;
    inset: 0;
    z-index: 9999;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 24px;
    background: rgba(0, 0, 0, 0.82);
}

.image-preview-content {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: 100%;
    overflow: auto;
}
```

- [ ] **Step 3: 添加图片、关闭按钮、工具栏样式**

```css
.image-preview-image {
    max-width: min(92vw, 1400px);
    max-height: 88vh;
    transform-origin: center center;
    transition: transform 0.12s ease;
    box-shadow: 0 12px 40px rgba(0, 0, 0, 0.35);
}

.image-preview-close,
.image-preview-toolbar button {
    border: 0;
    border-radius: 10px;
    color: #fff;
    background: rgba(255, 255, 255, 0.14);
    cursor: pointer;
}

.image-preview-close {
    position: absolute;
    top: 24px;
    right: 24px;
    width: 40px;
    height: 40px;
    font-size: 28px;
    line-height: 1;
}

.image-preview-toolbar {
    position: absolute;
    top: 24px;
    left: 50%;
    transform: translateX(-50%);
    display: flex;
    gap: 8px;
}

.image-preview-toolbar button {
    min-width: 44px;
    height: 40px;
    padding: 0 12px;
    font-size: 16px;
}
```

- [ ] **Step 4: 将样式补到 `.vitepress/theme/custom.css` 末尾**

```css
.vp-doc img {
    cursor: zoom-in;
}

.image-preview-overlay {
    position: fixed;
    inset: 0;
    z-index: 9999;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 24px;
    background: rgba(0, 0, 0, 0.82);
}

.image-preview-content {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: 100%;
    overflow: auto;
}

.image-preview-image {
    max-width: min(92vw, 1400px);
    max-height: 88vh;
    transform-origin: center center;
    transition: transform 0.12s ease;
    box-shadow: 0 12px 40px rgba(0, 0, 0, 0.35);
}

.image-preview-close,
.image-preview-toolbar button {
    border: 0;
    border-radius: 10px;
    color: #fff;
    background: rgba(255, 255, 255, 0.14);
    cursor: pointer;
}

.image-preview-close {
    position: absolute;
    top: 24px;
    right: 24px;
    width: 40px;
    height: 40px;
    font-size: 28px;
    line-height: 1;
}

.image-preview-toolbar {
    position: absolute;
    top: 24px;
    left: 50%;
    transform: translateX(-50%);
    display: flex;
    gap: 8px;
}

.image-preview-toolbar button {
    min-width: 44px;
    height: 40px;
    padding: 0 12px;
    font-size: 16px;
}
```

- [ ] **Step 5: 运行生产构建确认样式文件无副作用错误**

Run: `npm run docs:build`
Expected: build 成功，CSS 被正常打包

- [ ] **Step 6: 提交这一小步**

```bash
git add .vitepress/theme/custom.css
git commit -m "style: add image preview overlay styles"
```

### Task 5: 本地手工验证正文图片预览

**Files:**
- Verify against: `.vitepress/theme/index.ts`
- Verify against: `.vitepress/theme/components/ImagePreview.vue`
- Verify against: `.vitepress/theme/custom.css`
- Verify against: `MQTT/01_mqtt_basic.md`

- [ ] **Step 1: 启动本地开发服务器**

Run: `npm run docs:dev -- --host 0.0.0.0 --port 9527`
Expected: 本地服务启动成功，可在 `http://127.0.0.1:9527/` 打开站点

- [ ] **Step 2: 打开带图片的样例页面并验证基础预览**

Open: `http://127.0.0.1:9527/MQTT/01_mqtt_basic.html`
Expected: 点击正文图片后出现全屏遮罩层，图片居中显示，非正文区域图片不触发预览

- [ ] **Step 3: 验证关闭行为**

Manual check:
- 点击遮罩空白区域，预览关闭
- 点击右上角关闭按钮，预览关闭
- 按 `Esc`，预览关闭

Expected: 三种关闭方式都能正常工作

- [ ] **Step 4: 验证缩放行为**

Manual check:
- 重新打开图片后，工具栏显示 `1.00x`
- 鼠标滚轮向上滚动，图片放大
- 鼠标滚轮向下滚动，图片缩小
- 点击 `+`、`-`、比例按钮，分别能放大、缩小、重置

Expected: 缩放比例始终在 `0.5x` 到 `4x` 之间，新打开图片时自动恢复 `1.00x`

- [ ] **Step 5: 验证路由切换后的页面仍生效**

Manual check:
- 从 `MQTT/01_mqtt_basic.html` 切换到另一个带图片页面，例如 `http://127.0.0.1:9527/PostgreSQL/pgsql20260208.html`
- 点击正文图片再次打开预览

Expected: 新页面中的正文图片仍然可预览

- [ ] **Step 6: 运行最终生产构建**

Run: `npm run docs:build`
Expected: build 成功，作为最终交付前验证

- [ ] **Step 7: 提交最终结果**

```bash
git add .vitepress/theme/index.ts .vitepress/theme/components/ImagePreview.vue .vitepress/theme/custom.css
git commit -m "feat: add image preview for doc images"
```

## Self-Review

- Spec coverage: 已覆盖正文图片预览、遮罩层、滚轮缩放、按钮缩放、Esc/遮罩关闭、仅正文作用域、路由切换后仍可用、移动端仅保证基础打开关闭。
- Placeholder scan: 无 `TODO`、`TBD`、"稍后实现" 等占位语句；每个代码步骤都给出明确代码或命令。
- Type consistency: 计划中统一使用 `ImagePreview.vue`、`isOpen`、`imageSrc`、`imageAlt`、`scale`、`zoomIn`、`zoomOut`、`resetScale`、`closePreview` 命名，无前后不一致。
