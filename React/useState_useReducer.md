# useState和useReducer

## 一、useState基本用法

```tsx
import {useState} from "react";

export const Demo1 = () => {
    // 1. 基础用法
    // 2. 就近取值
    // 3. 函数式初始化数据
    const [count, setCount] = useState(() => 100)

    return (
        <div>
            <p>count:{count}</p>
            <button onClick={() => setCount((prevCount) => prevCount + 1)}>+</button>
            <button onClick={() => setCount((prevCount) => prevCount - 1)}>-</button>
        </div>
    )
}
```



## 二、useReducer用法

useReducer 用来管理更复杂的state

::: code-group

```tsx[不使用useReducer写法]
import {useState} from "react";

export const Demo2 = () => {
    const [info, setInfo] = useState({
        name: 'lily',
        age: 20
    })
    return (
        <div>
            <h2>Demo2</h2>
            <p>姓名：{info.name}</p>
            <p>年龄：{info.age}</p>

            <input type="text" value={info.name}
                   onChange={ev => setInfo(prevInfo => ({...prevInfo, name: ev.target.value}))}/>

            <input type="text" value={info.age}
                   onChange={ev => setInfo(prevInfo => ({...prevInfo, age: Number(ev.target.value)}))}/>
        </div>
    )
}
```



```tsx[使用useReducer写法]
import {useReducer} from "react";

const initialState = {
    name: 'lily',
    age: 20
}

const reducer = (
    state: typeof initialState,
    action: { type: string, payload: string }
) => {
    switch (action.type) {
        case 'SET_NAME':
            return {
                ...state,
                name: action.payload,
            }
        case 'SET_AGE':
            return {
                ...state,
                age: Number(action.payload)
            }
        default:
            return state;
    }
}

export const Demo3 = () => {
    const [info, dispatch] = useReducer(reducer, initialState)
    return (
        <div>
            <h2>Demo3</h2>
            <p>姓名：{info.name}</p>
            <p>年龄：{info.age}</p>

            <input type="text" value={info.name}
                   onChange={ev => dispatch({type: 'SET_NAME', payload: ev.target.value})}/>

            <input type="text" value={info.age}
                   onChange={ev => dispatch({type: 'SET_AGE', payload: ev.target.value})}/>
        </div>
    )
}
```
:::