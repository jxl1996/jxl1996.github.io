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





