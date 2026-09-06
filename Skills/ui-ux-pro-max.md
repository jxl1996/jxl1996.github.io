# ui-ux-pro-max

`ui-ux-pro-max` 可以理解成一个专门给 AI 编程 Agent 用的 **UI/UX 设计专家 Skill**。

它不是 Figma，也不是图片生成器，而是让 Codex / Claude Code / Cursor 在「设计和实现界面」时，少凭感觉写 UI，多按照一套现成的设计知识库来做。它目前支持 Web、移动端、桌面端，并覆盖设计系统、布局、配色、字体、交互、响应式、可访问性、图表、动画以及具体前端技术栈。([GitHub](https://github.com/Koubos/ui-ux-pro-max?utm_source=chatgpt.com))

### 它主要解决什么问题

例如你直接让 Codex：

> 做一个后台管理 Dashboard

没有这个 Skill 时，Codex 更多是根据模型自身经验随机构思，容易出现「AI 味很重」的问题：卡片乱堆、渐变滥用、间距不统一、颜色体系不完整。

装了 `ui-ux-pro-max` 后，它会先从自己的 UI/UX 数据库中推导：

**产品类型 → 页面模式 → 视觉风格 → 配色 → 字体 → 布局 → UX 规则 → 技术栈实现**

当前 Codex 配置描述里包含例如：

- 79 种 UI 风格，其中约 50 种处于活跃推荐集合
- 192 个产品配色和 reasoning profiles
- 74 套字体搭配
- 119 条 UX 指南
- 105 种图标相关建议
- 17 个 GSAP 动效 preset
- 25 类图表
- 22 种技术栈

而且这些数据是本地可检索的。([GitHub](https://github.com/nextlevelbuilder/ui-ux-pro-max-skill/blob/main/cli/assets/templates/platforms/codex.json?utm_source=chatgpt.com))

所以它真正有价值的地方不是「帮你写 CSS」，而是：

**先帮 Codex 做 UI 决策，再让 Codex写代码。**

------

## 你现在用 Codex，怎么使用

对你来说，我推荐两种方式。

### ① 直接自然语言，让它自动触发

目前官方文档把 Codex CLI 列在 Skill Mode 支持范围里，UI/UX 请求可以自动触发。([GitHub](https://github.com/Koubos/ui-ux-pro-max?utm_source=chatgpt.com))

例如：

```text
帮我重新设计当前项目的登录页面。

要求：
- 深色科技风
- PC + 手机响应式
- 提升信息层级
- 不修改现有接口
- 使用项目现有 Vue 技术栈
```

如果 `ui-ux-pro-max` 已正确安装，Codex 应当能够根据 Skill 描述判断这是 UI/UX 工作并自动使用。

所以：

**不一定每次都要显式 `$ui-ux-pro-max`。**

------

### ② 显式调用，我更推荐这种

你之前已经在用 Codex Skills，我建议重要 UI 任务直接写：

```text
$ui-ux-pro-max 重新设计当前项目首页
```

或者：

```text
$ui-ux-pro-max

帮我设计一个 Slot 游戏大厅移动端首页。

产品：
Slot 游戏平台

目标用户：
手机用户

页面要求：
- 顶部用户余额
- Banner
- 游戏分类
- 热门游戏
- 推荐游戏
- 底部导航

风格：
深色 + 金色
高级赌场风
不要廉价渐变
不要过度玻璃拟态

技术栈：
Vue 3 + TypeScript
```

官方使用示例中，Codex CLI 也提供了 `$ui-ux-pro-max ...` 这种显式调用方式。([UI UX Pro Max Skill](https://ui-ux-pro-max-skill.com/docs/examples/?utm_source=chatgpt.com))

你这么写的好处是非常明确：

> **这次任务一定按照 ui-ux-pro-max 的设计流程处理。**

不会依赖 Codex 的自动 Skill 匹配。

------

## 它内部大概是怎么工作的

它不只是一个长 Prompt。

目前这个 Skill 有一套本地检索与设计系统生成机制。其 Codex 版本的工作流大致是：

```text
你的需求
   ↓
识别产品类型
   ↓
生成 Design System
   ↓
检索 Style
   ↓
检索 Color
   ↓
检索 Typography
   ↓
检索 UX Guidelines
   ↓
检索对应技术栈
   ↓
形成 UI 决策
   ↓
Codex 实现页面
```

它的设计系统层会组合 product、style、color、landing pattern、typography 和 UI reasoning 等数据，最终输出类似：

```text
Pattern
Visual Style
Palette
Typography
Effects
Anti-patterns
```

然后再进入代码实现。([GitHub](https://github.com/LeorickCoder/awesome-codex-skills/blob/main/ui-ux-pro-max/references/architecture.md?utm_source=chatgpt.com))

这就是它和普通：

```text
帮我把页面做漂亮一点
```

之间最大的区别。

------

## 最适合你用它的场景

按照你平时做的项目，我觉得它特别适合这几类：

| 场景                 | 是否推荐 |
| -------------------- | -------- |
| Slot 游戏大厅 UI     | ⭐⭐⭐⭐⭐    |
| 后台管理系统         | ⭐⭐⭐⭐⭐    |
| Vue / React 页面设计 | ⭐⭐⭐⭐⭐    |
| H5 页面              | ⭐⭐⭐⭐⭐    |
| App UI               | ⭐⭐⭐⭐⭐    |
| Landing Page         | ⭐⭐⭐⭐⭐    |
| 已有页面美化         | ⭐⭐⭐⭐⭐    |
| 响应式改造           | ⭐⭐⭐⭐     |
| UX Review            | ⭐⭐⭐⭐⭐    |
| 纯后端 Go 开发       | ❌        |
| 数据库设计           | ❌        |
| API 开发             | ❌        |

它不仅能做「从零设计」，也适合：

```text
$ui-ux-pro-max review 当前页面 UI
```

例如：

```text
$ui-ux-pro-max

检查当前项目首页 UI/UX。

重点检查：
- 信息层级
- 间距
- 字号
- 配色
- 按钮状态
- 移动端
- loading / empty / error
- 可访问性

先给出问题和修改方案，再修改代码。
```

这类任务其实非常适合它，因为 Skill 本身明确覆盖 designing、building、reviewing、fixing interfaces。([GitHub](https://github.com/nextlevelbuilder/ui-ux-pro-max-skill/blob/main/cli/assets/templates/platforms/codex.json?utm_source=chatgpt.com))

------

## 和你刚才问的 `web-design-guidelines` 有什么区别

这两个不要混为一谈。

简单理解：

|               | `ui-ux-pro-max` | `web-design-guidelines`    |
| ------------- | --------------- | -------------------------- |
| 定位          | **设计助手**    | **设计规范审查**           |
| 重点          | 怎么设计得更好  | 有没有违反 Web UI 最佳实践 |
| 配色          | ✅               | 较少                       |
| 字体搭配      | ✅               | 较少                       |
| 风格推荐      | ✅               | ❌                          |
| Design System | ✅               | ❌/有限                     |
| UX            | ✅               | ✅                          |
| Accessibility | ✅               | ✅                          |
| UI Review     | ✅               | ✅                          |
| 从 0 做页面   | ⭐⭐⭐⭐⭐           | ⭐⭐⭐                        |
| 检查已有页面  | ⭐⭐⭐⭐            | ⭐⭐⭐⭐⭐                      |

所以我建议你以后：

```text
做新页面
↓
ui-ux-pro-max
```

开发完以后：

```text
检查页面
↓
web-design-guidelines
```

甚至可以组合：

```text
$ui-ux-pro-max 设计并实现这个页面。

完成后使用 web-design-guidelines
检查响应式、可访问性、交互和 UI 规范，并修复发现的问题。
```

这套组合非常适合你现在 **Codex + Vue/前端 + Figma** 的工作流。

------

### 你可以直接保存这个万能提示词

```text
$ui-ux-pro-max

基于当前项目，为这个功能设计并实现专业级 UI。

要求：
1. 先分析产品类型、目标用户和页面目标。
2. 建立统一的设计系统，包括：
   - 颜色
   - 字体
   - 间距
   - 圆角
   - 阴影
   - 组件状态
3. 确保清晰的信息层级。
4. 同时考虑 Desktop / Tablet / Mobile。
5. 避免常见 AI UI：
   - 过度渐变
   - 过度玻璃拟态
   - 卡片堆砌
   - 无意义大标题
   - 过多圆角
6. 保留当前项目已有技术栈和代码风格。
7. 优先复用现有组件。
8. 考虑 loading / empty / error / disabled 状态。
9. 考虑 accessibility 和 touch target。
10. 完成后检查视觉一致性和响应式效果。
```

对你的使用方式，我会优先选择 **显式 `$ui-ux-pro-max`**。虽然它可以自动触发，但重要页面显式指定更稳定，也方便你知道 Codex 这次到底应该依据哪套 Skill 工作。