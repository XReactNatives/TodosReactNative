export type RootStackParamList = {
  CounterScreen: undefined;
  TodoListScreen: undefined;
  AddTodoScreen: undefined;
  TodoDetailScreen: { todoId: number };
};

declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList {}
  }
}
