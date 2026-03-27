1. 单选题:  对一个文件的访问，常由（  ）共同限制

<span style="color:hotpink">A. 用户访问权限和文件属性</span>

B. 用户访问权限和文件优先级

C. 优先级和文件属性

D. 文件属性和口令

---



2. 单选题:  下列关于TCP和UDP的描述正确的是(  )。

A .TCP和UDP都是无连接的

<span style="color:hotpink">B. TCP是面向连接的，UDP是面向无连接的</span>

C. TCP适用于可靠性较差的广域网，UDP适用于可靠性较高的局域网

D. TCP适用于可靠性较高的局域网，UDP适用于可靠性较差的广域网

---



3. 单选题: 存在若干个字符串，若要查找具有相同前缀的字符串，以下哪种数据结构比较适合

A. 红黑树

B. 哈希表

<span style="color:hotpink">C. Trie树</span> （前缀树）

D. 栈

---



4. 单选题: 以下哪个算法是用于求解两个正整数的最大公约数的算法？

A. Dijkstra算法

<span style="color:hotpink">B. 辗转相除法</span>

C. Floyd算法

D. 其他

---



5. 单选题:  以下哪个数据结构可用来抽象在电影院售票厅排队买票的场景？

A. 栈

B. 堆

<span style="color:hotpink">C. 队列</span>

D. 二叉树

---



6. 单选题: skiplist的查询时间复杂度和以下哪种数据结构不相同？

A. 红黑树

B. AVL树

<span style="color:hotpink">C. 有序的单链表</span>

D. 有序数组

> [!NOTE]
>
> 题目解析:
>
> 🔍 各选项复杂度对比
>
> | 数据结构   | 查询时间复杂度         |
> | ---------- | ---------------------- |
> | SkipList   | O(log n)               |
> | 红黑树     | O(log n)               |
> | AVL树      | O(log n)               |
> | 有序单链表 | **O(n)** ❌             |
> | 有序数组   | O(log n)（可二分查找） |

---



7. 一个台阶总共有10 级，一次可以向上走1 级，也可以向上走2 级，请问一共有多少种走法？

题目解析:

```go
package main

import "fmt"

func ClimbStairs(n int) int {
    if n <= 2 {
       return n
    }

    // preTwo: 到达当前台阶的前两级的方法数 (f(n-2))
    // preOne: 到达当前台阶的前一级的方法数 (f(n-1))
    preTwo, preOne := 1, 2

    var current int
    for i := 3; i <= n; i++ {
       // 当前方法数 = 走 1 步上来的 + 走 2 步上来的
       current = preOne + preTwo

       // 滚动更新
       preTwo = preOne
       preOne = current
    }

    return current
}

func main() {
    fmt.Println(ClimbStairs(10))
}
```

正确答案: 一共89中走法

---



8. 单选题: mysql的数据库索引使用的是下面那种数据结构

A.skiplist

B. 红黑树

C. AVL树

<span style="color:hotpink">D. B+树</span>

---



9. 单选题: 下面说法正确的是?

<span style="color:hotpink">A. epoll ET模式必须配合non-blocking IO使用</span>

B. epoll LT模式必须配合non-blocking IO使用

C. epoll ET可以配合blocking IO使用

> [!NOTE]
>
> 题目解析:
>
> Linux 下 **epoll** 有两种工作模式：
>
> | 模式 | 英文全称                    | 特点                                                         |
> | ---- | --------------------------- | ------------------------------------------------------------ |
> | LT   | Level Triggered（水平触发） | 默认模式，类似 poll/select，只有有事件才触发，但不会漏掉事件，可以用 blocking 或 non-blocking IO |
> | ET   | Edge Triggered（边缘触发）  | 高效模式，只在状态发生变化时触发一次，需要非阻塞 IO，否则可能漏掉事件 |

---



10.  单选题: 在一个空目录下执行umask 333; touch hello;命令后，hello文件的权限为？

<span style="color:hotpink">A. r--r--r--</span>

B. rw-rw-rw

C. -wx-wx-wx

D.rwxrwxrw-

> [!NOTE]
>
> 题目解析: 
>
> - `umask` 用于 **设置默认权限掩码**，表示 **“新文件默认禁止的权限”**
> - 新建文件的默认权限 = **系统默认权限 – umask**
>
> > ⚠️ 注意：
> >
> > - 系统默认权限：
> >   - 普通文件默认 `666`（rw-rw-rw-）
> >   - 目录默认 `777`（rwxrwxrwx）
>
> - `umask` 是八进制数字，每位分别对应 **用户/组/其他** 的权限屏蔽
>
>   
>
> 创建文件 `touch hello`
>
> - 普通文件默认权限：`666`（rw-rw-rw-）
> - 应用 umask：
>
> ```
> 666 (rw-rw-rw-)
> - 333 (屏蔽 w+x)
> = 444 (r--r--r--)
> ```

---



11. 单选题: 在DNS系统测试时，假设named进程号是53，如何通知进程重读配置文件?

A. kill -USR2 53

B. kill -USR1 53

C. kill -INT 53

<span style="color:hotpink">D .kill -HUP 53</span>

---



12. 单选题: 您需要从您的数据库中删除名为 EmployeeView 的视图。应使用哪条语句

A. DELETE EmployeeView

B. DELETE VIEW EmployeeView

C. DROP EmployeeView

<span style="color:hotpink">D. DROP VIEW EmployeeView</span>

---



13.  单选题: 关于NAT说法不正确的是？

A. 可实现地址转换

B. 可实现端口转换

<span style="color:hotpink">C. IPv6根本不需要NAT</span>

D. 可同时实现地址和端口转换

> [!NOTE]
>
> 题目分析:
>
> | 选项                       | 正确与否 | 原因                                                         |
> | -------------------------- | -------- | ------------------------------------------------------------ |
> | A 可实现地址转换           | ✅        | NAT 核心功能之一                                             |
> | B 可实现端口转换           | ✅        | 通过 PAT 实现多用户共享 IP                                   |
> | C IPv6根本不需要NAT        | ❌        | 理论上 IPv6 地址极多，不需要 IPv4 那样做 NAT，但“根本不需要 NAT”不完全正确：在某些企业安全场景仍可能使用 NPTv6（Network Prefix Translation） |
> | D 可同时实现地址和端口转换 | ✅        | 最常见 NAT 类型                                              |

---



14. 单选题: 下列哪些不是IPv6过渡技术

A. 隧道技术

B. 地址翻译技术

C. 双栈技术

<span style="color:hotpink">D. 应用识别技术</span>

> [!NOTE]
>
> 题目解析:
>
> + 隧道技术: 将 IPv6 数据包封装在 IPv4 网络中传输
> + 地址翻译技术: 在 IPv4 和 IPv6 之间做地址转换
> + 双栈技术: 网络设备同时支持 IPv4 和 IPv6, 可以同时运行两个协议栈，实现平滑过渡
> + 应用识别技术: 不是 IPv6 过渡技术, 用于 **流量管理、QoS、网络监控**, 和 IPv6 迁移无关

---



15. 编程题: 老板一共需要给某个员工发奖金n元，可以选择一次发1元，也可以选择一次发2元，也可以选择一次发3元。请问老板给这位员工发放完n元奖金共有多少种不同的方法？

```go
package main

import "fmt"

func CountWays(n int) int {
    // 处理基础边界情况
    if n == 0 { return 1 } // 0元只有一种发法：不发
    if n == 1 { return 1 } // 1
    if n == 2 { return 2 } // 1+1, 2
    if n == 3 { return 4 } // 1+1+1, 1+2, 2+1, 3

    // 初始化前三个状态
    a, b, c := 1, 2, 4
    var current int

    for i := 4; i <= n; i++ {
        // 当前状态等于前三个状态之和
        current = a + b + c
        
        // 窗口向后滑动
        a = b
        b = c
        c = current
    }

    return c
}

func main() {
    n := 10 // 假设奖金总额为 10 元
    result := CountWays(n)
    fmt.Printf("发放 %d 元奖金的总方法数为：%d\n", n, result)
}
```

