# 安全模式配置

为了生成 RabbitMQ 所需的 SSL/TLS 证书，我们需要创建一个最基础的**私有证书颁发机构（自签 CA）**，然后用这个 CA 去签发**服务端证书**和**客户端证书**。

目前最标准、最通用的工具是 **OpenSSL**。无论是在 Windows 还是 Linux 下，生成证书的命令行逻辑（也就是 OpenSSL 的命令）是完全一模一样的，主要的区别在于**环境的准备**。

## 一、环境准备

### 1.1 在 Linux  上

Linux 系统通常自带 OpenSSL，几乎不需要额外安装。

- **检查命令**：打开终端，输入 `openssl version`。如果显示版本号（如 `OpenSSL 3.0.x`），说明已就绪。
- **如果没有安装**，直接通过包管理器安装：

```sh
sudo apt-get install openssl   # Ubuntu/Debian
sudo yum install openssl       # CentOS/RHEL
```

### 1.2 在 Windows 上

1. **下载安装包**：去开源社区下载 Windows 版本的 OpenSSL 傻瓜式安装包（例如：[Win32/Win64 OpenSSL](https://slproweb.com/products/Win32OpenSSL.html)），选择 `Win64 OpenSSL Light` 版本下载安装即可。
2. **配置环境变量**：
   - 假如你安装到了 `C:\Program Files\OpenSSL-Win64`。
   - 右键点击“此电脑” -> 属性 -> 高级系统设置 -> 环境变量。
   - 在“系统变量”里找到 `Path`，双击它，点击“新建”，把 `C:\Program Files\OpenSSL-Win64\bin` 填进去。
3. **验证**：打开全新的 `CMD` 或 `PowerShell`，输入 `openssl version`，看到版本号即表示成功。

---



## 二、通用证书生成

环境准备好后，**在任意系统新建一个干净的文件夹**，进入该目录。接下来的 OpenSSL 命令在 **Linux 终端**、**Windows CMD** 或 **PowerShell** 中完全通用。

我们需要生成 3 套证书：**CA（根证书）**、**Server（服务端）**、**Client（客户端）**。

### 2.1 生成所有证书

#### **第一步：创建环境所需的两个配置文件**

在你的 `ca` 目录下，直接右键新建两个文本文件，**务必确保后缀名是 `.ext` 而不是 `.txt`**：

- **文件一：新建 `server.ext`**，用记事本打开，贴入以下内容并保存

```toml
authorityKeyIdentifier=keyid,issuer
basicConstraints=CA:FALSE
keyUsage = digitalSignature, nonRepudiation, keyEncipherment, dataEncipherment
subjectAltName = @alt_names

[alt_names]
DNS.1 = localhost
IP.1 = 127.0.0.1
```

**文件二：新建 `client.ext`**，用记事本打开，贴入以下内容并保存：

```toml
authorityKeyIdentifier=keyid,issuer
basicConstraints=CA:FALSE
keyUsage = digitalSignature, nonRepudiation, keyEncipherment, dataEncipherment
subjectAltName = @alt_names

[alt_names]
DNS.1 = go-client
```

#### 第二步：生成证书

在上面创建的ca目录下一次执行：

+ 步骤 1：创建 CA，生成自签 CA 根证书

```cmd
openssl genrsa -out ca-key.pem 2048
openssl req -new -x509 -days 3650 -key ca-key.pem -out ca-cert.pem -subj "/CN=MyPrivateCA"
```

+ 步骤 2：创建 Server 请求，生成服务端私钥与证书请求

```cmd
openssl genrsa -out server-key.pem 2048
openssl req -new -key server-key.pem -out server.csr -subj "/CN=localhost"
```

+ 步骤 3：签发具有 SAN 的 Server 证书，挂载 server.ext 注入 SAN 属性

```cmd
openssl x509 -req -days 3650 -in server.csr -CA ca-cert.pem -CAkey ca-key.pem -CAcreateserial -out server-cert.pem -extfile server.ext
```

+ 步骤 4：创建 Client 请求，生成客户端私钥与证书请求

```cmd
openssl genrsa -out client-key.pem 2048
openssl req -new -key client-key.pem -out client.csr -subj "/CN=go-client"
```

+ 步骤 5：签发具有 SAN 的 Client 证书，挂载 client.ext 注入 SAN 属性

```cmd
openssl x509 -req -days 3650 -in client.csr -CA ca-cert.pem -CAkey ca-key.pem -CAcreateserial -out client-cert.pem -extfile client.ext
```

### 2.2 Window配置服务端

1. 按 `Win + R` 键，输入 **`%APPDATA%\RabbitMQ`** 点击确定，进入 RabbitMQ 的数据根目录。

2. 在该目录下新建一个名为 **`ssl`** 的文件夹。

3. 把刚才在 `ca` 目录下生成的 **3个服务端文件** 复制进这个 `ssl` 文件夹中：

- `ca-cert.pem`
- `server-cert.pem`
- `server-key.pem`

回到 `%APPDATA%\RabbitMQ` 根目录，新建一个文本文件，重命名为 **`rabbitmq.conf`**（确保后缀是 `.conf`），用记事本贴入以下内容并保存：

```toml
# ====================================================================
# 第一部分：AMQP 核心消息队列安全通道配置 (5671 端口)
# 用于后台应用程序（如你的 Go 语言后端）建立安全的加密双向连接
# ====================================================================

# 开启 RabbitMQ 的 SSL/TLS 默认安全监听端口（标准的未加密端口是 5672）
listeners.ssl.default = 5671

# 证书相关路径配置（Windows 环境下必须使用正斜杠 "/" 且路径须真实有效）
# 1. 客户端 CA 根证书路径：用于验证来连接的客户端证书是否由我们自己的 CA 签发
ssl_options.cacertfile = C:/Users/jxl/AppData/Roaming/RabbitMQ/ca/ca-cert.pem
# 2. 服务端自身的证书路径：向连接过来的客户端证明自己是真实的 RabbitMQ 服务器
ssl_options.certfile = C:/Users/jxl/AppData/Roaming/RabbitMQ/ca/server-cert.pem
# 3. 服务端自身的私钥路径：用于高强度非对称加密握手，须严格保密
ssl_options.keyfile = C:/Users/jxl/AppData/Roaming/RabbitMQ/ca/server-key.pem

# 开启双向认证（mTLS）安全级别
# verify_peer 表示服务器会严格校验客户端带来的证书真伪
ssl_options.verify = verify_peer
# fail_if_no_peer_cert = true 表示如果客户端连接时不提供证书，服务器将直接拒绝连接
ssl_options.fail_if_no_peer_cert = true


# ====================================================================
# 第二部分：Web 可视化管理界面安全通道配置 (15671 端口)
# 用于我们在 Win11 浏览器中通过 HTTPS 安全访问管理控制台
# ====================================================================

# 开启 Web 管理界面的 HTTPS 监听端口（标准的未加密网页端口是 15672）
management.ssl.port = 15671

# Web 界面复用上面生成好的这套服务端证书与私钥
management.ssl.cacertfile = C:/Users/jxl/AppData/Roaming/RabbitMQ/ca/ca-cert.pem
management.ssl.certfile = C:/Users/jxl/AppData/Roaming/RabbitMQ/ca/server-cert.pem
management.ssl.keyfile = C:/Users/jxl/AppData/Roaming/RabbitMQ/ca/server-key.pem

# 浏览器访问权限降级（关键避坑配置）
# verify_none 表示服务器在处理网页请求时，不要求浏览器客户端也必须安装 client.pem 证书
management.ssl.verify = verify_none
# fail_if_no_peer_cert = false 表示浏览器不提供证书也能正常弹出登录输入框，方便我们日常开发调试
management.ssl.fail_if_no_peer_cert = false
```

4. 重启RabbitMQ服务
5. 简单检查是否生效

```cmd
netstat -ano | findstr 5671
```

---

### 2.3 Linux配置服务端

在大多数 Linux 发行版（如 Ubuntu, Debian, CentOS, RHEL, Rocky Linux 等）中，RabbitMQ 的标准配置目录是：

> **`/etc/rabbitmq/`**

在这个目录下，主配置文件命名为：

> **`/etc/rabbitmq/rabbitmq.conf`**

如果不存在，你需要使用管理员权限手动创建它：

```sh
sudo touch /etc/rabbitmq/rabbitmq.conf
```



**文件权限控制（非常重要）**： Linux 对安全权限要求极严。因为 `rabbitmq.conf` 里面可能包含证书路径或安全配置，且需要让系统后台的 `rabbitmq` 用户读取，所以创建完文件后，建议将它的所有者更改为 `rabbitmq` 用户：

```sh
sudo chown rabbitmq:rabbitmq /etc/rabbitmq/rabbitmq.conf
```

**创建 Linux 的证书目录**：

```sh
sudo mkdir -p /etc/rabbitmq/ssl
```

**把证书上传或复制到该目录下**（`ca-cert.pem`, `server-cert.pem`, `server-key.pem`）。

**修正证书的权限**（防止 RabbitMQ 报权限不足无法读取证书的错误）：

```sh
sudo chown -R rabbitmq:rabbitmq /etc/rabbitmq/ssl
sudo chmod 600 /etc/rabbitmq/ssl/server-key.pem
```

**编辑配置文件：**

```toml
listeners.ssl.default = 5671

# Linux 路径直接使用标准的绝对路径
ssl_options.cacertfile = /etc/rabbitmq/ssl/ca-cert.pem
ssl_options.certfile   = /etc/rabbitmq/ssl/server-cert.pem
ssl_options.keyfile    = /etc/rabbitmq/ssl/server-key.pem

ssl_options.verify     = verify_peer
ssl_options.fail_if_no_peer_cert = true

# 开启 Web 管理界面的 HTTPS 监听端口（标准的未加密网页端口是 15672）
management.ssl.port = 15671

# Web 界面复用上面生成好的这套服务端证书与私钥
management.ssl.cacertfile = /etc/rabbitmq/ssl/ca-cert.pem
management.ssl.certfile = /etc/rabbitmq/ssl/server-cert.pem
management.ssl.keyfile = /etc/rabbitmq/ssl/server-key.pem

# 浏览器访问权限降级（关键避坑配置）
# verify_none 表示服务器在处理网页请求时，不要求浏览器客户端也必须安装 client.pem 证书
management.ssl.verify = verify_none
# fail_if_no_peer_cert = false 表示浏览器不提供证书也能正常弹出登录输入框，方便我们日常开发调试
management.ssl.fail_if_no_peer_cert = false
```

**重启 Linux 的 RabbitMQ 服务**让配置生效：

```sh
sudo systemctl restart rabbitmq-server
```

检查是否生效：

```sh
sudo netstat -tunlp | grep 5671
```



## 三、代码编写

```go
package main

import (
	"crypto/tls"
	"crypto/x509"
	"io/ioutil"
	"log"

	"github.com/streadway/amqp"
)

func main() {
	// 1. 创建全新的 TLS 配置实体
	tlsConfig := &tls.Config{}

	// 2. 导入并信任我们自己的自签 CA 根证书
	certPool := x509.NewCertPool()
	caCert, err := ioutil.ReadFile("ca-cert.pem")
	if err != nil {
		log.Fatalf("读取 CA 证书失败: %s", err)
	}
	certPool.AppendCertsFromPEM(caCert)
	tlsConfig.RootCAs = certPool

	// 3. 导入客户端自身的双向认证证书与私钥
	clientCert, err := tls.LoadX509KeyPair("client-cert.pem", "client-key.pem")
	if err != nil {
		log.Fatalf("加载客户端密钥对失败: %s", err)
	}
	tlsConfig.Certificates = []tls.Certificate{clientCert}

	// 4. 显式指定服务器校验名称（必须与 server.ext 中的 DNS 保持一致，即 localhost）
	// 这行配置配合新证书的 SAN 属性，将完美彻底抹平 x509 legacy Common Name 报错！
	tlsConfig.ServerName = "localhost"

	// 5. 使用安全协议头 amqps:// 连接 5671 端口
	dialUrl := "amqps://guest:guest@localhost:5671/"
	log.Println("正在尝试安全的 SSL/TLS 双向握手连接...")
	
	conn, err := amqp.DialTLS(dialUrl, tlsConfig)
	if err != nil {
		log.Fatalf("❌ 安全连接失败: %s", err)
	}
	defer conn.Close()

	log.Println("========= 🚀 SSL/TLS 双向认证连接成功！ =========")
}
```

