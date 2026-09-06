# web-design-guidelines

`web-design-guidelines` 主要是一个 **Web UI / UX 审查 Skill**。它不是专门帮你“生成漂亮页面”的，而是让 Codex 在你已经写好或修改了前端页面后，按照一套 Web Interface Guidelines 去检查设计质量、交互体验和可访问性。

目前 Vercel 官方版本的描述就是：用于 **Review UI code for Web Interface Guidelines compliance**，典型触发场景包括 “review my UI / check accessibility / audit design / review UX / check best practices”。([GitHub](https://github.com/vercel-labs/agent-skills/blob/main/skills/web-design-guidelines/SKILL.md?utm_source=chatgpt.com))

### 它主要检查什么

实际检查范围大致可以理解成这些：

- 布局是否合理：对齐、间距、内容密度、层级关系
- 字体是否好读：字号、行高、标题层级
- 颜色和对比度是否合适
- 按钮、链接等交互状态是否完整
- Hover / Focus / Active / Disabled 是否清楚
- 手机、平板、桌面响应式是否正常
- Accessibility：
  - 键盘导航
  - focus 状态
  - label
  - alt
  - 对比度
  - reduced motion 等
- Loading / Empty / Error / Success 等产品状态是否考虑
- 边框、阴影、Icon、间距是否统一

一些衍生版本还明确把这些整理成 Layout、Typography、Color、Interaction、Responsiveness、Accessibility、Product States、Polish 等检查项。([GitHub](https://github.com/OpenBMB/PilotDeck/blob/main/skills/web-design-guidelines/SKILL.md?utm_source=chatgpt.com))

不过 **Vercel 官方 Skill 本身并没有把规则硬编码进 SKILL.md**。它的工作方式是每次执行审查时，先获取最新的 `web-interface-guidelines`，然后再检查你的代码。([GitHub](https://github.com/vercel-labs/agent-skills/blob/main/skills/web-design-guidelines/SKILL.md?utm_source=chatgpt.com))

------

## 在 Codex 里怎么用

你之前习惯 `$wayfinder`、`$grill-with-docs` 这种方式的话，这个也可以类似理解。

比如你项目里有：

```text
src/
  pages/
    Login.vue
    Home.vue
  components/
    Header.vue
    UserCard.vue
```

你可以直接：

```text
$web-design-guidelines src/pages/Login.vue
```

意思就是：

> 按 Web Design Guidelines 审查 Login.vue。

也可以整个目录：

```text
$web-design-guidelines src/pages/
```

或者指定模式：

```text
$web-design-guidelines "src/**/*.vue"
```

它官方定义的参数就是 `<file-or-pattern>`。([GitHub](https://github.com/vercel-labs/agent-skills/blob/main/skills/web-design-guidelines/SKILL.md?utm_source=chatgpt.com))

------

## 也可以直接自然语言

不一定非得 `$skill`。

例如：

```text
使用 web-design-guidelines 检查这个登录页面，
重点检查：
1. 移动端适配
2. 可访问性
3. 按钮交互状态
4. 间距和视觉层级
```

或者：

```text
用 web-design-guidelines 审查 src/pages/home/index.vue
```

如果 Codex 的 Skill 自动匹配正常，你甚至可以直接说：

```text
检查一下这个页面的 UI/UX 有没有问题
```

因为这个 Skill 的 description 本身就定义了这些触发词。([GitHub](https://github.com/antfu/skills/blob/main/skills/web-design-guidelines/SKILL.md?utm_source=chatgpt.com))

------

## 它默认输出是什么样

官方 Skill 特别强调 **简洁的 `file:line` 格式**。([GitHub](https://github.com/vercel-labs/agent-skills/blob/main/skills/web-design-guidelines/SKILL.md?utm_source=chatgpt.com))

大概会类似：

```text
src/pages/Login.vue:23
输入框缺少关联 label，影响屏幕阅读器使用。

src/pages/Login.vue:47
按钮只有 hover 状态，没有明显的 keyboard focus 状态。

src/pages/Login.vue:82
正文文字与背景色对比度不足。

src/pages/Login.vue:105
移动端 375px 下左右 padding 过大。
```

所以它很适合做一种：

**UI Code Review。**

------

## 和你现在常用的 Skill 怎么配合

你目前的工作流里，这个 Skill 最适合放在**实现完成之后**：

```text
需求
 ↓
wayfinder
 ↓
specification / tickets
 ↓
Figma / ImageGen
 ↓
implement / Codex 写代码
 ↓
web-design-guidelines
 ↓
修 UI / UX 问题
 ↓
测试
 ↓
提交
```

比如你要做 Slot 游戏大厅：

```text
先让 Codex 根据 Figma 实现页面
```

实现完：

```text
$web-design-guidelines src/pages/lobby/
```

然后：

```text
根据 web-design-guidelines 的审查结果，
直接修复所有 High / Medium 问题。
保持当前设计风格，不要重新设计页面。
```

这个组合会比较实用。

------

### 它和 Figma / ImageGen 的区别

这几个东西不要混在一起：

| 工具                      | 作用                   |
| ------------------------- | ---------------------- |
| ImageGen                  | 生成视觉效果图         |
| Figma                     | 做设计稿 / 设计系统    |
| Codex                     | 实现页面               |
| **web-design-guidelines** | **审查实现出来的页面** |
| Playwright / 浏览器测试   | 检查实际运行效果       |

所以：

> `web-design-guidelines` 更像一个懂 UI/UX 的 Code Reviewer，而不是 UI Designer。

例如你说：

```text
帮我设计一个漂亮的 Slot 游戏大厅
```

这时候优先 Figma / ImageGen。

而如果你说：

```text
这个 Slot 大厅已经写完了，看看设计和交互有没有问题
```

这时候就很适合：

```text
$web-design-guidelines src/pages/lobby/
```

对你现在这种 **Codex + Figma + Skill** 的开发方式，我建议把它当成前端页面完成后的固定检查步骤。这样比单纯让 Codex “看看页面好不好”更稳定，因为它会按照一套明确且持续更新的 Web Interface Guidelines 来审查。([GitHub](https://github.com/vercel-labs/agent-skills/blob/main/skills/web-design-guidelines/SKILL.md?utm_source=chatgpt.com))