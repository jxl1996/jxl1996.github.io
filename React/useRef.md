# useRef用法

## 一、基本使用

```tsx
import {useEffect, useRef} from "react";

export const Demo = () => {
    // 用法1 获取DOM
    const inputRef = useRef<HTMLInputElement>(null)
    // 用法2 要缓存的值 这个值不是状态
    const isMounted = useRef<boolean>(false)

    useEffect(() => {
        console.log(inputRef.current)
        inputRef.current?.focus()
        isMounted.current = true
    }, []);

    return (
        <div>
            <input ref={inputRef} type="text"/>
        </div>
    )

}
```