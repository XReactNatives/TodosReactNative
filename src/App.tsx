// `App.tsx`
import React from "react";
import {NavigationContainer} from "@react-navigation/native";
import {createNativeStackNavigator} from "@react-navigation/native-stack";
import {Provider} from "react-redux";
import store from "./store"; // 导入存储


import TodoList from "./presentation/features/todos/TodoListContainer.tsx";
import AddTodoContainer from "./presentation/features/todos/AddTodoContainer.tsx";
import {RouteConfig} from "./configs/routeConfig";
import {CounterContainer} from "./presentation/features/counter/CounterContainer.tsx";
import {makeServer} from "./mirage/mirageServer"; // 导入 makeServer

// 初始化 Mirage JS 服务器
if (process.env.NODE_ENV === "development") {
  makeServer();
}

const Stack = createNativeStackNavigator();

// Tips：展示层-Provider
// 定义：React-Redux 提供的顶层组件，用于把 Redux store 注入 React 组件树。
// 职责：
// 1. 将 store 放入 React Context，供子组件的 useSelector / useDispatch 读取。
// 2. 保证整个应用共享唯一状态源。
// 优势：
// • 无需手动传递 props，即可在任意深度组件访问全局状态；
// • 只渲染一次，性能开销可忽略。
export default function App() {
  return (
    <Provider store={store}>
      <NavigationContainer>
        <Stack.Navigator initialRouteName={RouteConfig.TODO_LIST}>
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
