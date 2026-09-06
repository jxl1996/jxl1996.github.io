# mobile-app-ui-design

`mobile-app-ui-design` 是一个专门用来指导 AI 做**高质量移动端 App UI/UX 设计**的 Skill。它不是单纯“把页面画出来”，而是给 Codex / Claude Code 一套移动端设计规范、设计流程和组件选择原则，让生成出来的界面更像真正的 App，而不是“把网页缩小放到手机里”。([Claude Skills](https://claudeskills.info/skills/ceorkm/mobile-app-ui-design/mobile-app-ui-design/?utm_source=chatgpt.com))

它比较适合你现在这种场景：比如你想做 Slot 游戏大厅、小游戏 App、工具类 App，或者之后要让 Codex 先设计再实现页面。

### 它主要能做什么

核心覆盖这些内容：

- App 首页、详情页、登录页、个人中心等单页面设计
- Onboarding / 新手引导流程
- Bottom Tab、导航栏、弹窗、卡片、表单等移动端组件
- 多页面用户流程和信息架构
- 已有 App UI 的重新设计和美化
- React Native / Flutter / SwiftUI 风格界面的设计指导
- 移动端交互和手指操作区域设计
- 配色、字体、间距、层级、阴影、状态反馈
- 不同行业 App 的设计风格，例如 AI、金融、Crypto、健康等 ([杨Sir技能](https://skills.yangsir.net/skill/gh-mobile-app-ui-design?utm_source=chatgpt.com))

它里面有一些比较明确的设计规则，比如：

- 使用 8pt Grid 做间距体系
- 主操作尽量放在拇指容易触达的位置
- 控制字体层级，不要一个页面出现大量字号和字重
- 使用 60/30/10 的配色比例
- 避免按钮太小、文字对比度不足
- 避免使用 Web 特有的 hover 交互
- 输入框要考虑手机键盘类型 ([杨Sir技能](https://skills.yangsir.net/skill/gh-mobile-app-ui-design?utm_source=chatgpt.com))

------

## 怎么用

如果你已经装到 Codex，一般不需要写很复杂。

可以直接：

```text
使用 mobile-app-ui-design 设计一个 Slot 游戏大厅首页。

要求：
- 390×844
- 深色主题
- 顶部显示头像、昵称、余额
- 中间 Banner
- 游戏分类：Slots / Fishing / Poker
- 热门游戏双列卡片
- 底部 5 个 Tab
- 风格偏高级赌场娱乐 App
```

或者显式调用：

```text
$mobile-app-ui-design

设计一个移动端 Slot 游戏大厅首页。
```

如果你的 Agent 支持根据 Skill 描述自动匹配，那么类似：

```text
设计一个健身 App 首页
把这个移动端首页重新设计得更高级
设计一个 App onboarding 流程
```

这类请求本身就符合它的触发条件，因此理论上可以自动使用。它的 Skill 描述本身就明确把 `mobile app screen`、`app mockups`、`mobile UI`、`onboarding`、`mobile navigation` 等定义成触发场景。([Claude Skills](https://claudeskills.info/skills/ceorkm/mobile-app-ui-design/mobile-app-ui-design/?utm_source=chatgpt.com))

但我建议你在**重要设计任务里显式指定**，尤其 Codex 装了很多 Skill 的时候：

```text
$mobile-app-ui-design
```

这样最稳定。

------

## 它到底是「做设计稿」还是「做页面」？

这点很重要：

**它本质上是“设计指导 Skill”，不是 Figma，也不是 ImageGen。**

可以把它理解成：

```text
mobile-app-ui-design
        ↓
告诉 AI 应该怎么设计
        ↓
布局 / 配色 / 字体 / 组件 / UX / 交互
        ↓
再由其他工具真正产出
```

例如配合 Codex：

```text
mobile-app-ui-design
        ↓
生成设计方案
        ↓
Codex
        ↓
React Native / Flutter / HTML / Vue 页面
```

配合 Figma：

```text
mobile-app-ui-design
        ↓
确定 UI/UX 规范
        ↓
Figma MCP
        ↓
真正的 Figma 设计稿
```

配合 ImageGen：

```text
mobile-app-ui-design
        ↓
确定设计方向
        ↓
ImageGen
        ↓
高保真视觉效果图
```

所以它自己不会神奇地变成一个 `.fig` 文件。

------

## 对你来说比较推荐的工作流

你之前经常做移动端 Slot / 游戏大厅，我会比较推荐：

```text
需求
 ↓
mobile-app-ui-design
 ↓
确定布局、设计系统、组件、UX
 ↓
ImageGen
 ↓
看最终视觉效果
 ↓
Figma MCP
 ↓
生成可编辑设计稿
 ↓
Codex
 ↓
实现 Vue / React Native / Flutter / Cocos UI
```

如果你不需要 Figma，只想直接开发：

```text
需求
 ↓
mobile-app-ui-design
 ↓
Codex
 ↓
直接写页面
```

例如：

```text
$mobile-app-ui-design

帮我重新设计当前 Slot 游戏大厅首页。

先根据移动端 UI/UX 最佳实践确定：
1. 页面信息架构
2. 视觉层级
3. 配色
4. 字体
5. 间距体系
6. 卡片样式
7. Bottom Tab
8. Banner
9. 游戏分类

然后直接使用 Vue3 + Tailwind 实现，不要只给设计说明。
```

这种用法非常适合 Codex。

------

### 和你之前问的几个 Skill 的区别

可以简单记成：

| Skill                   | 更偏什么                     |
| ----------------------- | ---------------------------- |
| `mobile-app-ui-design`  | **手机 App UI/UX**           |
| `web-design-guidelines` | Web 页面设计规范 / 审查      |
| `ui-ux-pro-max`         | 更综合的 UI/UX 设计辅助      |
| `taste-skill`           | 提升设计审美、避免 AI 味     |
| Figma MCP               | 真正创建 / 修改 Figma 设计稿 |
| ImageGen                | 生成高保真视觉图片           |

所以如果你现在问我：

> **做手机 App 界面该优先用哪个？**

我会优先：

**`mobile-app-ui-design + taste-skill`**

如果最终还要 Figma：

**`mobile-app-ui-design → taste-skill → Figma MCP`**

如果最终直接开发：

**`mobile-app-ui-design → taste-skill → Codex 实现`**。([杨Sir技能](https://skills.yangsir.net/skill/gh-mobile-app-ui-design?utm_source=chatgpt.com))

对于你这种经常做**移动端 Slot 游戏大厅 / 小游戏 / 工具 App**的情况，`mobile-app-ui-design` 比 `web-design-guidelines` 更对口。