import React, {Component} from "react";

import {View} from "react-native";

import CounterShow from "./CounterShow.tsx";
import CounterAction from "./CounterAction.tsx";
import {styles as commonStyles} from "../../../styles/styles.ts";
import CounterReducer from "./CounterReducer.tsx";

export class CounterContainer extends Component {
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
