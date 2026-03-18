/**
 * Todos 业务包入口：单包开发时由 index 引入；分包构建时单独打成 todos.bundle。
 */
import {makeServer} from '../mirage/mirageServer';
import store, {injectReducer} from '../store';
import todosReducer from '../state/store/todos/todosSlice';
import {registerTodosScreens} from '../host/featureRegistry';
import TodoListContainer from '../presentation/features/todos/containers/TodoListContainer';
import AddTodoContainer from '../presentation/features/todos/containers/AddTodoContainer';
import TodoDetailContainer from '../presentation/features/todos/containers/TodoDetailContainer';

makeServer();
injectReducer('todos', todosReducer);
registerTodosScreens({
  TodoList: TodoListContainer,
  AddTodo: AddTodoContainer,
  TodoDetail: TodoDetailContainer,
});

void store;
