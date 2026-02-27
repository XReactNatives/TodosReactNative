import { createSelector } from 'reselect';
import type { RootState } from '../rootReducer.ts';
import { FilterType, filterPredicate } from "../../../type/state/filter";
import type { TodoWithUsername } from "../../../type/state/todo";
import type { Section, TodoForUI } from "../../../type/ui";

//Tips：状态层-Selectors
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

// 基本选择器：获取todos状态
const selectTodosState = (state: RootState) => state.todos;

// 基础selectors：归一化数据
const selectTodosById = createSelector(
    [selectTodosState],
    (todosState) => todosState.todosById
);

const selectTodoIds = createSelector(
    [selectTodosState],
    (todosState) => todosState.ids
);

const selectUsersById = createSelector(
    [selectTodosState],
    (todosState) => todosState.usersById
);

const selectSectionsExpanded = createSelector(
    [selectTodosState],
    (todosState) => todosState.sectionsExpanded
);

// 辅助函数：生成section标题
const generateSectionTitle = (username: string, email: string): string => {
    return `${username} (${email})`;
};

// 选择器：从归一化数据计算sections
const selectSections = createSelector(
    [selectTodosById, selectTodoIds, selectUsersById, selectSectionsExpanded],
    (todosById, ids, usersById, sectionsExpanded): Section[] => {
        const grouped = ids.reduce((acc, id) => {
            const todo = todosById[id];
            if (!todo) return acc;
            
            const username = todo.username;
            if (!acc[username]) {
                acc[username] = [];
            }
            acc[username].push(todo);
            return acc;
        }, {} as Record<string, TodoWithUsername[]>);
        
        // 转换为Section结构
        return Object.keys(grouped).map(username => {
            const user = Object.values(usersById).find(u => u.username === username);
            const email = user?.email || 'unknown@example.com';
            const title = generateSectionTitle(username, email);
            
            return {
                title,
                data: grouped[username].map((todo): TodoForUI => ({
                    id: todo.id,
                    username: todo.username,
                    title: todo.title,
                    completed: todo.completed,
                })),
                expanded: sectionsExpanded[title] ?? true,
            };
        });
    }
);

// 选择器：获取列表加载状态
export const selectListLoading = createSelector(
    [selectTodosState],
    (todosState) => todosState.listLoading
);

// 选择器：获取列表错误信息
export const selectListError = createSelector(
    [selectTodosState],
    (todosState) => todosState.listError
);

// 选择器：根据过滤器获取sections
export const selectFilteredSections = createSelector(
  [selectSections, (state: RootState, filter: FilterType) => filter],
  (sections, filter) => {
    const pred = filterPredicate[filter];
    return sections
      .map(section => ({
        ...section,
        data: section.data.filter(todo => pred(todo.completed))
      }))
      .filter(section => section.data.length > 0 || filter === "All");
  }
);

export const selectFilterCount = createSelector(
    [selectTodosById, selectTodoIds, (state: RootState, filter: FilterType) => filter],
    (todosById, ids, filter) => {
        const pred = filterPredicate[filter];
        return ids.filter(id => {
            const todo = todosById[id];
            return todo && pred(todo.completed);
        }).length;
    }
);

// 选择器：获取Todo详情
export const selectTodoDetail = createSelector(
    [selectTodosById, (state: RootState, todoId: number) => todoId],
    (todosById, todoId) => todosById[todoId] || null
);

// 选择器：获取详情加载状态
export const selectDetailLoading = createSelector(
    [selectTodosState],
    (todosState) => todosState.detailLoading
);

// 选择器：获取详情错误信息
export const selectDetailError = createSelector(
    [selectTodosState],
    (todosState) => todosState.detailError
);
