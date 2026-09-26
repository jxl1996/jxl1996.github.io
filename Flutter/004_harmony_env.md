# 鸿蒙端

## 一、下载鸿蒙版flutter

```
git clone https://gitcode.com/openharmony-tpc/flutter_flutter.git
```

下载后配置环境变量PATH，将原来的flutter bin路径换成新的flutter bin路径，例如

![image-20260926161956526](./assets/image-20260926161956526.png)

然后检查环境

```
flutter --version
```

![image-20260926162356422](./assets/image-20260926162356422.png)



---

## 二、安装

下载地址：https://developer.huawei.com/consumer/cn/download/

## 三、配置鸿蒙环境变量

```
export TOOL_HOME=D:\Program\DevEcoStudio    # DevEcoStudio安装目录
export DEVECO_SDK_HOME=%TOOL_HOME%\sdk  # sdk目录
export HDC_HOME=%DEVECO_SDK_HOME%\default\openharmony\toolchains # hdc
export PATH=%TOOL_HOME%\tools\ohpm\bin:$PATH # ohpm
export PATH=%TOOL_HOME%\tools\hvigor\bin:$PATH # hvigor
export PATH=%TOOL_HOME%\tools\node\bin:$PATH # node
```



检查环境变量（windows powershell）：

```powershell
dir env:
```

![image-20260926191627309](./assets/image-20260926191627309.png)

![image-20260926191658432](./assets/image-20260926191658432.png)

![image-20260926191717616](./assets/image-20260926191717616.png)

```
检查PATH环境变量
$env:Path -split ';'
```

![image-20260926191829653](./assets/image-20260926191829653.png)

检查环境：

```
flutter doctor -v
```

![image-20260926192004284](./assets/image-20260926192004284.png)

## 四、运行flutter项目到鸿蒙端







