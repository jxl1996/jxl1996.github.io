# ElasticSearch密码配置

## 1. 更新配置

`elasticsearch.yml` 配置示例：

```yaml
# --- 安全配置 (开启密码) ---
xpack.security.enabled: true

# http.ssl (对外) ,端口通常是 9200， 连接方是客户端（Go, Python, Kibana），开发环境可设置为false, 生产环境必须是true
xpack.security.http.ssl.enabled: false

# transport.ssl (对内),端口通常是 9300，连接方是集群内的其他 ES 节点
# 在单机模式下，可将 transport.ssl 设为 false。
xpack.security.transport.ssl.enabled: false
# 设置为单节点模式，跳过许多集群健康检查
discovery.type: single-node

# --- 跨域配置 (给插件用) ---
http.cors.enabled: true
http.cors.allow-origin: "*"
http.cors.allow-headers: Authorization,Content-Type
```

## 2. 设置密码

更新完上面配置信息后，重启服务， 然后就可以设置密码了

ES 提供了两种设置密码的方式，根据你的需求选择：

### 2.1 自动生成密码

如果你想让系统帮你生成一堆复杂的随机密码，在 `bin` 目录下运行：

```
elasticsearch-setup-passwords auto
```

这条命令会为你内置的账号（如 `elastic`, `kibana_system` 等）自动生成密码并直接打印在屏幕上。**记得拿小本本记下来。**



### 2.2 手动指定密码

如果你想自己定义密码（例如统一设为 `123456` 方便开发），请运行：

```
elasticsearch-setup-passwords interactive
```

系统会依次询问你 `elastic`、`apm_system`、`kibana_system` 等账号的密码，你逐个输入并确认即可。



### 2.3 验证密码

设置完成后，你再次访问 `http://localhost:9200`，浏览器会弹出一个登录框。

- **用户名**：`elastic`
- **密码**：你刚刚设置的密码

如果能看到 JSON 响应，说明密码生效了。

也可以使用`curl`验证：

```bash
curl -u 账号:密码 http://127.0.0.1:9200/
```



### 2.4 Kibana配置连接密码

一旦 ES 设置了密码，Kibana 就连不上 ES 了，因为它也需要身份验证。

1. 打开 Kibana 目录下的 `config/kibana.yml`。
2. 添加或修改以下配置：

```yaml
elasticsearch.username: "kibana_system"
elasticsearch.password: "你刚才为kibana_system设置的密码"
```

