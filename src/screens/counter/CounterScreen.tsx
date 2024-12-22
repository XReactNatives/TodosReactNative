import React, {Component} from "react";

import {View} from "react-native";

import CounterShow from "./CounterShow.tsx";
import CounterAction from "./CounterAction";
import {styles as commonStyles} from "../../styles/styles";
import CounterReducer from "./CounterReducer";

export class CounterScreen extends Component {
    render() {
        return (
            <View style={commonStyles.container}>
                <CounterShow/>
                <CounterAction/>
                <CounterReducer/>
            </View>
        );
    }
}