// `App.tsx`
import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {Provider} from "react-redux";
import store from './store'; // 导入存储
import TodoList from "./screens/todolist/TodoListScreen";
import AddTodoScreen from "./screens/addtodo/AddTodoScreen";
import {RouteConfig} from "./config/routeConfig";
import {CounterScreen} from "./screens/counter/CounterScreen";

const Stack = createNativeStackNavigator();

export default function App() {
    return (
        <Provider store={store}>
            <NavigationContainer>
                <Stack.Navigator initialRouteName={RouteConfig.COUNTER}>
                    <Stack.Screen name={RouteConfig.TODO_LIST} component={TodoList}/>
                    <Stack.Screen name={RouteConfig.ADD_TODO} component={AddTodoScreen}/>
                    <Stack.Screen name={RouteConfig.COUNTER} component={CounterScreen}/>
                </Stack.Navigator>
            </NavigationContainer>
        </Provider>
    );
}