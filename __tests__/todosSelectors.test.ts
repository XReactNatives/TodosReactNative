import {
  selectFilteredSections,
  selectFilterCount,
} from '../src/state/store/todos/todosSelectors';
import type {RootState} from '../src/state/store/rootReducer';

// 纯函数测试：状态层 selector 的过滤/计数逻辑（CI 靶子，无网络依赖）。
// 依据最佳实践：给关键逻辑（selector）写单测；selector 是纯函数，易测。
const makeState = (): RootState =>
  ({
    todos: {
      todosById: {
        1: {userId: 1, id: 1, title: 't1', completed: false, username: 'user1'},
        2: {userId: 1, id: 2, title: 't2', completed: true, username: 'user1'},
        3: {userId: 2, id: 3, title: 't3', completed: true, username: 'user2'},
      },
      ids: [1, 2, 3],
      usersById: {
        1: {id: 1, username: 'user1', email: 'u1@example.com'},
        2: {id: 2, username: 'user2', email: 'u2@example.com'},
      },
      sectionsExpanded: {},
      listLoading: false,
      listError: null,
      detailLoading: false,
      detailError: null,
    },
    counter: {value: 0},
  } as unknown as RootState);

describe('todosSelectors', () => {
  it('All 过滤器返回全部分组', () => {
    const state = makeState();
    const sections = selectFilteredSections(state, 'All');
    const total = sections.reduce((n, s) => n + s.data.length, 0);
    expect(total).toBe(3);
  });

  it('Done 过滤器只保留已完成项', () => {
    const state = makeState();
    const sections = selectFilteredSections(state, 'Done');
    const allDone = sections.every(s => s.data.every(t => t.completed));
    expect(allDone).toBe(true);
    expect(sections.reduce((n, s) => n + s.data.length, 0)).toBe(2);
  });

  it('UnDone 过滤器只保留未完成项', () => {
    const state = makeState();
    const sections = selectFilteredSections(state, 'UnDone');
    expect(sections.reduce((n, s) => n + s.data.length, 0)).toBe(1);
  });

  it('selectFilterCount 按过滤器计数', () => {
    const state = makeState();
    expect(selectFilterCount(state, 'All')).toBe(3);
    expect(selectFilterCount(state, 'Done')).toBe(2);
    expect(selectFilterCount(state, 'UnDone')).toBe(1);
  });
});
