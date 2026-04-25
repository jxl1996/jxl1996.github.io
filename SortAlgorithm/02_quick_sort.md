# 快速排序

## 一、快速排序的核心思想

快速排序的核心是：

```
选一个基准值 pivot，把数组分成两部分：
左边都比 pivot 小，右边都比 pivot 大。
然后分别对左右两部分继续做同样的操作。
```

它使用的是 **分治思想**。

所谓分治，就是：

```
大问题 → 拆成小问题 → 小问题继续拆 → 最后合并结果
```

快速排序的过程可以简单理解为：

```
先找一个数作为基准值
把比它小的放左边
把比它大的放右边
然后左边继续排序，右边继续排序
```



## 二、举个例子

假设数组是：

```
[5, 3, 8, 4, 2, 7, 1, 6]
```

我们选择第一个元素 `5` 作为基准值：

```
pivot = 5
```

目标是把数组整理成这样：

```
比 5 小的元素    5    比 5 大的元素
```

也就是：

```
[3, 4, 2, 1]  5  [8, 7, 6]
```

整理完之后，`5` 的位置就确定了。

注意：

```
快速排序每一轮不是保证整个数组有序，
而是保证 pivot 这个元素的位置已经确定。
```

然后继续对左边排序：

```
[3, 4, 2, 1]
```

继续对右边排序：

```
[8, 7, 6]
```

最终得到：

```
[1, 2, 3, 4, 5, 6, 7, 8]
```



## 三、快速排序的完整流程

快速排序主要分为两步：

### 第一步：分区 partition

分区就是围绕 `pivot` 调整元素位置。

以数组为例：

```
[5, 3, 8, 4, 2]
```

选择第一个元素作为基准值：

```
pivot = 5
```

分区之后希望变成：

```
[3, 4, 2, 5, 8]
```

这表示：

```
5 左边都比 5 小
5 右边都比 5 大
```

此时 `5` 的最终位置已经确定。

### 第二步：递归排序左右区间

然后继续处理左边：

```
[3, 4, 2]
```

继续处理右边：

```
[8]
```

右边只有一个元素，不用排序。

左边 `[3, 4, 2]` 继续快速排序。

选择 `3` 作为 pivot：

```
pivot = 3
```

分区后：

```
[2, 3, 4]
```

此时 `3` 的位置确定。

最终整个数组变成：

```
[2, 3, 4, 5, 8]
```

## 

## 四、代码实现

```go
package main

import "fmt"

func quickSort(nums []int) {
	if len(nums) <= 1 {
		return
	}

	sort(nums, 0, len(nums)-1)
}

// sort 用来递归排序 nums[left:right] 这个区间, 注意：这里的 left 和 right 都是闭区间
func sort(nums []int, left, right int) {
	// 递归结束条件：
	// 当 left >= right 时，说明区间中没有元素或只有一个元素
	// 这种情况下不需要排序
	if left >= right {
		return
	}

	pivotIndex := partition(nums, left, right)
	sort(nums, left, pivotIndex-1)
	sort(nums, pivotIndex+1, right)
}

// partition 是快速排序中最核心的函数
// 1. 选择一个基准值 pivot
// 2. 调整数组，使得 pivot 左边的元素 <= pivot, pivot 右边的元素 >= pivot
// 4. 返回 pivot 最终所在的位置
func partition(nums []int, left, right int) int {
	// 这里选择当前区间最左边的元素作为基准值
	pivot := nums[left]
	i, j := left, right

	// 当 i 和 j 没有相遇时，继续寻找需要交换的元素
	for i < j {
		// 从右往左找第一个小于 pivot 的元素
		for i < j && nums[j] >= pivot {
			j--
		}

		// 从左往右找第一个大于 pivot 的元素
		for i < j && nums[i] <= pivot {
			i++
		}

		// 如果 i 和 j 还没有相遇, 说明 nums[i] 是左边不该出现的大数, nums[j] 是右边不该出现的小数
		// 交换它们
		if i < j {
			nums[i], nums[j] = nums[j], nums[i]
		}
	}

	// 当 i == j 时，左右指针相遇
	// 此时 i 所在的位置就是 pivot 最终应该放的位置
	// 把 pivot 从 left 位置交换到 i 位置
	nums[left], nums[i] = nums[i], nums[left]

	// 返回 pivot 的最终位置
	return i
}

func main() {
	// 待排序数组
	nums := []int{5, 3, 8, 4, 2, 7, 1, 6}
	fmt.Println("排序前：", nums)
	quickSort(nums)
	fmt.Println("排序后：", nums)
}
```

