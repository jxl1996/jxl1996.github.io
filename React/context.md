# 深层状态传递

## 一、原始写法

原始写法：一层一层手动传递

::: code-group

```tsx[Parent.tsx]
import {Child} from "./Child.tsx";
import {useState} from "react";

export const Parent = () => {
    const [theme ,setTheme] = useState("light")
    const changeTheme = () => {
        setTheme(prevTheme => prevTheme === "light" ? "dark" : "light");
    }
    return (
        <div>

            <button onClick={changeTheme} >切换主题</button>

            <h2>Parent组件 - {theme}</h2>
            <Child theme={theme} changeTheme={changeTheme}></Child>
        </div>
    )
}
```

```tsx[Child.tsx]
import {GrandChild} from "./GrandChild.tsx";

export const Child = ({theme,changeTheme}: { theme: string ,changeTheme:()=>void}) => {
    return (
        <div>
            <h3>Child组件 - {theme}</h3>
            <GrandChild theme={theme} changeTheme={changeTheme}></GrandChild>
        </div>
    )
}
```

```tsx[GrandChild.tsx]
export const GrandChild = ({theme,changeTheme}: { theme: string ,changeTheme:()=>void}) => {
    return (
        <div>
            <h4>GrandChild组件 - {theme}</h4>

            <button onClick={()=>changeTheme()}>切换主题</button>
        </div>
    )
}
```

:::

---



## 二、useContext写法







::: code-group

```tsx[ThemeContext.tsx]
import {createContext} from "react";

export const ThemeContext = createContext({
    theme:"light",
    toggleTheme: () => {}
})
```

```tsx[Parent.tsx]
import {Child} from "./Child.tsx";
import {useState} from "react";
import {ThemeContext} from "./ThemeContext.tsx";

export const Parent = () => {
    const [theme, setTheme] = useState("light")
    const toggleTheme = () => {
        setTheme(prevState => prevState === "dark" ? "light" : "dark");
    }
    return (
        <ThemeContext.Provider value={{theme: theme, toggleTheme: toggleTheme}}>
            <div>
                <button onClick={toggleTheme}>切换主题</button>
                <h2>Parent组件 - {theme}</h2>
                <Child></Child>
            </div>
        </ThemeContext.Provider>

    )
}
```

```tsx[Child.tsx]
import {GrandChild} from "./GrandChild.tsx";
import {useContext} from "react";
import {ThemeContext} from "./ThemeContext.tsx";

export const Child = () => {
    const {theme} = useContext(ThemeContext)

    return (
        <div>
            <h3>Child组件 - {theme}</h3>
            <GrandChild></GrandChild>
        </div>
    )
}
```

```tsx[GrandChild.tsx]
// import {useContext} from "react";
import {ThemeContext} from "./ThemeContext.tsx";

export const GrandChild = () => {
    // 写法1
    // const {theme,toggleTheme} = useContext(ThemeContext)
    // return (
    //     <div>
    //         <h4>GrandChild组件 - {theme}</h4>
    //         <button onClick={toggleTheme}>切换主题</button>
    //     </div>
    // )

    // 写法2
    return (
        <ThemeContext.Consumer>
            {({theme, toggleTheme}) => (
                <div>
                    <h4>GrandChild组件 - {theme}</h4>
                    <button onClick={toggleTheme}>切换主题</button>
                </div>
            )}
        </ThemeContext.Consumer>
    )
}
```

:::



## 