# Windows安装RabbitMQ

## 1. 安装前提

在 Windows 上安装 RabbitMQ 其实很简单，但有一个至关重要的前提：**RabbitMQ 是基于 Erlang 语言开发的，因此必须先安装 Erlang，再安装 RabbitMQ。** 并且两者的版本需要严格匹配。

> [!IMPORTANT]
>
> 重要！！！
>
> 版本匹配参考：https://www.rabbitmq.com/docs/which-erlang



## 2. 安装步骤

### 2.1 下载并安装 Erlang

访问 [Erlang 官网下载页面](https://www.erlang.org/downloads)，下载对应的 Windows (64-bit) 安装包。

- **安装：** 双击运行，一路点击 `Next` 即可。
- **配置环境变量：** 右键「此电脑」->「属性」->「高级系统设置」->「环境变量」。
  - 在系统变量中新建 `ERLANG_HOME`，值为你的 Erlang 安装路径（例如 `C:\Program Files\erl-xx.x`）。
  - 在系统变量的 `Path` 中添加 `%ERLANG_HOME%\bin`。

+ 检查是否安装成功：

```cmd
erl -version
```



### 2.2 下载并安装 RabbitMQ

访问 [RabbitMQ 官网下载页面](https://www.rabbitmq.com/download.html)，找到 Windows Installer 版本并下载。

- **安装：** 双击运行，一路点击 `Next` 完成安装。
- **配置环境变量（可选，方便后续命令行操作）：**
  - 在系统变量中新建 `RABBITMQ_SERVER`，值为 RabbitMQ 的安装路径（例如 `C:\Program Files\RabbitMQ Server\rabbitmq_server-xx.xx.xx`）。
  - 在 `Path` 中添加 `%RABBITMQ_SERVER%\sbin`。



### 2.3 激活管理后台插件

RabbitMQ 默认自带一个非常方便的网页端管理控制台，但需要手动开启。

1. 以**管理员身份**打开命令提示符（CMD）或 PowerShell。
2. 执行以下命令来启动插件：

```cmd
rabbitmq-plugins enable rabbitmq_management
```



### 2.4 验证与登录

插件激活后，打开浏览器，访问：

> ```
> http://localhost:15672
> ```

此时会看到 RabbitMQ 的登录界面。默认的系统管理员账号和密码均为：

- **用户名：** `guest`
- **密码：** `guest`



## 3. 常用服务命令

RabbitMQ 安装后默认会自动注册为 Windows 服务并在后台运行。如果后续需要手动管理，可以使用以下命令（需在 `sbin` 目录下或配置好环境变量后在管理员 CMD 中运行）：

- **启动服务：** `rabbitmq-service start`
- **停止服务：** `rabbitmq-service stop`
- **查看状态：** `rabbitmqctl status`

> ⚠️ **避坑提示**：
>
> 1. **版本匹配**：如果遇到安装后服务无法启动，大概率是 Erlang 和 RabbitMQ 的版本不兼容。建议直接在 RabbitMQ 官网的 "Erlang Version Requirements" 页面核对好版本再下载。
> 2. **计算机用户名**：如果你的 Windows 账户名是中文（如 `C:\Users\张三`），Erlang 在加载配置文件时可能会因为编码问题报错。建议尽量在英文路径或默认环境下运行。



