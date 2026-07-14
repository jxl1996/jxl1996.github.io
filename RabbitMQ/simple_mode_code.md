# 简单模式代码

## 一、生产者代码

```go
package main

import (
	"log"

	"github.com/streadway/amqp"
)

func main() {
	// ==========================================
	// 0. 配置连接参数
	// ==========================================
	username := "guest"       // RabbitMQ 默认的管理员用户名
	password := "guest"       // RabbitMQ 默认的管理员密码
	addr := "localhost:5672/" // RabbitMQ 的底层通信端口，默认是 5672（注意：15672 是 Web 管理界面的端口）

	// 组装成标准 AMQP 协议的 URL 格式：amqp://user:pass@host:port/vhost
	// 末尾的 "/" 代表连接到 RabbitMQ 默认的虚拟机（Virtual Host），类似于数据库中的 default database
	dialUrl := "amqp://" + username + ":" + password + "@" + addr

	// ==========================================
	// 1. 与 RabbitMQ 服务端建立底层的 TCP 连接
	// ==========================================
	// amqp.Dial 会在后台与 MQ 服务器进行 TCP 三次握手，并完成身份权限校验。
	// 这个连接（Connection）是线程安全的，在实际生产中，整个应用通常只需要维持 1 个 TCP 连接。
	conn, err := amqp.Dial(dialUrl)
	if err != nil {
		// 如果 MQ 未启动、密码错误或网络不通，程序打印错误并直接退出（os.Exit(1)）
		log.Fatal("Failed to connect to RabbitMQ:", err)
	}
	// 执行机制：利用 defer 确保 main 函数退出前，绝对会关闭 TCP 连接，释放服务器文件句柄
	defer conn.Close()

	// ==========================================
	// 2. 在 TCP 连接之上创建一个“信道”（Channel）
	// ==========================================
	// 核心原理：TCP 连接的建立和销毁非常消耗性能。为了高并发，RabbitMQ 引入了 Channel 概念。
	// Channel 是建立在 TCP 连接之上的“虚拟连接”。几乎所有的业务操作（发消息、消费消息、建队列）都是在 Channel 里完成的。
	// 生产环境中，我们可以为不同的业务 Goroutine 分配不同的 Channel，复用同一个底层 TCP 连接。
	ch, err := conn.Channel()
	if err != nil {
		log.Fatal("Failed to open a channel:", err)
	}
	// 执行机制：同样利用 defer 确保通道用完后关闭。通道关闭会释放 MQ 服务端为该通道分配的内存。
	defer ch.Close()

	// ==========================================
	// 3. 声明（创建）一个队列
	// ==========================================
	// QueueDeclare 的逻辑是：“如果队列不存在则创建；如果已存在且参数一致则什么都不做；如果已存在但参数不一致则报错”。
	// 返回值 queue 包含队列的真实名称、消息计数、消费者计数等元数据。
	queue, err := ch.QueueDeclare(
		"simple", // 1. Name (字符串): 队列的名称。如果传空字符串 "", MQ 会随机生成一个唯一的队列名。
		true,     // 2. Durable (布尔值): 是否持久化。
		//    - true: 队列元数据会写入磁盘。MQ 服务器重启后，这个队列【依然存在】。
		//    - false: 暂存队列。MQ 重启后，这个队列会完全消失。
		//    *注*：新版 MQ 限制了非持久化队列的单独使用，因此这里必须设为 true 才能规避你之前的报错。
		false, // 3. AutoDelete (布尔值): 是否自动删除。
		//    - true: 当最后一个正在消费该队列的 Consumer（消费者）断开连接后，队列自动被删除。
		//    - false: 即使没有任何消费者，队列也雷打不动地存在，消息会一直堆积。
		false, // 4. Exclusive (布尔值): 是否排他（独占）。
		//    - true: 该队列仅对“当前创建它的 TCP 连接”可见，其他连接无法访问。且当该连接断开时，队列自动删除。
		//    - false: 普通共享队列，全系统的所有连接只要有权限都能对其读写。
		false, // 5. NoWait (布尔值): 是否非阻塞（无需等待服务器确认）。
		//    - true: 客户端发完创建命令后立即向下执行，不管服务器创建成功与否。如果出错，只能在后面异步捕获。
		//    - false: 阻塞等待。客户端会卡在这里，直到收到 RabbitMQ 回复“队列已创建成功”才会继续往下走。更安全。
		nil, // 6. Arguments (amqp.Table 类型，即 map[string]interface{}): 额外的高级参数配置。
		//    - 可以传 nil 表示没有特殊要求。
		//    - 常用高级配置包括：x-max-length（最大消息条数）、x-message-ttl（消息过期时间/死信队列配置）等。
	)
	if err != nil {
		log.Fatal("Failed to declare a queue:", err)
	}

	// ==========================================
	// 4. 向队列发送一条消息
	// ==========================================
	// 在简单模式中，我们不显式指定交换机（Exchange），而是利用 RabbitMQ 自带的“默认直连交换机”。
	err = ch.Publish(
		"", // 1. Exchange (字符串): 交换机名称。
		//    - 传空字符串 "" 代表使用 RabbitMQ 默认的 AMQP Default Exchange（直连类型）。
		//    - 默认交换机的特殊规则：它会自动把消息路由到【名称等于 RoutingKey】的队列中。
		queue.Name, // 2. RoutingKey (字符串): 路由键。
		//    - 在这里我们直接传入了上面创建的队列名 "simple"。
		//    - 配合上面的空交换机，这条消息会被百分之百精准投递到名为 "simple" 的队列中。
		false, // 3. Mandatory (布尔值): 强制性标志。
		//    - true: 如果这条消息根据路由键找不到任何匹配的队列，MQ 会把消息退回给生产者。你需要写代码监听退回。
		//    - false: 如果找不到队列，MQ 会直接把这条消息默默丢弃，不报错。
		false, // 4. Immediate (布尔值): 立即投递标志（注意：RabbitMQ 3.0 之后已经不再支持该参数，传 false 即可）。
		//    - 原本含义：如果队列上没有活跃的消费者，立刻把消息退回给生产者。

		// 5. Publishing (amqp.Publishing 结构体): 消息体及其属性的打包配置。
		amqp.Publishing{
			// DeliveryMode 控制消息的磁盘持久化，它有两个可选值：
			// amqp.Transient (数值 1): 消息只在内存。MQ 重启消息丢失。
			// amqp.Persistent (数值 2): 消息写入磁盘。配合前面队列的 Durable = true，才能做到 MQ 重启消息不丢失。
			// 提示：虽然你这里没写，但如果生产环境要求消息不丢，建议补上：DeliveryMode: amqp.Persistent

			ContentType: "text/plain",           // 告诉消费者消息的格式（虽然这里不写也能发，但规范写法会加上，比如 "application/json"）
			Body:        []byte("hello world!"), // 消息的真实载荷（Payload）。RabbitMQ 不关心内容，全部以字节流（Byte Array）传输。
		},
	)

	if err != nil {
		log.Fatal("Failed to publish:", err)
	} else {
		log.Println("Successfully published a message")
	}
}

```



## 二、消费者代码

```go
package main

import (
	"log"

	"github.com/streadway/amqp"
)

func main() {
	// ==========================================
	// 0. 配置连接参数
	// ==========================================
	username := "guest"
	password := "guest"
	addr := "localhost:5672/"
	dialUrl := "amqp://" + username + ":" + password + "@" + addr

	// ==========================================
	// 1. 与 RabbitMQ 服务端建立底层的 TCP 连接
	// ==========================================
	conn, err := amqp.Dial(dialUrl)
	if err != nil {
		log.Fatal("Failed to connect to RabbitMQ:", err)
	}
	// 优雅释放资源：当消费者主进程因异常或主动退出时，确保底层的 TCP 连接能被安全关闭
	defer conn.Close()

	// ==========================================
	// 2. 在 TCP 连接之上创建一个“信道”（Channel）
	// ==========================================
	ch, err := conn.Channel()
	if err != nil {
		log.Fatal("Failed to open a channel:", err)
	}
	// 优雅释放资源：关闭通道会释放服务器端针对当前消费行为所分配的缓冲区和内存
	defer ch.Close()

	// ==========================================
	// 3. 声明队列（幂等性操作）
	// ==========================================
	// 疑问：为什么消费者也要写声明队列的代码？
	// 答案：因为在分布式系统中，你无法保证生产者和消费者谁先启动。
	// 如果消费者先启动，而此时队列还没创建，消费者去监听就会直接报错崩溃。
	// 重新声明同一个队列（参数必须完全一致）是无害且安全的，这被称为“幂等性”。
	queue, err := ch.QueueDeclare(
		"simple", // 队列名称（必须和生产者发送的队列名一致）
		true,     // 持久性（必须和生产者声明的参数一致，否则报错）
		false,    // 自动删除
		false,    // 排他性
		false,    // 非阻塞
		nil,      // 其他参数
	)
	if err != nil {
		log.Fatal("Failed to declare a queue:", err)
	}

	// ==========================================
	// 4. 注册消费者，开始监听并消费消息
	// ==========================================
	// ch.Consume 会在后台启动一个监听，它返回一个 Go 的只读 Channel (<-chan amqp.Delivery)。
	// 只要队列里有新消息，RabbitMQ 就会把消息推送过来，自动放入这个 Go Channel 中。
	consumer, err := ch.Consume(
		queue.Name, // 1. Queue (字符串): 绑定监听的队列名称。
		"",         // 2. Consumer (字符串): 消费者标签（标识）。
		//    - 传空字符串 "" 代表让 RabbitMQ 自动生成一个唯一的消费者标识（如 amq.ctag-xxxx）。
		//    - 如果你想手动管理消费者的取消（Cancel），可以自己定义这个名字。
		false, // 3. AutoAck (布尔值): 是否开启自动确认（非常关键！）。
		//    - true (自动): 只要 RabbitMQ 把消息发出去了，不管你的代码有没有成功处理，MQ 都会立刻把消息从磁盘/内存中删掉。
		//      *风险*：如果你拿到消息还没处理，服务突然崩溃或重启，这条消息就彻底丢失了。
		//    - false (手动): MQ 发送消息后不会删除，而是将消息标记为 "Unacked"（未确认）。
		//      必须等你显式调用 `msg.Ack(false)`，告知 MQ "我处理完了"，MQ 才会安全地删除消息。安全度极高。
		false, // 4. Exclusive (布尔值): 是否排他消费。
		//    - true: 独占该队列。不允许其他任何消费者再连接此队列。
		//    - false: 共享消费（默认）。多个消费者可以共同监听这个队列，RabbitMQ 会采用“轮询（Round-robin）”的方式把消息均匀分发。
		false, // 5. NoLocal (布尔值):
		//    - true: 不能将同一个 Connection 中发送的消息再传递给这个 Connection 中的消费者（用于避免自我循环消费）。
		//    - false: 允许。注：RabbitMQ 实际上并没有完全实现这个协议标准，直接传 false 即可。
		false, // 6. NoWait (布尔值): 是否非阻塞。
		//    - true: 注册消费后不等待服务器确认注册成功，直接往下走。
		//    - false: 阻塞等待。确保 RabbitMQ 成功将我们注册为该队列的消费者后，代码才往下执行。
		nil, // 7. Arguments (amqp.Table): 额外属性配置。可以用来做一些消费端的高级限流等配置。
	)
	if err != nil {
		log.Fatal("Failed to register a consumer:", err)
	}

	// ==========================================
	// 5. 循环从 Go Channel 中读取并处理消息
	// ==========================================
	// 这里的 `range` 循环会阻塞主 Goroutine。
	// 当队列中没有消息时，程序会在这里挂起等待；一旦有消息推送过来，就会进入循环体处理。
	for msg := range consumer {
		// msg 结构体中包含了大量的元数据，比如交换机名称、路由键、消息 ID、消息属性等。
		// msg.Body 则是生产者发送的 byte 切片（即 "hello world"）
		log.Printf("Received a message: %s", msg.Body)

		// 手动确认消息已安全消费
		// 因为上面我们在第 4 步中将 AutoAck 设为了 false，所以这里必须手动调用 Ack。
		// Ack 方法的参数 multiple (布尔值):
		// - false: 仅确认当前这一条消息。是最常用、最保险的写法。
		// - true: 批量确认。确认当前这条消息以及之前所有收到的、还未 Ack 的消息（适合追求吞吐量的场景）。
		err := msg.Ack(false)
		if err != nil {
			log.Printf("Failed to Ack message: %v", err)
		}
	}
}

```



