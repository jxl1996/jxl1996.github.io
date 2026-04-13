# nvm和nrm工具的使用

## 1. nvm常用命令

使用 `nvm` (Node Version Manager) 切换和管理 Node.js 版本非常方便。这里是频繁用到的几个核心命令：

| **命令**               | **说明**                                  |
| ---------------------- | ----------------------------------------- |
| `nvm list available`   | 查看可安装的 Node.js 版本（仅限 Windows） |
| `nvm ls-remote`        | 查看可安装的 Node.js 版本（macOS/Linux）  |
| `nvm install <版本号>` | 安装指定版本（如：`nvm install 18.16.0`） |
| **`nvm use <版本号>`** | **切换并使用指定版本**                    |
| `nvm ls`               | 查看本地已安装的所有版本                  |

## 2. nrm工具

### 2.1 安装 nrm

由于 `nrm` 是一个命令行工具，建议通过 `-g` 参数全局安装：

```bash
npm install -g nrm
```

### 2.2 修改 npm 源的常用操作

#### 第一步：查看所有可选源

安装完成后，你可以看到当前支持的所有镜像源，打 `*` 号的是你当前正在使用的。

```bash
nrm ls
```

#### 第二步：切换镜像源

如果你发现下载包很慢，想切换到淘宝镜像：

Bash

```bash
nrm use taobao
```

执行后，你的 `npm install` 就会通过淘宝镜像下载。

#### 第三步：测试速度

如果你不确定哪个源最快，可以运行测速命令：

Bash

```bash
nrm test
```

它会列出每个源的响应时间，帮你选择延迟最低的一个。



### 2.3  进阶用法

#### 添加私有源

如果你所在的公司有自己的 npm 私服（如使用 Sinopia 或 Verdaccio 搭建），可以将其添加进来：

```bash
# 格式：nrm add <自定义名称> <地址>
nrm add mycompany http://npm.yourcompany.com/
```

#### 删除某个源

如果你不再需要某个自定义源：

Bash

```
nrm del mycompany
```
