## VPS搭建

### 一、购买VPS

https://www.racknerd.com/

https://cloud.colocrossing.com/

https://yecaoyun.com

注意： 如果选择CentOS系统， 建议选项CentOS7以上的版本



### 二、安装3XUI面板

#### 第一步：基础环境准备

在开始安装之前，请确保你的系统已经更新，并且安装了 `curl` 和 `wget`（脚本需要用到它们）。

::: code-group

```bash [CentOS (7 / 8 / 9)]
yum update -y && yum install curl wget -y
```

```bash [Ubuntu / Debian]
apt update -y && apt upgrade -y && apt install sudo curl -y
```

:::

#### 第二步：一键安装脚本

3x-ui 官方提供了一个通用的安装脚本，它能自动识别你的系统架构（x86_64, arm64 等）并完成部署。

执行以下命令：

```bash
bash <(curl -Ls https://raw.githubusercontent.com/mhsanaei/3x-ui/master/install.sh)
```

> [!NOTE]
>
> 执行上面的指令可能报错：
>
> <p style="color:orange">Trying to fetch version with IPv4...</p>
> <p style="color:#e00">Failed to fetch x-ui version, it may be due to GitHub API restrictions, please try it later</p>	
>
> 原因：服务器在尝试访问 GitHub API 获取最新版本号时被拦截或超时了。由于 GitHub 对 API 请求有严格的频率限制，加上国内/部分海外机器直连 GitHub 极不稳定，经常会出现这个问题。
>
> 解决：既然脚本自动获取版本号失败，我们**跳过脚本的自动检测，手动指定版本安装**。

```bash
# 强制指定版本号运行安装脚本
bash <(curl -Ls https://raw.githubusercontent.com/mhsanaei/3x-ui/master/install.sh) v2.8.11
```



#### 第三步：放行防火墙端口

::: code-group


```bash [Centos]
firewall-cmd --permanent --add-port=9527/tcp
firewall-cmd --permanent --add-port=80/tcp
firewall-cmd --reload
```

```bash [ubuntu]
ufw allow 9527/tcp
ufw allow 80/tcp  # 如果之后要申请证书，建议也放行 80
ufw reload
```

:::

**注意**：还需要在云商控制台的“**安全组**”中手动放行对应的端口。



#### 第四步：管理面板

安装完成后，你可以在终端输入 `x-ui` 来调用管理菜单。

| **命令**       | **作用**                               |
| -------------- | -------------------------------------- |
| `x-ui`         | 显示管理菜单（可修改端口、重置密码等） |
| `x-ui start`   | 启动面板                               |
| `x-ui stop`    | 停止面板                               |
| `x-ui restart` | 重启面板                               |
| `x-ui status`  | 查看面板运行状态                       |
| `x-ui log`     | 查看面板日志                           |

#### 第五步：开启BBR

1. 使用`x-ui`展示管理菜单
2. 选择开启BBR的编号： 例如24
3. 开启BBR

4. 检查BBR是否开启成功，在终端输入：

```bash
lsmod | grep bbr
```

- **成功标志**：你会看到类似 `tcp_bbr  20480  1` 的一行文字。
  - *解释：这说明 BBR 模块不仅存在，而且已经加载到内核空间并正在运行。*
- **失败标志**：没有任何输出（空白）。

> [!NOTE]
>
> **BBR**是 Google 开发的一种 **TCP 拥塞控制算法**。一句话总结：BBR 是给你的网络连接插上翅膀，尤其是在访问跨海服务器时。



### 三、搭建节点

#### 3.1 不带域名搭建节点

+ 搭配方式1：**Vless + XHTTP + Reality**
  + 协议：vless
  + 传输：XHTTP
  + 路径：/随机数字字母
  + 安全：Reality
    + Target和Sni： 没被墙的网站，如：`microsoft.com`、`apple.com`等
    + `Get New Cert` 创建公钥和私钥

+ 搭配方式2：**Vless + TCP+ Reality**
  + 协议：vless
  + 传输：TCP
  + 安全：Reality
    + Target和Sni： 没被墙的网站，如：`microsoft.com`、`apple.com`等
    + `Get New Cert` 创建公钥和私钥



#### 3.2 使用域名搭建节点

使用域名搭建节点的好处：

+ 避免IP地址泄漏
+ 可搭建更多种类的节点
+ 可以套CDN给节点提速

> [!NOTE]
>
> 准备条件：
>
> + 购买低价域名：https://www.namesilo.com/
> + 将域名托管到cloudflare平台：https://cloudflare.com
> + 在cloudflare平台 将域名解析到VPS服务器， 配置DNS记录的时候`代理状态选择开启`
>   + 测试：ping 自定义域名，能够正常获取数据，并且IP显示的CDN服务器的IP , 而不是VPS服务器的IP，说明设置成功。
> + 使用3X-UI面板安装SSL证书



搭配方式：**Vmess + WS  + TLS**

+ 协议：vmess
+ 端口：TLS节点建议端口：443、2053、2083、2087、2096、8443
+ 传输：Websocket
+ 主机：填写自己的域名
+ 路径：/随机数字字母
+ 安全：TLS
+ 公钥+私钥： 选择`从面板设置证书`

