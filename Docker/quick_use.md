# Docker的快速上手

## 一、基础示例

```bash
# 拉取镜像
docker pull mysql:5.7

# 创建并运行一个容器
docker run -itd -p 3306:3306 --name=mysql -e MYSQL_ROOT_PASSWORD=123456 mysql:5.7
```

参数说明：

+ `-it` : 一起常用于进入交互式环境。

+ `-d` 表示**后台运行**（detached）。所以这里虽然带了 `-it`，但实际上因为有 `-d`，容器会在后台启动。

+ `-p 3306:3306` 表示**端口映射**：

  - 前面的 `3306`：宿主机端口

  - 后面的 `3306`：容器内 MySQL 的端口

+ `--name=mysql`： 给这个容器取名叫 `mysql`。
+ `-e MYSQL_ROOT_PASSWORD=123456`： 设置环境变量， 这里是给 MySQL 的 `root` 用户设置密码为 `123456`。



测试一下：

可使用工具连接这个MySQL，如果连接不了，大概率是防火墙没有开放端口：

```bash
firewall-cmd --list-ports
firewall-cmd --zone=public --add-port=3306/tcp --permanent
firewall-cmd --reload
```



## 二、镜像

```bash
# 拉取镜像  不指定tag，默认是latest
docker pull image_name:tag

# 搜索镜像
docker search image_name:tag

# 已下载镜像列表
docker images

# 删除镜像
docker rmi image_id

```



## 三、容器







