// `App.tsx`
import React from "react";
import {NavigationContainer} from "@react-navigation/native";
import {createNativeStackNavigator} from "@react-navigation/native-stack";
import {Provider} from "react-redux";
import store from "./store"; // 导入存储
import TodoList from "./presentation/todos/TodoListContainer.tsx";
import AddTodoContainer from "./presentation/todos/AddTodoContainer.tsx";
import {RouteConfig} from "./config/routeConfig";
import {CounterContainer} from "./presentation/counter/CounterContainer.tsx";
import {makeServer} from "./mirage/mirageServer"; // 导入 makeServer

// 初始化 Mirage JS 服务器
if (process.env.NODE_ENV === "development") {
  makeServer();
}

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <Provider store={store}>
      <NavigationContainer>
        <Stack.Navigator initialRouteName={RouteConfig.COUNTER}>
          <Stack.Screen
            name={RouteConfig.TODO_LIST}
            component={TodoList}
            options={{headerShown: false}}
          />
          <Stack.Screen
            name={RouteConfig.ADD_TODO}
            component={AddTodoContainer}
            options={{headerShown: false}}
          />
          <Stack.Screen
            name={RouteConfig.COUNTER}
            component={CounterContainer}
            options={{headerShown: false}}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </Provider>
  );
}
