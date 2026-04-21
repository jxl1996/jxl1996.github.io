# Centos7设置固定IP

在 CentOS 7 里固定 IP，通常改网卡配置文件就行。

先查看网卡名：

```bash
ip addr
```

常见名字可能是 `ens33`、`eth0`、`ens160`。

然后编辑对应配置文件：

```bash
vim /etc/sysconfig/network-scripts/ifcfg-ens33
```

主要改这几个：

```
BOOTPROTO=static
ONBOOT=yes
IPADDR=你的固定IP
NETMASK=子网掩码 一般家用内网常见是 255.255.255.0
GATEWAY=网关 一般是路由器地址，比如 192.168.1.1
DNS1=8.8.8.8
DNS2=114.114.114.114
```

改完执行：

```bash
systemctl restart network
```

再查看：

```bash
ip addr
ping 8.8.8.8
```