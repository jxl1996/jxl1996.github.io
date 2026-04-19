# Docker的安装

## 一、Centos7安装docker

### 1.1 更新yum源

```bash
# 1. 备份当前的YUM源文件
mv /etc/yum.repos.d/CentOS-Base.repo /etc/yum.repos.d/CentOS-Base.repo.backup
 
# 2. 下载新的YUM源文件
curl -o /etc/yum.repos.d/CentOS-Base.repo http://mirrors.aliyun.com/repo/Centos-7.repo
 
# 3. 清理YUM缓存并生成新的缓存
yum clean all
yum makecache
```

### 1.2 安装docker

```bash
# 卸载旧版本
sudo yum remove -y docker \
  docker-client \
  docker-client-latest \
  docker-common \
  docker-latest \
  docker-latest-logrotate \
  docker-logrotate \
  docker-engine
  
# 安装依赖
sudo yum install -y yum-utils device-mapper-persistent-data lvm2

# 添加 Docker CE 仓库
sudo yum-config-manager --add-repo https://mirrors.aliyun.com/docker-ce/linux/centos/docker-ce.repo

# 安装docker
sudo yum install -y docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin

# 启动并设置开机自启
sudo systemctl start docker
sudo systemctl enable docker

# 验证
docker --version
```



## 二、代理配置

创建`/etc/systemd/system/docker.service.d/http-proxy.conf`文件

```bash
mkdir /etc/systemd/system/docker.service.d
vim /etc/systemd/system/docker.service.d/http-proxy.conf
```

配置如下：

```bash
[Service]
Environment="HTTP_PROXY=http://192.168.1.2:10808"
Environment="HTTPS_PROXY=http://192.168.1.2:10808"
```

重启服务：

```bash
systemctl daemon-reload
systemctl restart docker

# 然后检查加载的配置：
systemctl show docker --property Environment
```

测试：

```
docker pull mysql:5.7
```

