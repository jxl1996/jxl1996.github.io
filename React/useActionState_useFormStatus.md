# useActionState和useFormStatus

## 一、老的表单提交写法

```tsx
import { useState} from "react";

export const OldForm = () => {
    // 自己来管理状态
    const [formData, setFormData] = useState({
        username: "",
        password: "",
    })


    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        console.log(formData)
    }

    return (
        <form onSubmit={handleSubmit}>
            <label>
                用户名：
                <input type="text" name="username"
                       onChange={(e) => setFormData({...formData, username: e.target.value})}/>
            </label>
            <label>
                密码：
                <input type="password" name="password"
                       onChange={(e) => setFormData({...formData, password: e.target.value})}/>
            </label>

            <button type="submit">提交</button>
        </form>
    )
}
```

## 二、新特性写法

```tsx
import {useActionState} from "react";
import {useFormStatus} from "react-dom";

interface FormState {
    success: boolean;
    msg: string;
}
// 2. 提供一个安全的初始状态，避免后续 state 出现 null 的空指针麻烦
const initialState: FormState = {
    success: false,
    msg: "",
};


function delay(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

// 在 TypeScript 中，通用的规范是：如果一个参数必须写、但又用不到，可以在参数名前面加一个下划线 _。 这样 TypeScript 的规范检查器就会自动忽略它，不再报错。
const handleAction = async (_prevState: FormState , formData: FormData): Promise<FormState> => {
    console.log(...formData.keys());
    console.log(...formData.values());
    await delay(1000)
    return {
        success: true,
        msg: "提交成功",
    };
}

const SubmitButton = () => {
    const {pending, data, method} = useFormStatus();
    console.log('SubmitButton pending:', pending)
    console.log('SubmitButton data:', data)
    console.log('SubmitButton method:', method)
    return (
        <button type="submit">{pending ? '正在提交中...' : '点击提交'}</button>
    )
}

export const NewForm = () => {
    // useActionState 返回的是一个数组
    const [state, submitAction, isPending] = useActionState(handleAction, initialState);

    console.log('state', state)
    console.log('isPending', isPending)
    return (
        <form action={submitAction}>
            <label>
                用户名：
                <input type="text" name="username"/>
            </label>
            <label>
                密码：
                <input type="password" name="password"/>
            </label>

            {/*<button type="submit">{isPending ? '提交中...' : '提交'}</button>*/}

            {/*深层状态， 使用context而不是props传值*/}
            <SubmitButton/>
        </form>
    )
}
```

