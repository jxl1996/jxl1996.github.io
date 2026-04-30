# PostGIS

## 1. PostGIS 是什么

PostGIS 是 PostgreSQL 的空间扩展，用来存储、索引、查询地理空间数据，比如经纬度点、路线、行政区域、多边形范围等。官方说明里也强调，它给 PostgreSQL 增加了存储、索引和查询 geospatial data 的能力。

常见用途：

| 场景     | 例子                             |
| -------- | -------------------------------- |
| 附近功能 | 附近的人、附近门店、附近充电桩   |
| 距离计算 | A 到 B 有多少米                  |
| 范围判断 | 用户是否在配送范围内             |
| 区域查询 | 查询某个城市、商圈、围栏内的数据 |
| 地图数据 | 点、线、面、多边形存储           |

## 2. 安装和启用 PostGIS

每个数据库都要单独启用扩展。官方入门文档给出的启用方式就是 `CREATE EXTENSION postgis;`

```sql
-- 进入你的业务数据库后执行
CREATE EXTENSION IF NOT EXISTS postgis;

-- 查看 PostGIS 版本
SELECT PostGIS_Version();
```

## 3. 核心数据类型

PostGIS 里最常见的是这两个类型：

| 类型        | 适合场景                               | 距离单位           |
| ----------- | -------------------------------------- | ------------------ |
| `geometry`  | 平面几何、区域判断、地图数据、投影坐标 | 取决于 SRID 的单位 |
| `geography` | 经纬度距离计算、附近查询               | 米                 |

`ST_DWithin` 官方文档说明：对 `geometry` 来说，距离单位由空间参考系统决定；对 `geography` 来说，距离单位是米。
 所以你做“附近 3 公里门店”这种功能，推荐直接用 `geography(Point, 4326)`。

坐标顺序一定注意： 

```sql
ST_MakePoint(经度, 纬度)
```



## 4. 示例一：门店表 shops

### 4.1 建表

```sql
DROP TABLE IF EXISTS shops;

CREATE TABLE shops (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    category VARCHAR(50) NOT NULL,
    address VARCHAR(255),

    -- 经度、纬度，方便后端和前端展示
    lng NUMERIC(10, 7) NOT NULL,
    lat NUMERIC(10, 7) NOT NULL,

    -- PostGIS 地理位置字段，适合做距离查询
    location GEOGRAPHY(POINT, 4326) NOT NULL,

    status SMALLINT NOT NULL DEFAULT 1,
    created_at TIMESTAMP NOT NULL DEFAULT now()
);
```

说明：

```
location GEOGRAPHY(POINT, 4326)
```

表示：

| 部分        | 含义                           |
| ----------- | ------------------------------ |
| `GEOGRAPHY` | 地理坐标类型，距离单位通常用米 |
| `POINT`     | 点类型                         |
| `4326`      | WGS84 经纬度坐标系，地图常用   |

### 4.2 创建空间索引

空间查询一定要加 GiST 索引。PostGIS FAQ 说明，创建空间索引时要用 `USING GIST`，否则普通 B-Tree 索引对空间查询没帮助。

```sql
CREATE INDEX idx_shops_location_gist
ON shops
USING GIST (location);

-- 普通业务索引
CREATE INDEX idx_shops_category
ON shops (category);

CREATE INDEX idx_shops_status
ON shops (status);
```

### 4.3 插入示例数据

下面用北京附近几个点举例。

```sql
INSERT INTO shops (name, category, address, lng, lat, location)
VALUES
(
    '天安门咖啡店',
    'coffee',
    '北京市东城区天安门附近',
    116.397128,
    39.916527,
    ST_SetSRID(ST_MakePoint(116.397128, 39.916527), 4326)::geography
),
(
    '王府井奶茶店',
    'milk_tea',
    '北京市东城区王府井',
    116.411376,
    39.909652,
    ST_SetSRID(ST_MakePoint(116.411376, 39.909652), 4326)::geography
),
(
    '西单便利店',
    'store',
    '北京市西城区西单',
    116.374072,
    39.907422,
    ST_SetSRID(ST_MakePoint(116.374072, 39.907422), 4326)::geography
),
(
    '三里屯酒吧',
    'bar',
    '北京市朝阳区三里屯',
    116.454089,
    39.933626,
    ST_SetSRID(ST_MakePoint(116.454089, 39.933626), 4326)::geography
);
```

这里用了：

```sql
ST_SetSRID(ST_MakePoint(lng, lat), 4326)::geography
```

`ST_SetSRID` 只是给几何对象设置 SRID 元数据，不会真正转换坐标；如果要把坐标从一个坐标系转换到另一个坐标系，才用 `ST_Transform`。



## 5. 查询附近门店

假设用户当前位置是：

```
经度：116.397128
纬度：39.916527
```

查询 3 公里内的门店：

```sql
SELECT
    id,
    name,
    category,
    address,
    lng,
    lat,
    ROUND(
        ST_Distance(
            location,
            ST_SetSRID(ST_MakePoint(116.397128, 39.916527), 4326)::geography
        )
    ) AS distance_m
FROM shops
WHERE status = 1
  AND ST_DWithin(
        location,
        ST_SetSRID(ST_MakePoint(116.397128, 39.916527), 4326)::geography,
        3000
      )
ORDER BY distance_m ASC;
```

+ `ST_DWithin` 用来判断两个对象是否在指定距离内；对 `geography` 类型来说，这个距离单位是米。
+ `ST_Distance` 用来计算两个空间对象之间的距离；对 `geography` 类型，默认返回以米为单位的测地线距离。	



## 6. 查询最近的 N 个门店

不限制范围，只查最近 5 个：

```sql
SELECT
    id,
    name,
    category,
    address,
    lng,
    lat,
    ROUND(
        ST_Distance(
            location,
            ST_SetSRID(ST_MakePoint(116.397128, 39.916527), 4326)::geography
        )
    ) AS distance_m
FROM shops
WHERE status = 1
ORDER BY
    ST_Distance(
        location,
        ST_SetSRID(ST_MakePoint(116.397128, 39.916527), 4326)::geography
    ) ASC
LIMIT 5;
```

不过真实项目里更推荐先用 `ST_DWithin` 限定范围，再排序：

```sql
SELECT
    id,
    name,
    category,
    address,
    lng,
    lat,
    ROUND(
        ST_Distance(
            location,
            ST_SetSRID(ST_MakePoint(116.397128, 39.916527), 4326)::geography
        )
    ) AS distance_m
FROM shops
WHERE status = 1
  AND ST_DWithin(
        location,
        ST_SetSRID(ST_MakePoint(116.397128, 39.916527), 4326)::geography,
        10000
      )
ORDER BY distance_m ASC
LIMIT 5;
```



## 7. 按分类查询附近门店

比如查询用户 5 公里内的奶茶店：

```sql
SELECT
    id,
    name,
    category,
    address,
    lng,
    lat,
    ROUND(
        ST_Distance(
            location,
            ST_SetSRID(ST_MakePoint(116.397128, 39.916527), 4326)::geography
        )
    ) AS distance_m
FROM shops
WHERE status = 1
  AND category = 'milk_tea'
  AND ST_DWithin(
        location,
        ST_SetSRID(ST_MakePoint(116.397128, 39.916527), 4326)::geography,
        5000
      )
ORDER BY distance_m ASC;
```



## 8. 更新门店位置

```sql
UPDATE shops
SET
    lng = 116.420000,
    lat = 39.920000,
    location = ST_SetSRID(ST_MakePoint(116.420000, 39.920000), 4326)::geography
WHERE id = 1;
```

注意：只更新 `lng`、`lat` 不够，必须同步更新 `location` 字段。



## 9. 示例二：配送区域表 delivery_areas

附近查询用 `geography` 很方便，但“用户是否在某个配送区域内”这种判断，常用 `geometry(Polygon, 4326)`。

### 9.1 建表

```sql
DROP TABLE IF EXISTS delivery_areas;

CREATE TABLE delivery_areas (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    area GEOMETRY(POLYGON, 4326) NOT NULL,
    status SMALLINT NOT NULL DEFAULT 1,
    created_at TIMESTAMP NOT NULL DEFAULT now()
);
```

### 9.2 创建索引

```sql
CREATE INDEX idx_delivery_areas_area_gist
ON delivery_areas
USING GIST (area);
```

### 9.3 插入一个配送区域

这里插入一个简单矩形区域，真实项目里可以用地图画多边形，然后把坐标传给后端。

```sql
INSERT INTO delivery_areas (name, area)
VALUES (
    '天安门配送区域',
    ST_GeomFromText(
        'POLYGON((
            116.380000 39.900000,
            116.420000 39.900000,
            116.420000 39.930000,
            116.380000 39.930000,
            116.380000 39.900000
        ))',
        4326
    )
);
```

`ST_GeomFromText` 用来把 WKT 文本转换成 PostGIS 的 geometry 对象；它可以带 SRID 参数。



## 10. 判断用户是否在配送范围内

假设用户坐标：

```
经度：116.397128
纬度：39.916527
```

```sql
SELECT
    id,
    name
FROM delivery_areas
WHERE status = 1
  AND ST_Contains(
        area,
        ST_SetSRID(ST_MakePoint(116.397128, 39.916527), 4326)
      );
```

`ST_Contains(A, B)` 表示 A 是否包含 B，例如“配送区域是否包含用户当前位置”。

也可以用 `ST_Intersects`：

```sql
SELECT
    id,
    name
FROM delivery_areas
WHERE status = 1
  AND ST_Intersects(
        area,
        ST_SetSRID(ST_MakePoint(116.397128, 39.916527), 4326)
      );
```

`ST_Intersects` 判断两个空间对象是否有交集。



## 11. 查询某个区域内的所有门店

因为 `shops.location` 是 `geography`，而 `delivery_areas.area` 是 `geometry`，这里要把门店位置转回 `geometry`：

```sql
SELECT
    s.id,
    s.name,
    s.category,
    s.address,
    s.lng,
    s.lat
FROM shops s
JOIN delivery_areas d
  ON ST_Contains(
        d.area,
        s.location::geometry
     )
WHERE d.id = 1
  AND s.status = 1
  AND d.status = 1;
```



## 12. 计算配送区域面积

如果 `area` 是 `geometry(Polygon, 4326)`，直接 `ST_Area(area)` 得到的是“度”的平面面积，不适合业务使用。

推荐转成 `geography` 后计算平方米：

```sql
SELECT
    id,
    name,
    ROUND(ST_Area(area::geography)::numeric, 0) AS area_square_meter,
    ROUND((ST_Area(area::geography) / 1000000)::numeric, 4) AS area_square_km
FROM delivery_areas;
```



## 13. 常用查询汇总

### 13.1 查询 3 公里内门店

```sql
SELECT
    id,
    name,
    category,
    address,
    lng,
    lat,
    ROUND(
        ST_Distance(
            location,
            ST_SetSRID(ST_MakePoint(116.397128, 39.916527), 4326)::geography
        )
    ) AS distance_m
FROM shops
WHERE status = 1
  AND ST_DWithin(
        location,
        ST_SetSRID(ST_MakePoint(116.397128, 39.916527), 4326)::geography,
        3000
      )
ORDER BY distance_m ASC;
```



### 13.2 查询 5 公里内奶茶店

```sql
SELECT
    id,
    name,
    category,
    address,
    lng,
    lat,
    ROUND(
        ST_Distance(
            location,
            ST_SetSRID(ST_MakePoint(116.397128, 39.916527), 4326)::geography
        )
    ) AS distance_m
FROM shops
WHERE status = 1
  AND category = 'milk_tea'
  AND ST_DWithin(
        location,
        ST_SetSRID(ST_MakePoint(116.397128, 39.916527), 4326)::geography,
        5000
      )
ORDER BY distance_m ASC;
```



### 13.3 查询最近 5 个门店

```sql
SELECT
    id,
    name,
    category,
    address,
    lng,
    lat,
    ROUND(
        ST_Distance(
            location,
            ST_SetSRID(ST_MakePoint(116.397128, 39.916527), 4326)::geography
        )
    ) AS distance_m
FROM shops
WHERE status = 1
  AND ST_DWithin(
        location,
        ST_SetSRID(ST_MakePoint(116.397128, 39.916527), 4326)::geography,
        10000
      )
ORDER BY distance_m ASC
LIMIT 5;
```



### 13.4 判断用户是否在配送区域

```sql
SELECT
    id,
    name
FROM delivery_areas
WHERE status = 1
  AND ST_Contains(
        area,
        ST_SetSRID(ST_MakePoint(116.397128, 39.916527), 4326)
      );
```



### 13.5 查询配送区域内所有门店

```sql
SELECT
    s.id,
    s.name,
    s.category,
    s.address,
    s.lng,
    s.lat
FROM shops s
JOIN delivery_areas d
  ON ST_Contains(d.area, s.location::geometry)
WHERE d.id = 1
  AND s.status = 1
  AND d.status = 1;
```



## 14.  真实项目推荐写法

做“附近功能”，表结构推荐这样：

```sql
CREATE TABLE nearby_places (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    type VARCHAR(50) NOT NULL,

    lng NUMERIC(10, 7) NOT NULL,
    lat NUMERIC(10, 7) NOT NULL,

    location GEOGRAPHY(POINT, 4326) NOT NULL,

    city_code VARCHAR(20),
    status SMALLINT NOT NULL DEFAULT 1,
    created_at TIMESTAMP NOT NULL DEFAULT now()
);

CREATE INDEX idx_nearby_places_location_gist
ON nearby_places
USING GIST (location);

CREATE INDEX idx_nearby_places_city_type_status
ON nearby_places (city_code, type, status);
```

附近查询模板：

```sql
SELECT
    id,
    name,
    type,
    lng,
    lat,
    ROUND(
        ST_Distance(
            location,
            ST_SetSRID(ST_MakePoint(:lng, :lat), 4326)::geography
        )
    ) AS distance_m
FROM nearby_places
WHERE status = 1
  AND city_code = :city_code
  AND type = :type
  AND ST_DWithin(
        location,
        ST_SetSRID(ST_MakePoint(:lng, :lat), 4326)::geography,
        :radius_m
      )
ORDER BY distance_m ASC
LIMIT :limit OFFSET :offset;
```

在 Go 后端里，参数一般就是：

```
lng       用户经度
lat       用户纬度
radius_m  查询半径，单位米
type      类型
city_code 城市编码
limit     每页数量
offset    分页偏移
```





