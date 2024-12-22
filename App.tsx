// `App.tsx`
import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {Provider} from "react-redux";
import store from './store'; // 导入存储
import AScreen from './AScreen'; // A 页面
import BScreen from './BScreen';// B 页面


const Stack = createNativeStackNavigator();

export default function App() {
    return (
        <Provider store={store}>
            <NavigationContainer>
                <Stack.Navigator initialRouteName="A">
                    <Stack.Screen name="A" component={AScreen}/>
                    <Stack.Screen name="B" component={BScreen}/>
                </Stack.Navigator>
            </NavigationContainer>
        </Provider>
    );
}