# 准备生日礼物

## 题目描述

编程题 ：完善核心代码编程 准备生日礼物

知识点 字符串、map

 ---

题目描述：

小明在一个充满人文关怀的公司上班，公司每个月都要为该月生日的同事送一份生日小礼物，该事项由小明负责，请帮助小明统计某一月份应该准备多少礼物，重复录入的员工生日以最后一次录入结果为准，请不要重复统计，避免浪费。

 

输入：

参数1，要发放礼物的月份，取值1到12。

参数2，员工列表。

参数3，员工生日日期列表，该列表和员工列表中的数据对应存在一一对应关系，长度一致。

输出：

该月份要准备的礼品个数。

补充说明：

1.小明公司的员工人数不超过100人。

2.员工姓名是字母和数字的组合，姓名长度大于0，小于16字节。

3.日期录入格式统一采用Year/Month/Day，Year长度为4，Month和Day长度为1到2，系统保证录入日期为合法日期。

4.不考虑同名多位员工的情况，名字一致即可认为是同一员工(在生产系统会通过工号区分，本系统简化处理)。

 

示例1

输入：5,["Alice", "Bob", "Charlie", "David", "Eve", "Frank", "Grace", "Helen"],["1985/5/10", "1990/10/11", "1995/10/11", "2000/11/10", "2005/05/01", "2010/10/13", "2015/10/14", "2020/5/2"]

输出：3

说明：在5月份出生的员工有3人，因此返回为3。

示例2

输入：10,["Alice", "Bob", "Charlie", "David", "Eve", "Frank", "Grace", "Helen"],["1985/05/10", "1990/10/11", "1995/10/11", "2000/11/10", "2005/10/13", "2010/10/13", "2015/10/14", "2020/10/15"]

输出：6

说明：在10月份出生的员工有6人，因此返回6。

示例3

输入：5,["Alice", "Bob", "Charlie", "Alice", "Eve", "Frank", "Grace", "Helen"],["1985/5/10", "1990/10/11", "1995/10/11", "1985/7/10", "2005/05/01", "2010/10/13", "2015/10/14", "2020/5/2"]

输出：2

说明：5月份出生的员工有2个，因此返回2。

说明：Alice重复录入了，第一次录入出生月份为5月，第二次录入出生月份为7月，因此Alice不被统计到5月份。

---



## 题目解析

这道题的核心考察点在于 **`strings` 字符串切片处理** 和 **`map` 的去重特性**。

题目中有一个非常关键的陷阱（如示例3所示）：**“重复录入的员工生日以最后一次录入结果为准”**。这意味着我们不能一边遍历一边直接统计人数，必须**先用 Map 把所有员工的最终生日记录下来（覆盖旧数据）**，最后再统一统计目标月份的人数。

```go
package main

import (
    "fmt"
    "strings"
)

// countBirthdayGifts 统计目标月份需要准备的礼物数量
// targetMonth: 目标月份 (1-12)
// employees: 员工姓名列表
// birthdays: 员工生日列表 ("Year/Month/Day")
func countBirthdayGifts(targetMonth int, employees []string, birthdays []string) int {
    // 1. 使用 map 存储员工最新的生日月份。Key: 员工姓名, Value: 生日月份(int)
    // 这样可以确保重复录入的员工，其月份总是被最后一次录入覆盖
    empMonthMap := make(map[string]int)

    for i := 0; i < len(employees); i++ {
       name := employees[i]
       bdayStr := birthdays[i]

       // 2. 解析日期字符串，提取月份
       // 日期格式为 "Year/Month/Day"，我们用 "/" 进行切割
       parts := strings.Split(bdayStr, "/")
       if len(parts) < 2 {
          continue // 防御性编程，防止格式异常
       }

       // 3. 将月份字符串转换为整数（也可以直接用字符串比对，但转成 int 更稳妥，能自动处理 "5" 和 "05" 的一致性）
       var year, month, day int
       _, err := fmt.Sscanf(bdayStr, "%d/%d/%d", &year, &month, &day)
       if err != nil {
          continue
       }

       empMonthMap[name] = month
    }

    giftCount := 0
    for _, month := range empMonthMap {
       if month == targetMonth {
          giftCount++
       }
    }

    return giftCount
}

func main() {
    // 测试示例 3
    targetMonth := 5
    employees := []string{"Alice", "Bob", "Charlie", "Alice", "Eve", "Frank", "Grace", "Helen"}
    birthdays := []string{"1985/5/10", "1990/10/11", "1995/10/11", "1985/7/10", "2005/05/01", "2010/10/13", "2015/10/14", "2020/5/2"}

    result := countBirthdayGifts(targetMonth, employees, birthdays)
    fmt.Printf("5月份需要准备的礼物个数: %d \n", result) // 输出: 2
}
```

---

补充知识点： fmt.Sscanf的使用：

```go
func main() {
	str := "2025-11-22"
	var year, month, day int
	_, err := fmt.Sscanf(str, "%d-%d-%d", &year, &month, &day)
	if err != nil {
		fmt.Println(err)
	} else {
		fmt.Println("year:", year)
		fmt.Println("month:", month)
		fmt.Println("day:", day)
	}
}
```









