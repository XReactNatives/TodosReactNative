# React/React Native 组件拆分与状态管理最佳实践

## 目录
## 目录
- [1. 组件/状态图](#1-组件状态图)
- [2. 拆分/存储原则](#2-拆分存储原则)
  - [2.1 单一职责原则](#21-单一职责原则)
  - [2.2 UI组件与容器组件分离](#22-ui组件与容器组件分离)
  - [2.3 状态提升与下沉](#23-状态提升与下沉)
  - [2.4 复用性优先](#24-复用性优先)
- [3. 案例代码](#3-案例代码)
  - [3.1 单一职责原则](#31-单一职责原则)
  - [3.2 UI组件与容器组件分离](#32-ui组件与容器组件分离)
  - [3.3 状态提升与下沉](#33-状态提升与下沉)
  - [3.4 复用性优先](#34-复用性优先)
- [4. 反例分析](#4-反例分析)
  - [4.1 组件职责混乱](#41-组件职责混乱)
  - [4.2 过度传递props](#42-过度传递props)
  - [4.3 状态管理混乱](#43-状态管理混乱)
- [5. 总结](#5-总结)



## 1、组件/状态图
![img.png](/imgs/compotents_state.png)

## 2、拆分/存储原则

### 2.1、单一职责原则
每个组件只做一件事，职责明确，便于维护和测试。

### 2.2、UI组件与容器组件分离
- **容器组件**：负责**数据获取，组件组合**等。
- **展示组件**：负责**直接订阅状态**，UI渲染，事件处理等。

### 2.3、状态提升与下沉
- **局部状态**：
    - 属于某个组件且不会被其他组件用到，放在本地。
    - 简单useState、复杂useReducer。
- **同级共享状态**：
    - 多个组件需要访问，**提升到最近的公共父组件**。
    - 同局部状态。
- **全局共享状态**：
    - 多个组件需要访问，**无公共父组件，使用全局状态管理**。
    - 简单Context，负责useSliece。

### 2.4、复用性优先
将可复用的逻辑或UI抽离成自定义Hooks或独立组件。

## 3、案例代码

✅ **3.1、单一职责原则**
- TodoListContainer：只负责组件组合和布局
    - StatusFilter：只负责状态过滤功能
    - TodoList：只负责列表渲染和分组展示
        - TodoItem：只负责单个 Todo 项的渲染和交互
    - TodoActions：只负责操作按钮
- AddTodoContainer：只负责添加 Todo 的表单

✅ **3.2、UI组件与容器组件分离**
- 容器组件：TodoListContainer、AddTodoContainer 负责组合和布局
- 展示组件：TodoItem、TodoList、StatusFilter、TodoActions 直接订阅 Redux 状态

✅ **3.3、状态提升与下沉**
- 局部状态：
    - AddTodoContainer - 表单输入状态
- 同级共享状态： 
    - TodoListContainer - filter 状态提升
- 全局状态：
    - Redux Store - sections、loading和error，业务数据状态

✅ **3.4、复用性优先**
- TodoButton：可复用的按钮组件
- 使用 createSelector 创建可复用的选择器

**TodoListContainer 组件 - 只负责组件组合和布局，容器组件，filter状态提升、同级共享状态**

```typescript
// src/presentation/features/todos/containers/TodoListContainer.tsx
const TodoListContainer: React.FC = () => {
    const dispatch = useAppDispatch();

    // UI状态：在容器组件中管理
    const [filter, setFilter] = useState<FilterType>("All");

    // 初始化逻辑
    useEffect(() => {
        dispatch(fetchTodosWithSectionsAsync());
    }, [dispatch]);

    return (
        <ThemeConsumer>
            {({ titleColor }) => (
                <View style={commonStyles.container}>
                    <Text style={[{ color: titleColor }, commonStyles.title]}>
                        Todo List
                    </Text>
                    
                    <StatusFilter
                        filter={filter}
                        onFilterChange={setFilter}
                        titleColor={titleColor}
                    />
                    
                    <View style={styles.listContainer}>
                        <TodoList filter={filter} />
                        <TodoActions />
                    </View>
                </View>
            )}
        </ThemeConsumer>
    );
};
```

**StatusFilter 组件 - 只负责状态过滤功能，展示组件，直接订阅redux状态**

```typescript
// src/presentation/features/todos/components/StatusFilter.tsx
const StatusFilter: React.FC<StatusFilterProps> = ({
    filter,
    onFilterChange,
    titleColor,
}) => {
    // 直接订阅currentCount
    const currentCount = useAppSelector(state => selectFilterCount(state, filter));

    return (
        <View style={styles.filterContainer}>
            {FilterTypes.map((type: FilterType) => (
                <TouchableOpacity
                    key={type}
                    onPress={() => onFilterChange(type)}
                    style={[styles.filterButton, filter === type && { backgroundColor: titleColor }]}
                >
                    <Text style={[styles.filterButtonText, filter === type && { color: "white" }]}>
                        {type}
                    </Text>
                    {filter === type && (
                        <Text style={styles.countText}>{currentCount}</Text>
                    )}
                </TouchableOpacity>
            ))}
        </View>
    );
};
```

**TodoList 组件 - 只负责列表渲染和分组展示，展示组件，直接订阅redux状态**

```typescript
// src/presentation/features/todos/components/TodoList.tsx
const TodoList: React.FC<TodoListProps> = ({ filter }) => {
    const dispatch = useAppDispatch();

    // 直接订阅Redux业务状态
    const sections = useAppSelector(state => selectFilteredSections(state, filter));
    const loading = useAppSelector(selectLoading);
    const error = useAppSelector(selectError);

    // 加载状态处理
    if (loading) {
        return <ActivityIndicator size="large" color="#0000ff" />;
    }

    // 错误状态处理
    if (error) {
        return <Text style={styles.errorText}>Error: {error}</Text>;
    }

    // 正常状态处理
    return (
        <SectionList
            sections={sections}
            keyExtractor={(item) => item.id.toString()}
            renderSectionHeader={({ section: { title, expanded } }) => (
                <TouchableOpacity onPress={() => dispatch(toggleSection(title))}>
                    <View style={styles.sectionHeader}>
                        <Text style={styles.sectionTitle}>{title}</Text>
                        <Image
                            source={expanded ? require("../../../../assets/icons/setion_header_down.png") : require("../../../../assets/icons/section_header_up.png")}
                            style={styles.icon}
                        />
                    </View>
                </TouchableOpacity>
            )}
            renderItem={({ item, section }) =>
                section.expanded ? <TodoItem todo={item} /> : null
            }
            style={styles.flatList}
        />
    );
};
```

**TodoItem 组件 - 只负责单个Todo项的渲染和交互，展示组件**

```typescript
// src/presentation/features/todos/components/TodoItem.tsx
const TodoItem: React.FC<TodoItemProps> = ({ todo }) => {
    const dispatch = useAppDispatch();
    const isDone = todo.completed;

    const handleDelete = () => {
        dispatch(deleteTodoAsync(todo.id));
    };

    const handleToggleDone = () => {
        dispatch(toggleTodoStatusAsync({ 
            todoId: todo.id, 
            currentCompleted: todo.completed 
        }));
    };

    return (
        <View style={styles.itemContainer}>
            <Text style={[styles.itemText, isDone && styles.strikeThrough]}>
                {todo.title}
            </Text>
            <View style={styles.buttonContainer}>
                <TodoButton
                    title={isDone ? "Undo" : "Done"}
                    onPress={handleToggleDone}
                />
                <TodoButton title="Delete" onPress={handleDelete} />
            </View>
        </View>
    );
};
```

**TodoActions 组件 - 只负责操作按钮，展示组件**

```typescript
// src/presentation/features/todos/components/TodoActions.tsx
const TodoActions: React.FC = () => {
    const navigation = useNavigation<NavigationProp<any>>();

    const handleAddTodo = () => {
        navigation.navigate(RouteConfig.ADD_TODO);
    };

    return (
        <View style={styles.container}>
            <TodoButton
                title="Add Todo"
                onPress={handleAddTodo}
                style={styles.addButton}
            />
        </View>
    );
};
```

**AddTodoContainer- 只负责添加 Todo 的表单，容器组件，表单输入、局部状态**

```typescript
// src/presentation/features/todos/containers/AddTodoContainer.tsx
const AddTodoContainer: React.FC<AddTodoProps> = ({navigation}) => {
    const dispatch: AppDispatch = useDispatch();

    //Tip：局部状态，AddTodo组件内部输入框状态，使用useState保存
    const [username, setUsername] = useState("");
    const [title, setTitle] = useState("");

    const handleAddTodo = () => {
        if (!username.trim() || !title.trim()) {
            return; // 简单的表单验证
        }

        // 使用异步thunk添加todo，传递用户名
        dispatch(addTodoAsync({
            title: title.trim(),
            username: username.trim(),
            completed: false,
        }));

        // 清空输入框
        setUsername("");
        setTitle("");

        // 返回上一页
        navigation.goBack();
    };

    return (
        <View style={commonStyles.container}>
            <Text style={[{color: theme.titleColor}, commonStyles.title]}>
                Add Todo
            </Text>
            <TextInput
                placeholder="Username"
                value={username}
                onChangeText={setUsername}
                style={styles.usernameInput}
            />
            <TextInput
                placeholder="Todo Title"
                value={title}
                onChangeText={setTitle}
                style={styles.titleInput}
            />
            <TodoButton title="Add Todo" onPress={handleAddTodo}/>
        </View>
    );
};
```

**Redux Store- 全局共享状态**

```typescript
// src/state/store/todos/todosSlice.ts
interface TodosState {
    sections: Section[];
    loading: boolean;
    error: AppError | null;
}

const initialState: TodosState = {
    sections: [],
    loading: false,
    error: null,
};

const todosSlice = createSlice({
    name: "todos",
    initialState,
    reducers: {
        toggleSection: (state, { payload }: PayloadAction<string>) => {
            state.sections = state.sections.map((section) =>
                section.title === payload
                    ? { ...section, expanded: !section.expanded }
                    : section
            );
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchTodosWithSectionsAsync.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchTodosWithSectionsAsync.fulfilled, (state, { payload }) => {
                state.loading = false;
                state.sections = payload;
            })
            .addCase(fetchTodosWithSectionsAsync.rejected, handleRejectedAction)
            // ... 其他异步操作处理
    },
});
```

**TodoButton- 可复用的按钮组件，复用主题应用等逻辑**

```typescript
// src/presentation/components/TodoButton.tsx
interface TodoButtonProps {
    title: string;
    onPress: () => void;
    style?: any;
}

class TodoButton extends Component<TodoButtonProps> {
    render() {
        const { title, onPress, style } = this.props;

        return (
            <ThemeConsumer>
                {({ buttonBackgroundColor }) => (
                    <TouchableOpacity
                        style={[
                            { backgroundColor: buttonBackgroundColor },
                            commonStyles.buttonBackground,
                            style,
                        ]}
                        onPress={onPress}
                    >
                        <Text style={commonStyles.buttonText}>{title}</Text>
                    </TouchableOpacity>
                )}
            </ThemeConsumer>
        );
    }
}
```

**todosSelectors- 可复用选择器，使用 createSelector 创建可复用的选择器**

```typescript
// src/state/store/todos/todosSelectors.ts
import { createSelector } from 'reselect';

// 基本选择器
const selectTodosState = (state: RootState) => state.todos;

// 选择器：获取todos列表
export const selectSections = createSelector(
    [selectTodosState],
    (todosState) => todosState.sections
);

// 选择器：根据过滤器获取sections
export const selectFilteredSections = (state: RootState, filter: FilterType) => {
    const pred = filterPredicate[filter];
    return selectSections(state)
        .map(section => ({ 
            ...section, 
            data: section.data.filter(todo => pred(todo.completed)) 
        }))
        .filter(section => section.data.length > 0 || filter === "All");
};

export const selectFilterCount = (
    state: RootState,
    filter: FilterType
) => {
    const list = selectSections(state).flatMap(sec => sec.data);
    return list.filter(t => filterPredicate[filter](t.completed)).length;
};
```
## 4、反例分析

### 4.1、反例1：组件职责混乱

**❌ 错误做法：混合了多个职责的组件**

```typescript
// 反例：TodoManager 组件 - 职责混乱
const TodoManager: React.FC = () => {
    const dispatch = useAppDispatch();
    const [filter, setFilter] = useState<FilterType>("All");
    const [username, setUsername] = useState("");
    const [title, setTitle] = useState("");
    
    const sections = useAppSelector(state => selectFilteredSections(state, filter));
    const loading = useAppSelector(selectLoading);
    
    // 混合了列表展示、过滤、添加等多个职责
    return (
        <View>
            {/* 标题 */}
            <Text>Todo List</Text>
            
            {/* 过滤功能 */}
            <View>
                {FilterTypes.map(type => (
                    <TouchableOpacity onPress={() => setFilter(type)}>
                        <Text>{type}</Text>
                    </TouchableOpacity>
                ))}
            </View>
            
            {/* 列表展示 */}
            {loading ? (
                <ActivityIndicator />
            ) : (
                <FlatList
                    data={sections.flatMap(s => s.data)}
                    renderItem={({ item }) => (
                        <View>
                            <Text>{item.title}</Text>
                            <TouchableOpacity onPress={() => dispatch(deleteTodoAsync(item.id))}>
                                <Text>Delete</Text>
                            </TouchableOpacity>
                        </View>
                    )}
                />
            )}
            
            {/* 添加功能 */}
            <TextInput
                placeholder="Username"
                value={username}
                onChangeText={setUsername}
            />
            <TextInput
                placeholder="Title"
                value={title}
                onChangeText={setTitle}
            />
            <TouchableOpacity onPress={() => {
                dispatch(addTodoAsync({ title, username, completed: false }));
                setTitle("");
                setUsername("");
            }}>
                <Text>Add Todo</Text>
            </TouchableOpacity>
        </View>
    );
};
```

**缺点：**
- 组件职责混乱，难以维护
- 代码冗长，可读性差
- 难以复用，耦合度高
- 测试困难，需要测试多个功能

### 反例2：过度传递props

**❌ 错误做法：通过props层层传递状态**

```typescript
// 反例：通过props传递状态
interface TodoListProps {
    todos: TodoForUI[];
    onToggleTodo: (id: number) => void;
    onDeleteTodo: (id: number) => void;
    onFilterChange: (filter: FilterType) => void;
    filter: FilterType;
    loading: boolean;
    error: string | null;
}

const TodoList: React.FC<TodoListProps> = ({ 
    todos, 
    onToggleTodo, 
    onDeleteTodo, 
    onFilterChange, 
    filter, 
    loading, 
    error 
}) => {
    return (
        <View>
            <StatusFilter 
                filter={filter} 
                onFilterChange={onFilterChange} 
            />
            {loading && <ActivityIndicator />}
            {error && <Text>{error}</Text>}
            {todos.map(todo => (
                <TodoItem 
                    todo={todo}
                    onToggle={onToggleTodo}
                    onDelete={onDeleteTodo}
                />
            ))}
        </View>
    );
};

// 父组件需要管理所有状态
const TodoListContainer: React.FC = () => {
    const dispatch = useAppDispatch();
    const [filter, setFilter] = useState<FilterType>("All");
    const todos = useAppSelector(state => selectFilteredSections(state, filter));
    const loading = useAppSelector(selectLoading);
    const error = useAppSelector(selectError);
    
    const handleToggleTodo = (id: number) => {
        dispatch(toggleTodoStatusAsync({ todoId: id, currentCompleted: false }));
    };
    
    const handleDeleteTodo = (id: number) => {
        dispatch(deleteTodoAsync(id));
    };
    
    return (
        <TodoList
            todos={todos}
            onToggleTodo={handleToggleTodo}
            onDeleteTodo={handleDeleteTodo}
            onFilterChange={setFilter}
            filter={filter}
            loading={loading}
            error={error}
        />
    );
};
```

**缺点：**
- props传递链过长，难以维护
- 父组件承担过多责任
- 组件耦合度高，难以复用
- 状态变更影响范围大

### 反例3：状态管理混乱

**❌ 错误做法：状态管理不清晰**

```typescript
// 反例：状态管理混乱
const TodoApp: React.FC = () => {
    // 混合了全局状态和本地状态
    const [todos, setTodos] = useState<TodoForUI[]>([]);
    const [filter, setFilter] = useState<FilterType>("All");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [username, setUsername] = useState("");
    const [title, setTitle] = useState("");
    
    // 业务逻辑和UI逻辑混合
    const fetchTodos = async () => {
        setLoading(true);
        try {
            const response = await fetch('/api/todos');
            const data = await response.json();
            setTodos(data);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };
    
    const addTodo = async () => {
        if (!title.trim() || !username.trim()) return;
        
        setLoading(true);
        try {
            const response = await fetch('/api/todos', {
                method: 'POST',
                body: JSON.stringify({ title, username, completed: false })
            });
            const newTodo = await response.json();
            setTodos(prev => [...prev, newTodo]);
            setTitle("");
            setUsername("");
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };
    
    // 组件逻辑复杂，难以维护
    return (
        <View>
            {/* 复杂的组件逻辑 */}
        </View>
    );
};
```

**缺点：**
- 状态管理混乱，难以追踪
- 业务逻辑和UI逻辑混合
- 组件过于复杂，难以测试
- 状态更新容易出错

## 总结

1. **正确的组件拆分**能够提高代码的可维护性、可测试性和可复用性
2. **合理的状态管理**能够减少组件间的耦合，提高性能
3. **清晰的职责分离**能够使代码结构更加清晰，便于团队协作
