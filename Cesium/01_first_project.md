# 第一个Cesium应用

## 一、基本使用

第一步：安装项目vue3

第二步：安装cesium

```cmd
npm install cesium
```

第三步：复制文件

3.1 `node_modules/cesium/Build/Cesium`目录下的四个目录复制到public目录下：

+ Assets
+ ThirdParty
+ Widgets
+ Workers

将以上4个目录复制到： `public/plugins/cesium` 目录下

3.2 将`Widgets`目录 再复制到`src`目录下，可重命名成`CesiumWidgets`目录



第四步：编写代码

```vue
<template>
<div id="cesiumContainer" ></div>
</template>

<script setup>
import * as Cesium from "cesium";
import '@/CesiumWidgets/widgets.css'
import {onMounted} from "vue";

// 设置cesium静态资源的路径, 对应public下的路径
window.CESIUM_BASE_URL = '/plugins/cesium/'
onMounted(() => {
  var viewer = new Cesium.Viewer("cesiumContainer");
})

</script>

<style scoped>
#cesiumContainer{
  width: 100vw;
  height: 100vh;
}
</style>
```

---





## 二、vite-plugin-cesium插件

使用 `vite-plugin-cesium` 插件是目前在 Vite 项目中集成 Cesium 最优雅的方式。它会自动帮你处理 `CESIUM_BASE_URL`、拷贝静态资源（Assets/Workers 等），并处理好库的导入，让你像写普通第三方库一样直接使用 Cesium。

以下是完整的操作步骤：

1. 安装插件

```cmd
npm install vite-plugin-cesium -D
```

2. 在 `vite.config.js` 中配置插件

打开你的 Vite 配置文件，引入并注册该插件。

```js
import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
// 1. 引入插件
import cesium from 'vite-plugin-cesium'; 

export default defineConfig({
  plugins: [
    vue(),
    cesium() // 2. 注册插件
  ],
});
```



3. 组件代码

```vue
<template>
<div id="cesiumContainer" ></div>
</template>

<script setup>
import * as Cesium from "cesium";
import {onMounted} from "vue";
// ❌ 删掉这行：window.CESIUM_BASE_URL = '/plugins/cesium/'
// ❌ 删掉这行：import '@/CesiumWidgets/widgets.css' （插件会自动帮你引入 CSS）

// 设置cesium token
Cesium.Ion.defaultAccessToken="xxxxxxxx"

onMounted(() => {
  var viewer = new Cesium.Viewer("cesiumContainer");
})

</script>

<style scoped>
#cesiumContainer{
  width: 100vw;
  height: 100vh;
}
</style>
```

