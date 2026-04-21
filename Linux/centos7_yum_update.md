```bash
# 1. 备份当前的YUM源文件
mv /etc/yum.repos.d/CentOS-Base.repo /etc/yum.repos.d/CentOS-Base.repo.backup
 
# 2. 下载新的YUM源文件
curl -o /etc/yum.repos.d/CentOS-Base.repo http://mirrors.aliyun.com/repo/Centos-7.repo
 
# 3. 清理YUM缓存并生成新的缓存
yum clean all
yum makecache
```

