# useMemo和useCallback

## 一、基本用法

```tsx
import {useCallback, useMemo, useState} from "react";

export const MemoDemo = () => {
    const [count, setCount] = useState(0);

    const doubleInfo = useMemo(() => ({
        info: count * 2
    }), [count]);

    const handleAdd = useCallback(()=>{
        setCount(count + 1)
    },[count]);

    return (
        <div>
            <div>count:{count}</div>
            <div>double:{doubleInfo.info}</div>
            <button onClick={handleAdd}>+</button>
        </div>
    )

}
```