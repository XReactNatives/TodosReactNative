//Tips：
import { createSelector } from 'reselect';
import type { RootState } from '../rootReducer';

// 基本选择器：获取todos状态
const selectTodosState = (state: RootState) => state.todos;

// 选择器：获取todos列表
export const selectTodos = createSelector(
    [selectTodosState],
    (todosState) => todosState.todos
);

// 选择器：获取加载状态
export const selectLoading = createSelector(
    [selectTodosState],
    (todosState) => todosState.loading
);

// 选择器：获取错误信息
export const selectError = createSelector(
    [selectTodosState],
    (todosState) => todosState.error
); 