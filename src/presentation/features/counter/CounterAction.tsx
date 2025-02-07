import React from "react";
import { Button, View } from "react-native";
import { useDispatch } from "react-redux";

import {
    increment,
    decrement,
    incrementByAmount,
} from "../../../state/store/counter/counterSlice.ts";

const CounterAction: React.FC = () => {
    const dispatch = useDispatch();

    const handleIncrementByAmount = () => {
        dispatch(incrementByAmount(5));
    };

    return (
        <View>
            <Button title={"Increment"} onPress={() => dispatch(increment())} />
            <Button title={"Decrement"} onPress={() => dispatch(decrement())} />
            <Button
                title={"Increment by 5"}
                onPress={handleIncrementByAmount}
            />
        </View>
    );
};

export default CounterAction;
