# Docker的快速上手

## 1. 基础示例

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



## 2. 镜像

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



## 3. 容器

### 3.1 容器基础操作

```bash
# 查看正在运行的容器
docker ps

# 停止容器
docker stop mysql

# 查看所有容器
docker ps -a

# 查看所有容器,并且只获取ID
docker ps -aq

# 指定格式输出
docker ps -a --format="table {{.ID}}\t{{.Names}}"

# 一键删除所有已停止的容器
docker container prune -f

# 删除容器
docker rm 容器ID
# 强行删除正在运行的容器
docker rm -f 容器ID
```

容器运行：

```bash
# 配置数据库名和root密码
docker run -d --name blogmysql -p 3311:3306 -e MYSQL_ROOT_PASSWORD=123456 -e MYSQL_DATABASE=blog mysql:5.7

# 数据挂载
docker run -d --name blogmysql2 -p 3312:3306 -e MYSQL_ROOT_PASSWORD=123456 -e MYSQL_DATABASE=blog -v ./mysqldata:/var/lib/mysql mysql:5.7

```

容器操作：

```bash
# 停止容器
docker stop 容器ID

# 启动容器
docker start 容器ID

# 重启容器
docker restart 容器ID

# 删除没在运行的容器
docker rm 容器ID

# 删除正在运行的容器
docker rm -f 容器ID

# 停止所有容器
docker stop $(docker ps -aq)

# 删除所有容器
docker rm -f $(docker ps -aq)

```

查看日志：

```bash
docker logs 容器ID
docker logs -f -n 10 b374928422fb
```



进入容器：

```bash
docker exec -it b374928422fb bash
docker exec -it b374928422fb ls
```



### 3.2 案例

```bash
[root@localhost ~]# docker run -d -p 3306:3306 mysql:5.7
44548915427cf7401179ae01cb170923953b8c81fd05d237fb119a9b5bdfcfa3
[root@localhost ~]# docker ps -a
CONTAINER ID   IMAGE       COMMAND                   CREATED         STATUS                     PORTS     NAMES
44548915427c   mysql:5.7   "docker-entrypoint.s…"   4 seconds ago   Exited (1) 3 seconds ago             magical_haibt
```

为什么mysql容器启动就马上停止了？？？

可以查看容器日志：

```
2026-04-19 10:39:52+00:00 [ERROR] [Entrypoint]: Database is uninitialized and password option is not specified
    You need to specify one of the following as an environment variable:
    - MYSQL_ROOT_PASSWORD
    - MYSQL_ALLOW_EMPTY_PASSWORD
    - MYSQL_RANDOM_ROOT_PASSWORD
```

得知：上面的环境变量必须设置其中1个



### 3.3 目录映射

#### 3.3.1 绑定挂载

```bash
# 绑定挂载 如果宿主机./mysqldata目录不存在 会自动创建
docker run -d --name mysql -p 3306:3306 -v ./mysqldata:/var/lib/mysql -e MYSQL_ROOT_PASSWORD=123456 mysql:5.7


# 坑： 如果宿主机abc.txt文件不存在
# 宿主机创建的是abc.txt目录， 容器内也创建的是abc.txt目录
docker run -d --name mysql -p 3307:3306 -v ./abc.txt:/abc.txt -e MYSQL_ROOT_PASSWORD=123456 mysql:5.7

# 重要：如果要映射文件，那么宿主机的文件必须存在
[root@localhost ~]# touch xxx.txt
[root@localhost ~]# docker run -d --name mysql2 -p 3309:3306 -v ./xxx.txt:/xxx.txt -e MYSQL_ROOT_PASSWORD=123456 mysql:5.7
```

注意：使用vi、vim修改文件，很可能不会同步



### 3.3.2 数据卷

```bash
# 创建名为 mysql_data 的数据卷
# 会在 /var/lib/docker/volumes 目录下创建一个mysql_data 目录
docker volume create mysql_data

# 查看所有数据卷
docker volume ls

# 查看数据卷的详情
[root@localhost volumes]# docker volume inspect mysql_data
[
    {
        "CreatedAt": "2026-04-20T12:10:27+08:00",
        "Driver": "local",
        "Labels": null,
        "Mountpoint": "/var/lib/docker/volumes/mysql_data/_data",
        "Name": "mysql_data",
        "Options": null,
        "Scope": "local"
    }
]

# 删除数据卷 (需要先解绑所有容器)
docker volume rm mysql_data

# 删除“未被任何容器使用的匿名数据卷” （命名数据卷和正在被某个容器使用的卷不会被删除）
docker volume prune
# 连同未使用的命名卷也一起清理
docker volume prune -a


```

使用数据卷的方式进行目录映射：

```bash
docker run -d --name mysql -p 3307:3306 -v mysql_data:/var/lib/mysql -e MYSQL_ROOT_PASSWORD=123456 mysql:5.7
```



## 4. 镜像构建

### 4.1 快速使用

一个简单go web项目的Dockerfile:

```dockerfile
# 构建阶段
FROM golang:1.25-alpine AS builder

WORKDIR /app

COPY . .

RUN go build -o server .

# 运行阶段
FROM alpine:3.20

WORKDIR /app

COPY --from=builder /app/server .

EXPOSE 8080

CMD ["./server"]
```

使用上面的Dockerfile构建镜像：

```bash
docker pull alpine:3.20
docker pull golang:1.25-alpine
docker build -t web:v1 .
```

构建成功以后会生成一个镜像：

```bash
[root@localhost awesomeProject]# docker images
REPOSITORY   TAG           IMAGE ID       CREATED          SIZE
web          v1            62fbaafea023   17 seconds ago   15.9MB
...
```

使用这个镜像创建并启动容器：

```bash
[root@localhost awesomeProject]# docker run -d -p 8080:8080 web:v1
c180f95c413866d210b7d8dc98c99eb6de39ce077f57b702a2e348bc3852503a
[root@localhost awesomeProject]# docker ps
CONTAINER ID   IMAGE     COMMAND      CREATED         STATUS        PORTS                                       NAMES
c180f95c4138   web:v1    "./server"   2 seconds ago   Up 1 second   0.0.0.0:8080->8080/tcp, :::8080->8080/tcp   quirky_burnell
```

### 4.2 Dockerfile

```dockerfile
# 指定基础镜像 必填，所有指令的起点
FROM golang:1.25-alpine AS builder

# 设置环境变量
ENV CGO_ENABLED 0

# 设置工作目录
WORKDIR /app
# 复制文件 到/app目录
COPY . .

RUN go build -o server .

# 多阶段构建
FROM alpine:3.20

WORKDIR /app

COPY --from=builder /app/server .

# 暴露端口 仅声明，不实际映射，用于文档说明
EXPOSE 8080

# 必填 容器启动时候的执行命令，仅最后一个生效
CMD ["./server"]
```

### 4.3 COPY和ADD

将**本地文件 / 目录**复制到镜像的指定路径，核心区别：`ADD` 支持自动解压压缩包、下载 URL 文件（不推荐，建议用 `RUN wget` 替代）。

```dockerfile
# 复制本地 项目的所有文件到 到镜像的 /app 目录
COPY .  .

# ADD 自动解压本地压缩包到镜像（如 tar.gz、zip）
ADD .  /app/
```

### 4.4 RUN、CMD和ENTRYPOINT

run：在**镜像构建过程中**执行命令（如安装依赖、解压文件、创建目录），执行结果会被固化到镜像的分层中。

两种格式

```dockerfile
# Shell 格式：安装 nginx（合并命令减少镜像分层）
RUN apt update && apt install -y nginx && rm -rf /var/lib/apt/lists/*

# Exec 格式：创建目录（无 Shell 环境，不支持变量替换）
RUN ["mkdir", "-p", "/app/logs"]
```

cmd：默认启动命令，可被 `docker run` 后面的参数覆盖；

ENTRYPOINT：入口命令，`docker run` 后面的参数会作为其参数追加，不可覆盖（除非用 `--entrypoint` 参数强制替换）。

```dockerfile
# ENTRYPOINT：固定启动命令
ENTRYPOINT ["./main"]

# CMD：默认启动参数
# 这里默认指定 --env=dev 和 --port=8080，运行时可替换
CMD ["--env", "dev", "--port", "8080"]
```

