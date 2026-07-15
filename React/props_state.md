# props与state组件通信

## 一、基本用法

定义组件：src/components/HelloWorld/index.tsx

```tsx
import {useState} from "react";

interface HelloWorldProps {
    title: string;
    age: number;
    render?: (count:number)=>React.ReactNode;
}

export const HelloWorld = (props: HelloWorldProps) => {
    const {title, age, render} = props;
    const [count, setCount] = useState(0)
    return (
        <div>
            <div onClick={() => setCount(count + 1)}>
                count:{count}
            </div>
            <p>Hello</p>
            <p>title:{title}</p>
            <p>{age}</p>
            {render?.(count)}
        </div>
    )
}
```

App.tsx

```tsx
import './App.css'
import {HelloWorld} from "./components/HelloWorld";

function App() {
    return (
        <>
            <HelloWorld title='ok' age={12} render={(count) => <div style={{color: 'red'}}>哈哈 {count}</div>}/>
            <HelloWorld title='ok' age={12} render={() => <div style={{color: 'red'}}>哈哈</div>}/>
        </>
    )
}

export default App

```

---

---



## 二、案例代码

**💡 经典案例：“父子温度计”**

这里有一个非常直观的小案例。

- **父组件 (`Parent`)**：掌控全局的温度数据 (`temperature`)。
- **子组件 A (`TemperatureDisplay`)**：负责单纯的展示。父组件把温度数据通过 Props 传给它。
- **子组件 B (`TemperatureController`)**：负责修改温度。父组件把一个**修改温度的函数**通过 Props 传给它，点击按钮时触发修改。

代码：

子组件A： src/components/Temperature/TemperatureDisplay.tsx

```tsx
interface TemperatureDisplayProps {
    temp: number;
}

// 1. 子组件：负责显示温度 (纯展示)
export const TemperatureDisplay = (props: TemperatureDisplayProps) => {
    const {temp} = props;
    return (
        <div style={{border: '1px solid #ddd', padding: '10px', margin: '10px'}}>
            <h3>子组件 A：温度展示板</h3>
            <p>当前温度：<strong>{temp}°C</strong></p>
        </div>
    )
}
```



子组件B：src/components/Temperature/TemperatureController.tsx

```tsx
interface TemperatureControllerProps {
    temp: number;
    onTempChange: (temp: number) => void;
}

// 2. 子组件：负责控制温度 (触发父组件状态更新)
export const TemperatureController = (props: TemperatureControllerProps) => {
    const {temp, onTempChange} = props;
    return (
        <div style={{border: '1px solid #ddd', padding: '10px', margin: '10px'}}>
            <h3>子组件 B：温度调节器</h3>
            <button onClick={() => onTempChange(temp + 1)}>升温</button>
            <button style={{ marginLeft: '10px' }} onClick={() => onTempChange(temp - 1)}>降温</button>
        </div>
    )
}
```



App.tsx

```tsx
import './App.css'
import {TemperatureDisplay} from "./components/Temperature/TemperatureDisplay.tsx";
import {TemperatureController} from "./components/Temperature/TemperatureController.tsx";
import {useState} from "react";

function App() {
    const [temperature,setTemperature] = useState(20);
    return (
        <>
            <h2>父组件 (温度中心)</h2>
            <p>父组件自身的 State 值: {temperature}°C</p>

            <TemperatureDisplay temp={temperature} />
            <TemperatureController temp={temperature} onTempChange={(newTemp) => setTemperature(newTemp)} />
        </>
    )
}

export default App

```





