# useState状态管理

## 一、简单实现

```tsx
import {useState} from "react";

export const BasicState = () => {
    const [user, setUser] = useState({
        name: '狗娃',
        age: 18
    })

    const handleAdd = () => {
        // 错误的写法
        // user.age++
        // setUser(user)

        // 正确的写法 (新对象)
        // setUser({
        //     ...user,
        //     age: user.age + 1
        // })



        // 推荐的写法
        setUser((prevUser) => ({
            ...prevUser,
            age: prevUser.age + 3
        }))
    }
    return (
        <>
            <div>姓名：{user.name}</div>
            <div>年龄：{user.age}</div>
            <button onClick={handleAdd}>年龄增加</button>
        </>
    )
}
```

