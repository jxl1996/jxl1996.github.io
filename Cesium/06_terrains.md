# 地形设置

## 一、基础用法

```vue
<template>
  <div ref="cesiumContainer" class="cesium-container"></div>
</template>

<script setup>
import {onMounted, onUnmounted, ref} from 'vue';
import * as Cesium from "cesium";

Cesium.Ion.defaultAccessToken="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiIyOTdmM2QyNi04OTcwLTQ5MTYtOTA4MS04NGY0NGYzYWY5MzEiLCJpZCI6NDU3NDA2LCJpc3MiOiJodHRwczovL2FwaS5jZXNpdW0uY29tIiwiYXVkIjoidW5kZWZpbmVkX2RlZmF1bHQiLCJpYXQiOjE3ODQyNjI0NjZ9.2r2DGNclwQcO8ajB8tH6L0rQZudoemzDxbvlRxp-QKI"


const cesiumContainer = ref(null);
let viewer = null;

onMounted(async () => {
  if (!cesiumContainer.value) return;


  const terrains = await Cesium.createWorldTerrainAsync({
    // 开启地形的“光影阴影”效果。
    requestVertexNormals:true,
    // 开启江河湖海的“动态水波纹和反光”特效。
    requestWaterMask:true,
  })
  // 1. 初始化 Cesium Viewer
  viewer = new Cesium.Viewer(cesiumContainer.value,{
    infoBox:false,
    // 设置地形
    terrainProvider:terrains,
  });
  // 隐藏logo
  viewer.cesiumWidget.creditContainer.style.display = "none";
})


onUnmounted(() => {
  // 销毁实例，释放内存
  if (viewer) {
    viewer.destroy();
    viewer = null;
  }
});

</script>



<style scoped>
.cesium-container {
  width: 100vw;
  height: 100vh;
  margin: 0;
  padding: 0;
  overflow: hidden;
}
</style>
```



## 二、自定义地形

### 2.1 下载地形数据

地理空间数据云网站： https://www.gscloud.cn/

数据资源 -> 公开数据 -> DEM 数字高程数据  -> GDEMV3 30M 分辨率数字高程数据 -> 搜索经度113.5 纬度23.5(广州) -> 下载



### 2.2 转换地形数据

第1步：下载安装`CesiumLab`， 官网：http://www.cesiumlab.com/

第2步：启动软件，访问9004端口：

+ 数据处理 -> 地形切片



