import React, { createContext, useContext } from "react";

//Tip：简单全局状态，保存Todo应全局主题信息，如：按钮背景颜色，标题字体颜色
interface Theme {
    buttonBackgroundColor: string;
    titleColor: string;
}

const defaultTheme: Theme = {
    buttonBackgroundColor: "#ff0000",
    titleColor: "#ff0000",
};

const ThemeContext = createContext<Theme>(defaultTheme);

// Tips：ThemeProvider 优化
// 定义：ThemeProvider 是主题上下文提供者，负责将主题信息注入到组件树中。
// 职责：
// 1. 提供主题上下文，让子组件可以访问主题信息
// 2. 管理主题状态，支持主题切换（如果需要）
// 3. 确保主题信息在整个应用中保持一致
// 优势：
// • 避免不必要的重新渲染，提高性能
// • 当主题信息没有变化时，不会触发子组件重新渲染
// • 保持主题上下文的稳定性
// • 便于调试和维护

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = React.memo(({
    children,
}) => {
    
    return (
        <ThemeContext.Provider value={defaultTheme}>
            {children}
        </ThemeContext.Provider>
    );
});

export const useTheme = () => useContext(ThemeContext);
export const ThemeConsumer = ThemeContext.Consumer;