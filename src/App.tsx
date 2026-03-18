// `App.tsx`
import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {Provider} from 'react-redux';
import store from './store';
import TodoListContainer from './presentation/features/todos/containers/TodoListContainer';
import {RouteConfig} from './configs/routeConfig';
import type {RootStackParamList} from './type/navigation';
import {lazyScreen} from './presentation/components/LazyScreen';

const LazyAddTodo = lazyScreen(
  () => import('./presentation/features/todos/containers/AddTodoContainer'),
);

const LazyTodoDetail = lazyScreen(
  () => import('./presentation/features/todos/containers/TodoDetailContainer'),
);

const LazyCounter = lazyScreen(() =>
  import('./presentation/features/counter/CounterContainer').then(m => ({
    default: m.CounterContainer,
  })),
);

const Stack = createNativeStackNavigator<RootStackParamList>();

let mirageStarted = false;
function ensureMirageServer() {
  if (!mirageStarted) {
    const {makeServer} = require('./mirage/mirageServer') as {
      makeServer: (opts?: {environment?: string}) => ReturnType<
        typeof import('./mirage/mirageServer').makeServer
      >;
    };
    makeServer();
    mirageStarted = true;
  }
}

export default function App() {
  // Sync before children mount so TodoListContainer's useEffect fetch sees Mirage.
  ensureMirageServer();

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
            component={LazyAddTodo}
            options={{headerShown: false}}
          />
          <Stack.Screen
            name={RouteConfig.TODO_DETAIL}
            component={LazyTodoDetail}
            options={{headerShown: false}}
          />
          <Stack.Screen
            name={RouteConfig.COUNTER}
            component={LazyCounter}
            options={{headerShown: false}}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </Provider>
  );
}
