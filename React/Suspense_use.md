# Suspense和use

## 一、Suspense基本用法

::: code-group

```tsx[Demo.tsx]
import {lazy, Suspense} from "react";

const Child = lazy(() => import("./Child"));

export const Demo = () => {
    return (
        <div>
            <Suspense fallback={<div>loading...</div>}>
                <Child/>
            </Suspense>
        </div>
    )
}
```

```tsx[Child.tsx]
 const Child = () => {
    return <div>Child</div>;
}
 export default Child;
```
:::



## 二、use hook异步数据组件

```tsx
import {Suspense, use,} from "react";

// 模拟网络等待
const dealy = (ms: number) => {
    return new Promise(resolve => setTimeout(resolve, ms));
}

// 模拟网络请求
const fetchMessage = async () => {
    await dealy(2000)
    return "hell world"
}

const Message = ({messagePromise}: { messagePromise: Promise<string> }) => {
    const message = use(messagePromise)
    console.log(message)
    return <div>message : {message}</div>
}

export const SuspenseNew = () => {
    const messagePromise = fetchMessage()
    return (
        <div>
            <Suspense fallback={<div>加载中...</div>}>
                <Message messagePromise={messagePromise}/>
            </Suspense>
        </div>
    )
}
```