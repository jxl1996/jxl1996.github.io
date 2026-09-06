# taste-skill

`taste-skill` 一般可以理解为一个**“审美 / 品味校准”类 Skill**：它不是专门负责把页面代码写出来，而是帮助 AI 在做 UI、视觉、排版、产品界面时，避免“AI 味太重”、模板感太强，提升设计判断。

它通常更偏向解决这些问题：

- 页面看起来是不是太普通、太像模板
- 字体层级、留白、间距是否舒服
- 配色是否协调
- 卡片、按钮、边框、圆角是否滥用
- 信息密度是否合理
- 页面有没有明确的视觉重点
- 是否符合现代 Web / SaaS / App 的设计习惯
- 设计是不是“功能都对，但就是不好看”

所以你可以把它理解为：

> **taste-skill = 设计审美指导 / UI 品味约束**

而不是：

> **taste-skill = Figma 设计工具 / 页面开发工具**

### 它适合放在哪个流程里

比如你让 Codex 做一个 Slot 游戏大厅页面：

```text
使用 taste-skill 设计一个移动端 Slot 游戏大厅首页。

要求：
- 深色高级风格
- 不要典型 AI 渐变风
- 强调游戏 Banner 和热门游戏
- 信息层级清晰
- 控制圆角和卡片数量
- 手机端 390px
```

`taste-skill` 更可能帮助 AI决定：

```text
这个标题应该多大
这里该不该放卡片
这个 Banner 应该占多高
导航是否太抢眼
按钮是否过度设计
背景是不是太花
金色应该怎么控制
```

真正执行页面开发的，还是 HTML/CSS、React、Vue、Tailwind 等代码能力。

------

如果你已经有一个页面，也非常适合让它做**设计审查**：

```text
使用 taste-skill review 当前页面，
重点检查：
1. 视觉层级
2. 间距
3. 字体
4. 配色
5. 卡片使用
6. 是否存在明显 AI 生成感
7. 移动端体验

发现问题后直接修改。
```

这种用法通常比单纯说：

```text
帮我美化一下
```

效果更稳定。

### 和你前面问的几个 Skill 区别

可以简单这样理解：

| Skill                   | 更偏向                           |
| ----------------------- | -------------------------------- |
| `taste-skill`           | **审美、设计判断、视觉品味**     |
| `ui-ux-pro-max`         | UI/UX 方案、组件、风格、布局参考 |
| `web-design-guidelines` | Web 页面设计规范、最佳实践、检查 |
| Figma MCP               | **真正操作 Figma 设计稿**        |
| ImageGen                | 生成视觉效果图 / 概念图          |
| Codex                   | 真正实现 React/Vue/HTML/CSS 页面 |

所以如果你的目标是：

**“让 Codex 直接写一个好看的网页”**

我会更推荐组合：

```text
taste-skill
+ web-design-guidelines
+ Codex 实现
```

如果目标是：

**“先做专业设计稿，再开发”**

更适合：

```text
taste-skill
→ Figma
→ Codex 根据 Figma 实现
```

如果目标是快速找视觉方向：

```text
taste-skill
→ ImageGen 出效果图
→ Figma / Codex 落地
```

### 是否需要显式调用

这取决于你安装的 `taste-skill` 本身是怎么写的。

通常 Codex Skill **可以根据 description 自动触发**，但自动触发并不是百分之百可靠。

如果你明确希望这次设计遵循它，我建议直接写：

```text
$taste-skill
帮我重新设计这个页面……
```

或者：

```text
使用 taste-skill review 并优化当前页面。
```

这样最稳定。

你现在这一套做 UI 的 Skill，如果包括 **`taste-skill + ui-ux-pro-max + web-design-guidelines + Figma`**，其实各自职责是有区别的。我可以进一步帮你整理一套**“Codex 做 UI 最佳 Skill 调用顺序”**，告诉你什么场景该用哪个，避免几个 Skill 重复干活。