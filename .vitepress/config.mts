import {defineConfig} from 'vitepress'

// https://vitepress.dev/reference/site-config
export default defineConfig({
    head: [
        ['meta', {name: 'algolia-site-verification', content: 'BC07CB2534C4E288'}],
    ],
    sitemap: {
        hostname: 'https://jxl1996.github.io',
    },
    vite: {
        server: {
            port: 9527, // 你想要的端口
            host: '0.0.0.0' // 可选：允许局域网访问
        }
    },
    base: "/",
    title: "Siriabc",
    description: "A VitePress Site",
    lastUpdated: true,
    appearance: "dark",
    themeConfig: {
        // https://vitepress.dev/reference/default-theme-config
        lastUpdated: {
            text: '最后更新时间',
            formatOptions: {
                dateStyle: 'short',
                timeStyle: 'medium'
            }
        },
        outline: {
            level: [2, 3], // 显示 h2 和 h3
            label: '大纲'
        },

        search: {
            provider: 'local',
        },

        nav: [
            {text: 'Home', link: '/'},
            // { text: 'Examples', link: '/markdown-examples' },
        ],

        // 侧边栏(多种配置方式)
        // 方式1: sidebar可以是一个数组
        // 方式2: sidebar是一个对象, 然后对象的字段可以是对象或数组
        sidebar: {
            '/PostgreSQL/': [
                {
                    text: 'PostgreSQL',
                    items: [
                        {text: 'pgsql20260208', link: '/PostgreSQL/pgsql20260208.md'},
                        {text: 'PostGIS', link: '/PostgreSQL/PostGIS.md'}
                    ]
                }
            ],
            '/Interview/': [
                {
                    text: '面试',
                    items: [
                        {text: 'Golang', link: '/Interview/Golang-Interview.md'},
                        {text: 'Redis', link: '/Interview/Redis-Interview.md'},
                        {text: 'Mysql', link: '/Interview/Mysql-Interview.md'},
                        {text: 'Git', link: '/Interview/Git-Interview.md'},
                        {text: 'Linux', link: '/Interview/Linux-Interview.md'},
                        {text: '前端', link: '/Interview/Frontend-Interview.md'},
                        {text: '奇安Golang方向试卷1', link: '/Interview/奇安Golang方向试卷1.md'},
                        {text: '奇安Golang方向试卷2', link: '/Interview/奇安Golang方向试卷2.md'},
                        {text: '手撕协程池', link: '/Interview/手撕协程池.md'},
                        {text: '秒杀系统设计', link: '/Interview/秒杀系统设计.md'},
                        {text: '交替打印奇偶数', link: '/Interview/交替打印奇偶数.md'},
                        {text: '参会的策略', link: '/Interview/参会的策略.md'},
                        {text: '准备生日礼物', link: '/Interview/Count-Birthday-Gifts.md'},
                    ]
                }
            ],
            '/SortAlgorithm/': [
                {
                    text: "排序算法",
                    items: [
                        {text: '冒泡排序', link: '/SortAlgorithm/01_bubble_sort.md'},
                        {text: '快速排序', link: '/SortAlgorithm/02_quick_sort.md'},
                    ]
                }
            ],

            '/VPS/': [
                {
                    text: "VPS",
                    items: [
                        {text: 'VPS搭建', link: '/VPS/vps_build.md'}
                    ]
                }
            ],
            '/Git/': [
                {
                    text: "Git",
                    items: [
                        {text: 'Github SSH协议配置', link: '/Git/github-ssh.md'}
                    ]
                }
            ],
            '/Frontend/': [
                {
                    text: "前端",
                    items: [
                        {text: '防抖和节流', link: '/Frontend/debounce-throttle.md'},
                        {text: 'nvm和nrm工具的使用', link: '/Frontend/nvm_nrm.md'}
                    ]
                }
            ],
            "/Golang/": [
                {
                    text: "Golang",
                    items: [
                        {text: 'GORM唯一约束表的插入修改', link: '/Golang/Gorm-Unique-Constraint.md'},
                        {text: 'time.Sleep(d)和<-time.After(d)的区别', link: '/Golang/Sleep_After.md'},
                    ]
                }
            ],
            "/VibeCoding/": [
                {
                    text: "Vibe Coding",
                    items: [
                        {text: 'Claude Code安装', link: '/VibeCoding/claudecode-install.md'},
                        {text: 'CLIProxyAPI', link: '/VibeCoding/cliproxyapi.md'},
                    ]
                }
            ],
            "/ElasticSearch/": [
                {
                    text: "ElasticSearch",
                    items: [
                        {text: '安装', link: '/ElasticSearch/es_install.md'},
                        {text: '密码配置', link: '/ElasticSearch/es_security.md'}
                    ]
                }
            ],
            "/Docker/":{
                text: "Docker",
                items: [
                    {text: 'Docker安装', link: '/Docker/install.md'},
                    {text: 'Docker快速上手', link: '/Docker/quick_use.md'},
                ]
            },
            "/Linux/":{
                text: "Linux",
                items: [
                    {text: 'Centos7固定IP', link: '/Linux/centos7_static_ip.md'},
                    {text: 'Centos7更新yum源', link: '/Linux/centos7_yum_update.md'},
                ]
            },
            "/MQTT/":{
                text: "MQTT",
                items: [
                    {text: 'MQTT入门', link: '/MQTT/01_mqtt_basic.md'},
                    {text: 'MQTT进阶', link: '/MQTT/02_mqtt_advanced.md'},
                    {text: 'MQTT Dashboard', link: '/MQTT/03_mqtt_dashboard.md'},
                    {text: 'MQTT使用案例', link: '/MQTT/04_mqtt_case.md'},
                ]
            },

            "/React/":{
                text: "React",
                items: [
                    {text: '创建React项目', link: '/React/create_react.md'},
                    {text: 'props与state组件通信', link: '/React/props_state.md'},
                    {text: 'useState状态管理', link: '/React/useState.md'},
                    {text: '条件渲染与列表渲染', link: '/React/condition_list_render.md'},
                    {text: 'useEffect副作用', link: '/React/useEffect.md'},
                    {text: 'useRef', link: '/React/useRef.md'},
                    {text: 'useActionState和useFormStatus', link: '/React/useActionState_useFormStatus.md'},
                    {text: 'Suspense和use', link: '/React/Suspense_use.md'},
                    {text: 'useState和useReducer', link: '/React/useState_useReducer.md'},
                    {text: '深层状态传递', link: '/React/context.md'},
                ]
            },

            "/RabbitMQ/":{
                text: "RabbitMQ",
                items: [
                    {text: 'Windows安装RabbitMQ', link: '/RabbitMQ/windows_install.md'},
                    {text: '简单模式代码', link: '/RabbitMQ/simple_mode_code.md'},
                    {text: '安全模式配置', link: '/RabbitMQ/ssl.md'},
                ]
            }
        },
    }
})
