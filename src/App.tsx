// `App.tsx`
import React from "react";
import {NavigationContainer} from "@react-navigation/native";
import {createNativeStackNavigator} from "@react-navigation/native-stack";
import {Provider} from "react-redux";
import store from "./store"; // 导入存储


import TodoListContainer from "./presentation/features/todos/containers/TodoListContainer";
import AddTodoContainer from "./presentation/features/todos/containers/AddTodoContainer";
import TodoDetailContainer from "./presentation/features/todos/containers/TodoDetailContainer";
import { RouteConfig } from "./configs/routeConfig";
import type { RootStackParamList } from "./type/navigation";
import { CounterContainer } from "./presentation/features/counter/CounterContainer.tsx";
import { makeServer } from "./mirage/mirageServer";

makeServer();

const Stack = createNativeStackNavigator<RootStackParamList>();

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
            component={TodoListContainer}
            options={{headerShown: false}}
          />
          <Stack.Screen
            name={RouteConfig.ADD_TODO}
            component={AddTodoContainer}
            options={{headerShown: false}}
          />
          <Stack.Screen
            name={RouteConfig.TODO_DETAIL}
            component={TodoDetailContainer}
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
