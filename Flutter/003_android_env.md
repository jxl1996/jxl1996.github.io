# 安卓环境配置

## 一、JDK下载

> [!NOTE]
>
> + JDK 的安装是可选的，因为安装Android studio 自带了JDK
> + 如果不想用Android studio 自带的JDK， 可以进行安装



## 二、Android studio的安装配置

### 2.1 Android SDK

打开：

**Android Studio → Settings → Languages & Frameworks → Android SDK**

确认有：

- Android SDK Platform
- Android SDK Platform-Tools
- Android SDK Build-Tools
- Android SDK Command-line Tools

其中 **Android SDK Command-line Tools** 很重要。

配置SDK的环境变量，如：

```
ANDROID_HOME=D:\AndroidSDK

PATH加上：
	%ANDROID_HOME%\platform-tools
	%ANDROID_HOME%\cmdline-tools\latest\bin
```

### 2.2 接受安卓许可协议

```
# 一直选y即可
flutter doctor --android-licenses
```

### 2.3 Android studio安装dart和flutter插件

### 2.4  环境检测

```
flutter doctor -v
```

### 2.5 自定义jdk

如果需要换jdk，可用：

```
flutter config --jdk-dir="path/to/jdk"
```

