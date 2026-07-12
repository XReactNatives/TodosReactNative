// 纯逻辑测试：领域层 UseCase 的业务规则（校验 + 分组 + 归一化）。
// service 层用 jest.mock 隔离，专测 domain 的纯逻辑（CI 靶子，无真实网络）。
jest.mock('../src/service/todosService', () => ({
  fetchTodosFromAPI: jest.fn(),
}));
jest.mock('../src/service/usersService', () => ({
  fetchUsersFromAPI: jest.fn(),
}));

import {getTodosAndUsersNormalized} from '../src/domain/todosUseCase';
import {fetchTodosFromAPI} from '../src/service/todosService';
import {fetchUsersFromAPI} from '../src/service/usersService';

const mockFetchTodos = fetchTodosFromAPI as jest.Mock;
const mockFetchUsers = fetchUsersFromAPI as jest.Mock;

const users = [
  {id: 1, username: 'user1', email: 'u1@example.com'},
  {id: 2, username: 'user2', email: 'u2@example.com'},
];

describe('getTodosAndUsersNormalized', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockFetchUsers.mockResolvedValue(users);
  });

  it('归一化 todos 并附带 username', async () => {
    mockFetchTodos.mockResolvedValue([
      {userId: 1, id: 1, title: 'a', completed: false},
      {userId: 2, id: 2, title: 'b', completed: true},
    ]);

    const result = await getTodosAndUsersNormalized();

    expect(result.ids).toEqual([1, 2]);
    expect(result.todos[1].username).toBe('user1');
    expect(result.todos[2].username).toBe('user2');
    expect(Object.keys(result.users)).toHaveLength(2);
  });

  it('业务规则：过滤空标题与无效用户', async () => {
    mockFetchTodos.mockResolvedValue([
      {userId: 1, id: 1, title: '', completed: false}, // 空标题 → 过滤
      {userId: 99, id: 2, title: 'orphan', completed: false}, // 无效用户 → 过滤
      {userId: 1, id: 3, title: 'valid', completed: false}, // 保留
    ]);

    const result = await getTodosAndUsersNormalized();

    expect(result.ids).toEqual([3]);
    expect(result.todos[3].title).toBe('valid');
  });

  it('初始化 sectionsExpanded 为展开', async () => {
    mockFetchTodos.mockResolvedValue([
      {userId: 1, id: 1, title: 'a', completed: false},
    ]);

    const result = await getTodosAndUsersNormalized();
    const titles = Object.keys(result.sectionsExpanded);
    expect(titles.length).toBeGreaterThan(0);
    expect(result.sectionsExpanded[titles[0]]).toBe(true);
  });
});
