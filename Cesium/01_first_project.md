# 第一个Cesium应用

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

