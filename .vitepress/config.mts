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
            // provider: 'local',
            provider: 'algolia',
            options: {
                appId: '5YLNL59X0S',
                apiKey: 'b4bde6dd5a880111cf435577f7c40ce0',
                indexName: 'code note'
            }
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
                        {text: 'demo1', link: '/PostgreSQL/demo1.md'}
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
                        {text: '奇安Golang方向试卷1', link: '/Interview/奇安Golang方向试卷1.md'},
                        {text: '奇安Golang方向试卷2', link: '/Interview/奇安Golang方向试卷2.md'},
                        {text: '手撕协程池', link: '/Interview/手撕协程池.md'},
                        {text: '秒杀系统设计', link: '/Interview/秒杀系统设计.md'},
                        {text: '交替打印奇偶数', link: '/Interview/交替打印奇偶数.md'},
                        {text: '参会的策略', link: '/Interview/参会的策略.md'},
                    ]
                }
            ],
            '/SortAlgorithm/': [
                {
                    text: "排序算法",
                    items: [
                        {text: '冒泡排序', link: '/SortAlgorithm/01_bubble_sort.md'},
                    ]
                }
            ],
            // '/UniApp/': [
            //     {
            //         text: "UniApp",
            //         items: [
            //             {text: 'UniApp中对pinia数据持久化', link: '/UniApp/pinia-plugin-persistedstate.md'},
            //         ]
            //     }
            // ],
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
                        {text: '防抖和节流', link: '/Frontend/debounce-throttle.md'}
                    ]
                }
            ],
            "/Golang/": [
                {
                    text: "Golang",
                    items: [
                        {text: 'GORM唯一约束表的插入修改', link: '/Golang/Gorm-Unique-Constraint.md'}
                    ]
                }
            ]
        },

        // socialLinks: [
        //   { icon: 'github', link: 'https://github.com/vuejs/vitepress' }
        // ]
    }
})
