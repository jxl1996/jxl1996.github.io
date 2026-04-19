# CLIProxyAPI

CLIProxyAPI是连接Claude Code与各类模型API的关键桥梁，实现请求转发和用量管理。支持市面上基本的所有模型。

## 一、下载与安装

https://github.com/router-for-me/CLIProxyAPI/releases

下载对应系统的压缩包，解压到本地⽬录

复制模版配置文件，并修改：

```
# 1. 复制配置⽂件模板
cp config.example.yaml config.yaml

# 2.编辑 config.yaml，重点修改
proxy-url: "http://127.0.0.1:10808"  # 本地代理
remote-management:
  allow-remote: true
  secret-key: "密码可写明文，启动的时候会自动转成密文"

```

访问管理中心：



## 二、相关环境变量配置

| 变量名                         | 值                     | 说明                     |
| ------------------------------ | ---------------------- | ------------------------ |
| ANTHROPIC_AUTH_TOKEN           | apikey                 | 认证标识（固定值）       |
| ANTHROPIC_BASE_URL             |  | CLIProxyAPI 本地服务地址 |
| ANTHROPIC_MODEL                | gpt-5.4                | 默认主模型               |
| ANTHROPIC_DEFAULT_HAIKU_MODEL  | gpt-5.4-mini           | 轻量级任务模型           |
| ANTHROPIC_DEFAULT_OPUS_MODEL   | gpt-5.4                | 复杂推理模型（可选）     |
| ANTHROPIC_DEFAULT_SONNET_MODEL | gpt-5.4                | 平衡性能模型（可选）     |



## 三、插件安装

+ gopls-lsp  : Go语⾔服务器的桥接，让 Claude 在golang中获得 IDE 级别的代码理解能⼒
+ skill-creator : ⾃定义技能封装, 解决重复劳动，将⾼频需求封装成可复⽤ Skill
+ Superpowers — ⼯程化⼯作流



