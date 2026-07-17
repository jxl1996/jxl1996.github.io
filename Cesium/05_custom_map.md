# 自定义地图与地图叠加

## 一、使用天地图矢量底图

```vue
<template>
  <div ref="cesiumContainer" class="cesium-container"></div>
</template>


<script setup>
import { onMounted, onUnmounted, ref } from 'vue';
import * as Cesium from "cesium";
import '@/CesiumWidgets/widgets.css'

// 设置cesium静态资源的路径, 对应public下的路径
window.CESIUM_BASE_URL = '/plugins/cesium/'
const cesiumContainer = ref(null);
let viewer = null;

// 请在此处替换为您在天地图官网申请的浏览器端密钥 (tk)
const TDT_KEY = 'xxxxxxxx';

onMounted(()=>{
  if (!cesiumContainer.value) return;
  // 1. 初始化 Cesium Viewer
  viewer = new Cesium.Viewer(cesiumContainer.value, {
    baseLayer: false, // 核心：告诉 Cesium 初始化时不要创建任何默认底图
    baseLayerPicker:false, // 不显示图层选择器
  });


  // 2. 创建天地图“矢量路径底图”服务 (vec_w)
  const tdtVectorProvider = new Cesium.WebMapTileServiceImageryProvider({
    url: `http://t0.tianditu.gov.cn/vec_w/wmts?service=wmts&request=GetTile&version=1.0.0&LAYER=vec&tileMatrixSet=w&TileMatrix={TileMatrix}&TileRow={TileRow}&TileCol={TileCol}&style=default&format=tiles&tk=${TDT_KEY}`,
    layer: 'vec',
    style: 'default',
    format: 'image/jpeg',
    tileMatrixSetID: 'GoogleMapsCompatible', // 墨卡托投影
    maximumLevel: 18,                         // 天地图最大层级为 18
  });

  // 3. 创建天地图“矢量中文注记”服务 (cva_w)，用于显示文字地名
  const tdtLabelProvider = new Cesium.WebMapTileServiceImageryProvider({
    url: `http://t0.tianditu.gov.cn/cva_w/wmts?service=wmts&request=GetTile&version=1.0.0&LAYER=cva&tileMatrixSet=w&TileMatrix={TileMatrix}&TileRow={TileRow}&TileCol={TileCol}&style=default&format=tiles&tk=${TDT_KEY}`,
    layer: 'cva',
    style: 'default',
    format: 'image/jpeg',
    tileMatrixSetID: 'GoogleMapsCompatible',
    maximumLevel: 18,
  });

  // 4. 将图层按顺序添加进 Viewer (底图在下，注记在上面覆盖)
  viewer.imageryLayers.addImageryProvider(tdtVectorProvider);
  viewer.imageryLayers.addImageryProvider(tdtLabelProvider);

  // 5. 定位相机到中国区域
  viewer.camera.setView({
    destination: Cesium.Cartesian3.fromDegrees(104.0, 35.0, 15000000.0),
  });
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



## 二、使用天地图影像底图

```vue
<template>
  <div ref="cesiumContainer" class="cesium-container"></div>
</template>


<script setup>
import { onMounted, onUnmounted, ref } from 'vue';
import * as Cesium from "cesium";
import '@/CesiumWidgets/widgets.css'

// 设置cesium静态资源的路径, 对应public下的路径
window.CESIUM_BASE_URL = '/plugins/cesium/'
const cesiumContainer = ref(null);
let viewer = null;

// 请在此处替换为您在天地图官网申请的浏览器端密钥 (tk)
const TDT_KEY = 'xxxxxxxx';

onMounted(()=>{
  if (!cesiumContainer.value) return;
  // 1. 初始化 Cesium Viewer
  viewer = new Cesium.Viewer(cesiumContainer.value, {
    baseLayer: false, // 核心：告诉 Cesium 初始化时不要创建任何默认底图
    baseLayerPicker:false, // 不显示图层选择器
  });


  // 2. 添加天地图“影像底图” (img_w)
  viewer.imageryLayers.addImageryProvider(
      new Cesium.WebMapTileServiceImageryProvider({
        url: `http://t0.tianditu.gov.cn/img_w/wmts?service=wmts&request=GetTile&version=1.0.0&LAYER=img&tileMatrixSet=w&TileMatrix={TileMatrix}&TileRow={TileRow}&TileCol={TileCol}&style=default&format=tiles&tk=${TDT_KEY}`,
        layer: 'img',
        style: 'default',
        format: 'image/jpeg',
        tileMatrixSetID: 'GoogleMapsCompatible',
        maximumLevel: 18,
      })
  );

  // 3. 添加天地图“影像中文注记” (cia_w)
  viewer.imageryLayers.addImageryProvider(
      new Cesium.WebMapTileServiceImageryProvider({
        url: `http://t0.tianditu.gov.cn/cia_w/wmts?service=wmts&request=GetTile&version=1.0.0&LAYER=cia&tileMatrixSet=w&TileMatrix={TileMatrix}&TileRow={TileRow}&TileCol={TileCol}&style=default&format=tiles&tk=${TDT_KEY}`,
        layer: 'cia',
        style: 'default',
        format: 'image/jpeg',
        tileMatrixSetID: 'GoogleMapsCompatible',
        maximumLevel: 18,
      })
  );

  // 5. 定位相机到中国区域
  viewer.camera.setView({
    destination: Cesium.Cartesian3.fromDegrees(104.0, 35.0, 15000000.0),
  });
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



## 三、使用高德矢量底图

```vue
<template>
  <div ref="cesiumContainer" class="cesium-container"></div>
</template>


<script setup>
import { onMounted, onUnmounted, ref } from 'vue';
import * as Cesium from "cesium";
import '@/CesiumWidgets/widgets.css'

// 设置cesium静态资源的路径, 对应public下的路径
window.CESIUM_BASE_URL = '/plugins/cesium/'
const cesiumContainer = ref(null);
let viewer = null;


onMounted(()=>{
  if (!cesiumContainer.value) return;
  // 1. 初始化 Cesium Viewer
  viewer = new Cesium.Viewer(cesiumContainer.value, {
    baseLayer: false, // 核心：告诉 Cesium 初始化时不要创建任何默认底图
    baseLayerPicker:false, // 不显示图层选择器
  });


// 2. 创建高德矢量路径底图（包含中文标注）
  // style=7 代表标准矢量路线图；wprd01 ~ wprd04 是高德的四个不同子域名服务器，写哪一个都可，这里用 03
  const amapVectorProvider = new Cesium.UrlTemplateImageryProvider({
    url: 'https://wprd03.is.autonavi.com/appmaptile?x={x}&y={y}&z={z}&lang=zh_cn&size=1&scl=1&style=7',
    minimumLevel: 1,
    maximumLevel: 18
  });

  // 3. 将高德矢量底图添加进图层集合
  viewer.imageryLayers.addImageryProvider(amapVectorProvider);

  // 5. 定位相机到中国区域
  viewer.camera.setView({
    destination: Cesium.Cartesian3.fromDegrees(104.0, 35.0, 15000000.0),
  });
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



## 四、使用OSM底图

```vue
<template>
  <div ref="cesiumContainer" class="cesium-container"></div>
</template>


<script setup>
import { onMounted, onUnmounted, ref } from 'vue';
import * as Cesium from "cesium";
import '@/CesiumWidgets/widgets.css'

// 设置cesium静态资源的路径, 对应public下的路径
window.CESIUM_BASE_URL = '/plugins/cesium/'
const cesiumContainer = ref(null);
let viewer = null;


onMounted(()=>{
  if (!cesiumContainer.value) return;
  // 1. 初始化 Cesium Viewer
  viewer = new Cesium.Viewer(cesiumContainer.value, {
    baseLayer: false, // 核心：告诉 Cesium 初始化时不要创建任何默认底图
    baseLayerPicker:false, // 不显示图层选择器
  });


// 2. 使用标准 XYZ 模板加载 OpenStreetMap 底图
  const osmProvider = new Cesium.UrlTemplateImageryProvider({
    // a.tile, b.tile, c.tile 是 OSM 的三个负载均衡服务器
    url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
    subdomains: ['a', 'b', 'c'], // 对应上面 url 里的 {s}
    minimumLevel: 0,
    maximumLevel: 19,            // OSM 最大支持到 19 级
    // 尊重版权，在地图右下角保留 OSM 署名
    credit: new Cesium.Credit('© <a href="https://www.openstreetmap.org/copyright" target="_blank">OpenStreetMap</a> contributors')
  });

  // 3. 将 OSM 底图添加进 Viewer
  viewer.imageryLayers.addImageryProvider(osmProvider);

  // 5. 定位相机到中国区域
  viewer.camera.setView({
    destination: Cesium.Cartesian3.fromDegrees(104.0, 35.0, 15000000.0),
  });
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



## 五、高德矢量底图+天地图影像底图

```vue
<template>
  <div ref="cesiumContainer" class="cesium-container"></div>
</template>


<script setup>
import {onMounted, onUnmounted, ref} from 'vue';
import * as Cesium from "cesium";
import '@/CesiumWidgets/widgets.css'

// 设置cesium静态资源的路径, 对应public下的路径
window.CESIUM_BASE_URL = '/plugins/cesium/'
const cesiumContainer = ref(null);
let viewer = null;

// 请在此处替换为您在天地图官网申请的浏览器端密钥 (tk)
const TDT_KEY = 'xxxxxxxx';

onMounted(() => {
  if (!cesiumContainer.value) return;
  // 1. 初始化 Cesium Viewer
  viewer = new Cesium.Viewer(cesiumContainer.value, {
    baseLayer: false, // 核心：告诉 Cesium 初始化时不要创建任何默认底图
    baseLayerPicker: false, // 不显示图层选择器
  });


  // 2. 创建高德矢量路径底图（包含中文标注）
  // style=7 代表标准矢量路线图；wprd01 ~ wprd04 是高德的四个不同子域名服务器，写哪一个都可，这里用 03
  const layerA = viewer.imageryLayers.addImageryProvider(new Cesium.UrlTemplateImageryProvider({
    url: 'https://wprd03.is.autonavi.com/appmaptile?x={x}&y={y}&z={z}&lang=zh_cn&size=1&scl=1&style=7',
    minimumLevel: 1,
    maximumLevel: 18
  }));

  // 2. 添加天地图“影像底图” (img_w)
  const layerB = viewer.imageryLayers.addImageryProvider(
      new Cesium.WebMapTileServiceImageryProvider({
        url: `http://t0.tianditu.gov.cn/img_w/wmts?service=wmts&request=GetTile&version=1.0.0&LAYER=img&tileMatrixSet=w&TileMatrix={TileMatrix}&TileRow={TileRow}&TileCol={TileCol}&style=default&format=tiles&tk=${TDT_KEY}`,
        layer: 'img',
        style: 'default',
        format: 'image/jpeg',
        tileMatrixSetID: 'GoogleMapsCompatible',
        maximumLevel: 18,

      })
  );
  // 给上层的图添加透明度！！！
  layerB.alpha = 0.5

  // 5. 定位相机到中国区域
  viewer.camera.setView({
    destination: Cesium.Cartesian3.fromDegrees(104.0, 35.0, 15000000.0),
  });
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







