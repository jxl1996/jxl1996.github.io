# 自定义hooks

## 一、基础用法

::: code-group

```ts[useLocalStorageState.ts]
import {type Dispatch, type SetStateAction, useEffect, useState} from "react";

export const useLocalStorageState = <T>(key: string, defaultValue: T): [T, Dispatch<SetStateAction<T>>] => {

    const [state, setState] = useState<T>(() => {
        try {
            const storedState = localStorage.getItem(key);
            return storedState ? JSON.parse(storedState) : defaultValue;
        } catch (error) {
            console.error(`Error parsing localStorage key "${key}":`, error);
            return defaultValue;
        }
    });

    useEffect(() => {
        localStorage.setItem(key, JSON.stringify(state));
    }, [key, state])

    return [state, setState];
}


```

```tsx[index.tsx]
import {useLocalStorageState} from "./useLocalStorageState.ts";

export const CustomHooksDemo = ()=>{

    const [count, setCount] = useLocalStorageState<number>("count",0);

    const addCount = ()=>{
        setCount(prev => prev + 1);
    }
    const subCount = () => {
        setCount(prev => prev - 1);
    }
    return (
        <div>
            <h2>当前：{count}</h2>
            <button onClick={addCount}>+</button>
            <button onClick={subCount}>-</button>
        </div>
    )
}
```

:::