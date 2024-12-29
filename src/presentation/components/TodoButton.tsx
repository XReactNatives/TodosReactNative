//公共按钮组件
//Tip：可复用的UI组件，放在components文件夹中
import React, { Component } from "react";
import { TouchableOpacity, Text } from "react-native";

import { styles as commonStyles } from "../../styles/styles.ts";
import { ThemeConsumer } from "../../context/ThemeProvider.tsx";

/**
 * Tip：推荐始终使用接口或类型别名来定义 Props，而不再依赖 PropTypes。
 * <br>1.提供编译错误信息，避免应用启动后才发现问题。
 * <br>2.提供更好的自动补全、类型推断和错误高亮。
 * <br>3.类型检查在编译时完成，无运行时检查开销。
 */
interface TodoButtonProps {
    title: string;
    onPress: () => void;
    style?: object;
}

/**
 * Tip：建议组件注释样例：
 * <br>Todos应用中公共按钮，封装了通用的标题样式样式和背景颜色，提供自定义按钮文案和点击事件的能力
 * <br>@prop {string} title - 按钮文案
 * <br>@prop {() => void} onPress - 按钮点击事件
 */
class TodoButton extends Component<TodoButtonProps> {
    render() {
        const { title, onPress, style } = this.props;

        return (
            <ThemeConsumer>
                {({ buttonBackgroundColor }) => (
                    <TouchableOpacity
                        style={[
                            { backgroundColor: buttonBackgroundColor },
                            commonStyles.buttonBackground,
                            style,
                        ]}
                        onPress={onPress}
                    >
                        <Text style={commonStyles.buttonText}>{title}</Text>
                    </TouchableOpacity>
                )}
            </ThemeConsumer>
        );
    }
}

export default TodoButton;