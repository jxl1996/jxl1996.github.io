# 条件渲染与列表渲染

## 一、简单示例

```tsx
import {useState} from "react";

export const List = () => {
    const [myList, setMyList] = useState<number[]>([]);

    return (
        <div>
            {myList.map((item) => (
                item % 2 === 1 ? <div key={item}>{item}</div> : <div key={item}>偶数</div>
            ))}

            <button onClick={
                () => {
                    setMyList([...myList, myList.length])
                }
            }>追加
            </button>
        </div>

    )
}
```

