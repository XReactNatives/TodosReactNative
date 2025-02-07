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

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({
                                                                           children,
                                                                       }) => {
    return (
        <ThemeContext.Provider value={defaultTheme}>
            {children}
        </ThemeContext.Provider>
    );
};

export const useTheme = () => useContext(ThemeContext);
export const ThemeConsumer = ThemeContext.Consumer;