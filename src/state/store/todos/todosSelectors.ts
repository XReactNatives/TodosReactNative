//Tips：Selectors
//定义：
//1.用于从Redux store中提取数据的函数。它们提供了一种从Redux状态中获取数据的抽象层，通常用于提高代码的可读性和可维护性。
//2.可以是简单的函数，也可以是使用reselect库创建的memoized selectors。
//职责：
//1.抽象数据访问：Selectors将数据访问逻辑从组件中分离，使组件只需关注数据的展示，而不需关心数据的获取方式。
//2.提高可读性：通过使用描述性的函数名，Selectors使代码更具可读性。
//3.复用性：Selectors可以在多个组件中复用，避免重复代码。
//4.性能优化：使用reselect库创建的memoized selectors可以缓存计算结果，避免不必要的重新计算，提高性能。
//优势：
//1.简化组件代码：组件不需要直接访问Redux状态的结构，只需调用Selectors。
//2.易于测试：Selectors是纯函数，易于单独测试。
//3.隔离状态结构变化：如果Redux状态结构发生变化，只需更新Selectors，而不需要更新所有使用该状态的组件。
//4.提高性能：通过memoization，Selectors可以避免不必要的计算，尤其是在状态变化频繁的情况下。
import { createSelector } from 'reselect';
import type { RootState } from '../rootReducer.ts';

// 基本选择器：获取todos状态
const selectTodosState = (state: RootState) => state.todos;

// 选择器：获取todos列表
export const selectSections = createSelector(
    [selectTodosState],
    (todosState) => todosState.sections
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

// 新增选择器：根据过滤器获取sections
export const selectFilteredSections = (state: RootState, filter: string) => {
    const sections = selectSections(state);
    switch (filter) {
        case 'Done':
            return sections.map(section => ({
                ...section,
                data: section.data.filter(todo => todo.completed),
            }));
        case 'UnDone':
            return sections.map(section => ({
                ...section,
                data: section.data.filter(todo => !todo.completed),
            }));
        default:
            return sections;
    }
};
