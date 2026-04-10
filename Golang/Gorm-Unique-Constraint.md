## GORM唯一约束表的插入修改

### 案例1. 不存在才添加

需求：不存在就添加，存在就不做任何处理

::: code-group

```go [main.go]
/*
案例1： 不存在就添加，存在就不做任何处理
*/
func demo01() {
	// ----------写法1--------------
	userbags1 := models.UserBags{
		UserId: 120,
		BagId:  999,
		Stock:  10,
	}
	// .Session(&gorm.Session{Logger: db().Logger.LogMode(logger.Silent)}) : 用于屏蔽警告日志
	if err := db().Session(&gorm.Session{Logger: db().Logger.LogMode(logger.Silent)}).Create(&userbags1).Error; err != nil {
		if check.IsUniqueIndexConflict(err) {
			fmt.Println("userbags1 插入失败，数据已存在")
		} else {
			fmt.Println("userbags1 插入失败", err)
		}
	} else {
		fmt.Println("userbags1 插入成功")
	}

	// ----------写法2--------------
	userbags2 := models.UserBags{
		UserId: 131,
		BagId:  100,
		Stock:  5,
	}
	createRes := db().Clauses(clause.OnConflict{
		Columns:   []clause.Column{{Name: "user_id"}, {Name: "bag_id"}},
		DoNothing: true,
	}).Create(&userbags2)
	if createRes.Error != nil {
		fmt.Println("userbags2 插入失败，真正的数据库错误:", createRes.Error)
	} else {
		if createRes.RowsAffected == 0 {
			fmt.Println("userbags2 插入失败, 数据已存在")
		} else {
			fmt.Println("userbags2 插入成功")
		}
	}
}
```

```go [check.go]
package check

import (
	"errors"
	"github.com/go-sql-driver/mysql"
	"github.com/jackc/pgx/v5/pgconn"
	"gorm.io/gorm"
)

// IsUniqueIndexConflict 判断err是否为数据库唯一约束的err
func IsUniqueIndexConflict(err error) bool {
	if err == nil {
		return false
	}

	// 1. GORM 通用判断（覆盖了大部分现代驱动）
	if errors.Is(err, gorm.ErrDuplicatedKey) {
		return true
	}

	// 2. 针对特定驱动进行深度检查 (使用 errors.As 处理被包装的错误)

	// PostgreSQL 判断
	var pgErr *pgconn.PgError
	if errors.As(err, &pgErr) {
		return pgErr.Code == "23505"
	}

	// MySQL 判断
	var mysqlErr *mysql.MySQLError
	if errors.As(err, &mysqlErr) {
		return mysqlErr.Number == 1062
	}

	return false
}

```

:::



### 案例2. 冲突时更新

需求： 不存在就设置库存为5， 存在就库存+5

```go
/*
案例2 ： 不存在就设置库存为5， 存在就库存+5
*/
func demo02() {
	userbags := models.UserBags{
		UserId: 134,
		BagId:  100,
		Stock:  5, // 这是不存在时的初始值
	}

	err := db().Clauses(clause.OnConflict{
		// 1. 指定冲突的约束列（通常是你的唯一索引字段）
		Columns: []clause.Column{{Name: "user_id"}, {Name: "bag_id"}},

		// 2. 如果冲突了，执行更新操作
		DoUpdates: clause.Assignments(map[string]interface{}{
			// mysql写法
			// "stock": gorm.Expr("stock + ?", 5),

			// postgres写法
			"stock": gorm.Expr("user_bags.stock + EXCLUDED.stock"),
		}),
	}).Create(&userbags).Error

	if err != nil {
		fmt.Println("操作失败:", err)
	} else {
		fmt.Println("操作成功（已新增或已累加库存）")
	}
}
```

