# useEffect副作用

## 一、基本用法

src/components/Hooks/index.tsx

```tsx
import {useEffect, useState} from "react";

export const Hooks = () => {
    const [count, setCount] = useState(0);

    const handleAdd = () => {
        setCount((prev) => prev + 10);
    }

    useEffect(()=>{
        console.log("执行了...",count)
        document.title = `当前计数 ${count}`
    },[count])


    useEffect(()=>{
        console.log('组件挂载完成') // 类比于类组件的onComponentDidMount

        return ()=>{
            console.log('组件卸载完成')
        }
    },[])

    useEffect(() => {
        console.log('组件更新完成') // 类比于类组件的onComponentDidUpdate
    });

    return (
        <div>
            <div>当前：{count}</div>
            <button onClick={handleAdd}>增加</button>
        </div>
    )
}
```

App.tsx

```tsx

import {Hooks} from "./components/Hooks";
import {useState} from "react";

function App() {
    const [isShow,setIsShow]=useState(true);

    const handleClick = () => {
        setIsShow(!isShow);
    }

    return (
        <div>
            {isShow && <Hooks/>}
            <button onClick={handleClick}>显示或隐藏</button>
        </div>
    )
}

export default App

```

