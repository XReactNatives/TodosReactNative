import React from "react";
import { Text, View } from "react-native";
import { useSelector } from "react-redux";

import { selectCount } from "../../store/counter/counterSlice.ts";
import { RootState } from "../../store/rootReducer.ts";
import { styles as commonStyles } from "../../styles/styles.ts";

/**
 * Tip：建议多行注释样例
 * <br/>Tip：推荐使用函数式组件实现方式
 * <br/>1.更简洁的语法： 函数组件写起来更直观，代码量更少，更易于维护。
 * <br/>2.Hooks 的强大功能：结合 React Hooks 管理状态和副作用。
 * <br/>3.在无实例化开销、支持细粒度更新、更易通过 React.memo 等工具避免不必要的重渲染。
 */
const CounterShow: React.FC = () => {
    const count = useSelector((state: RootState) => selectCount(state));

    return (
        <View>
            <Text style={commonStyles.title}>{`Redux Count: ${count}`}</Text>
        </View>
    );
};

export default CounterShow;