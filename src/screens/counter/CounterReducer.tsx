import React, { useReducer } from "react";
import { View, Text, Button } from "react-native";

import { styles as commonStyles } from "../../styles/styles.ts";

const initialState = { count: 0 };

//Tips：复杂的局部状态管理-useReducer实现，Todo应用全局状态todos，使用react-redux全局保存
const reducer = (state: typeof initialState, action: { type: string }) => {
    switch (action.type) {
        case "increment":
            return { count: state.count + 1 };
        case "decrement":
            return { count: state.count - 1 };
        case "reset":
            return initialState;
        default:
            throw new Error();
    }
};

const CounterReducer: React.FC = () => {
    const [state, dispatch] = useReducer(reducer, initialState);

    return (
        <View>
            <Text style={commonStyles.title}>
                useReduce Count: {state.count}
            </Text>
            <Button
                title="Increment"
                onPress={() => dispatch({ type: "increment" })}
            />
            <Button
                title="Decrement"
                onPress={() => dispatch({ type: "decrement" })}
            />
            <Button title="Reset" onPress={() => dispatch({ type: "reset" })} />
        </View>
    );
};

export default CounterReducer;