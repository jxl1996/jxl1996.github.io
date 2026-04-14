# ElasticSearch安装

## 1. Windows安装

### 1.1 环境准备

在开始之前，请确保你的电脑满足以下条件：

- **Java 环境**：现代版本的 Elasticsearch（7.x 以后）通常自带了 JDK，所以你**不再需要**手动配置 `JAVA_HOME`，除非你有特殊需求。
- **内存空间**：建议至少有 4GB 剩余内存，因为 Elasticsearch 默认占用比较高

### 1.2 下载与解压

1. 访问 [Elastic 官网下载页面](https://www.elastic.co/downloads/elasticsearch)。
2. 选择 **Windows** 版本的 ZIP 包下载。
3. 下载完成后，将压缩包解压到你想要存放的目录（建议路径中**不要包含空格或中文**，例如 `D:\Elasticsearch`）。

### 1.3 核心配置（关键步骤）

由于新版本默认开启了**安全验证 (Security)**，直接运行可能会因为 SSL 或密码问题导致无法访问。如果你是本地开发调试，可以进行以下操作：

1. 进入解压目录下的 `config` 文件夹，打开 **`elasticsearch.yml`** 文件。
2. 找到并修改以下参数（如果不存在则手动添加）：

```yaml
# 禁用安全验证，方便初次上手
xpack.security.enabled: false
# 禁用 HTTP SSL
xpack.security.http.ssl.enabled: false
```

> [!NOTE]
>
> 注意：YAML 格式要求极其严格。**冒号 `:` 后面必须有一个空格**，然后再写值

### 1.4 启动服务

1. 进入解压目录下的 `bin` 文件夹。
2. 双击运行 **`elasticsearch.bat`**。

3. 验证安装：打开浏览器，在地址栏输入： `http://localhost:9200`，如果你看到类似下方的 JSON 数据，恭喜你，安装成功了！

```json
{
  "name" : "YOUR_COMPUTER_NAME",
  "cluster_name" : "elasticsearch",
  "version" : {
    "number" : "8.x.x",
    ...
  },
  "tagline" : "You Know, for Search"
}
```

### 1.5 将es注册为windows服务

如果你希望开机自启，可以使用 `bin` 目录下的 `elasticsearch-service.bat`。

在命令行输入下面指令即可将其安装为 Windows 服务。

```cmd
elasticsearch-service.bat install
```

### 1.6 设置为开机自动启动

#### 方法一：使用命令行

在`bin`目录下，执行下面指令：

```cmd
elasticsearch-service.bat manager
```

执行后会弹出一个图形化界面：

1. 切换到 **General** 选项卡。
2. 将 **Startup type**（启动类型）从 `Manual` 修改为 **`Automatic(Delayed Start)`**。
3. 点击底部的 **Start** 按钮立即启动，然后点击 **OK**。



#### 方法二：通过服务管理器

1. 按下 `Win + R`，输入 `services.msc` 并回车。
2. 在列表中找到 **Elasticsearch** 开头的服务（通常显示为 `elasticsearch-service-x64`）。
3. 右键点击该服务，选择 **属性**。
4. 在“启动类型”下拉菜单中选择 **自动 (延迟启动)**。
5. 点击“应用”并“确定”。

> [!NOTE]
>
> **修改配置后需重启服务**：如果你之后修改了 `elasticsearch.yml` 配置文件，仅仅保存文件是不够的。你需要进入“服务”管理器，右键点击 Elasticsearch 选择 **重新启动**，配置才会生效

---

### 

