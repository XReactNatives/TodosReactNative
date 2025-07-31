# React/React Native 组件最佳实践

## 目录
- [1. 组件/状态图](#1-组件状态图)
- [2. 拆分/存储原则](#2-拆分存储原则)
  - [2.1 单一职责原则](#21-单一职责原则)
  - [2.2 UI组件与容器组件分离](#22-ui组件与容器组件分离)
  - [2.3 状态提升与下沉](#23-状态提升与下沉)
  - [2.4 复用性优先](#24-复用性优先)
  - [2.5 避免过渡渲染](#25-避免过渡渲染)
- [3. 案例代码](#3-案例代码)
  - [3.1 单一职责原则](#31-单一职责原则)
  - [3.2 UI组件与容器组件分离](#32-ui组件与容器组件分离)
  - [3.3 状态提升与下沉](#33-状态提升与下沉)
  - [3.4 复用性优先](#34-复用性优先)
  - [3.5 避免过渡渲染](#35-避免过渡渲染)
- [4. 反例分析](#4-反例分析)
  - [4.1 组件职责混乱](#41-组件职责混乱)
  - [4.2 过度传递props](#42-过度传递props)
  - [4.3 状态管理混乱](#43-状态管理混乱)
  - [4.4 过渡渲染问题](#44-过渡渲染问题)
- [5. 总结](#5-总结)



## 1、组件/状态图
![img.png](/imgs/compotents_state.png)

## 2、最佳原则

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

### 2.5、避免过渡渲染
- **React.memo 优化**：使用 React.memo 包装函数组件，避免不必要的重新渲染
- **useCallback 优化**：使用 useCallback 稳定函数引用，避免子组件重新渲染
- **useMemo 优化**：使用 useMemo 缓存计算结果，避免重复计算
- **选择器记忆化**：使用 createSelector 创建记忆化选择器，避免重复计算
- **依赖优化**：优化 useEffect 和 useCallback 的依赖数组，避免不必要的副作用执行

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
- TodosSelectors：使用 createSelector 创建可复用的选择器

✅ **3.5、避免过渡渲染**
- /ThemeProvider/StatusFilter/TodoActions/TodoItem：使用 React.memo 避免不必要的重新渲染
- TodoListContainer/TodoActions/TodoItem：使用 useCallback 优化回调函数
- TodosSelectors：使用 createSelector 优化选择器性能
- TodoListContainer/TodoActions/StatusFilter/TodoItem：优化 useEffect 和 useCallback 的依赖数组，避免不必要的副作用执行

**TodoListContainer 组件 - 只负责组件组合和布局，容器组件，filter状态提升、同级共享状态，使用 useCallback 和 useEffect 依赖优化**

```typescript
// src/presentation/features/todos/containers/TodoListContainer.tsx
const TodoListContainer: React.FC = () => {
    // 添加渲染日志，用于检测过渡渲染问题
    console.log(`🏠 TodoListContainer 重新渲染`);

    const dispatch = useAppDispatch();

    // UI状态：在容器组件中管理
    const [filter, setFilter] = useState<FilterType>("All");

    // 使用 useCallback 稳定 dispatch 引用
    const fetchTodos = useCallback(() => {
        dispatch(fetchTodosWithSectionsAsync());
    }, [dispatch]);

    // 使用 useCallback 优化 filter 变化回调
    const handleFilterChange = useCallback((newFilter: FilterType) => {
        setFilter(newFilter);
    }, []);

    // 初始化逻辑：确保数据依赖关系正确
    useEffect(() => {
        fetchTodos();
    }, [fetchTodos]);

    return (
        <ThemeConsumer>
            {({ titleColor }) => (
                <View style={commonStyles.container}>
                    {/* 标题区域 */}
                    <Text style={[{ color: titleColor }, commonStyles.title]}>
                        Todo List
                    </Text>

                    {/* 状态过滤区域 */}
                    <StatusFilter
                        filter={filter}
                        onFilterChange={handleFilterChange}
                        titleColor={titleColor}
                    />


                    {/* 列表内容区域 */}
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

**StatusFilter 组件 - 只负责状态过滤功能，展示组件，直接订阅redux状态，使用使用 React.memo 和 useCallback函数/依赖优化**

```typescript
// src/presentation/features/todos/components/StatusFilter.tsx
const StatusFilter: React.FC<StatusFilterProps> = React.memo(({
    filter,
    onFilterChange,
    titleColor,
}) => {
    // 添加渲染日志，用于检测过渡渲染问题
    console.log(`🔍 StatusFilter 重新渲染: filter=${filter}, titleColor=${titleColor}`);
    
    // 直接订阅currentCount
    const currentCount = useAppSelector(state => selectFilterCount(state, filter));

    // 使用 useCallback 优化事件处理函数
    const handleFilterChange = React.useCallback((newFilter: FilterType) => {
        onFilterChange(newFilter);
    }, [onFilterChange]);

    return (
        <View style={styles.filterContainer}>
            {FilterTypes.map((type: FilterType) => (
                <TouchableOpacity
                    key={type}
                    onPress={() => handleFilterChange(type)}
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
});

```

**TodoList 组件 - 只负责列表渲染和分组展示，展示组件，直接订阅redux状态，**

```typescript
// src/presentation/features/todos/components/TodoList.tsx
cconst TodoList: React.FC<TodoListProps> = ({ filter }) => {
    // 添加渲染日志，用于检测过渡渲染问题
    console.log(`📋 TodoList 重新渲染: filter=${filter}`);
    
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

**TodoItem 组件 - 只负责单个Todo项的渲染和交互，展示组件，使用 React.memo 和 useCallback函数/依赖优化**

```typescript
// src/presentation/features/todos/components/TodoItem.tsx
const TodoItem: React.FC<TodoItemProps> = React.memo(({ todo }) => {
    // 添加渲染日志，用于检测过渡渲染问题
    console.log(`🔄 TodoItem 重新渲染: ID=${todo.id}, 标题="${todo.title}", 完成状态=${todo.completed}`);
    
    const dispatch = useAppDispatch();
    const isDone = todo.completed;

    // 使用 useCallback 优化事件处理函数，避免重复创建
    const handleDelete = React.useCallback(() => {
        dispatch(deleteTodoAsync(todo.id));
    }, [dispatch, todo.id]);

    const handleToggleDone = React.useCallback(() => {
        dispatch(toggleTodoStatusAsync({ 
            todoId: todo.id, 
            currentCompleted: todo.completed 
        }));
    }, [dispatch, todo.id, todo.completed]);

    const buttonTitle = isDone ? "Undo" : "Done";

    return (
        <View style={styles.itemContainer}>
            <Text style={[styles.itemText, isDone && styles.strikeThrough]}>
                {todo.title}
            </Text>
            <View style={styles.buttonContainer}>
                <TodoButton
                    title={buttonTitle}
                    onPress={handleToggleDone}
                    style={isDone ? styles.doneButton : undefined}
                />
                <TodoButton title="Delete" onPress={handleDelete} style={styles.deleteButton} />
            </View>
        </View>
    );
});
```

**TodoActions 组件 - 只负责操作按钮，展示组件，使用 React.memo 和 useCallback函数/依赖优化**

```typescript
// src/presentation/features/todos/components/TodoActions.tsx
const TodoActions: React.FC = React.memo(() => {
    // 添加渲染日志，用于检测过渡渲染问题
    console.log(`🎯 TodoActions 重新渲染`);
    
    const navigation = useNavigation<NavigationProp<any>>();

    const handleAddTodo = React.useCallback(() => {
        navigation.navigate(RouteConfig.ADD_TODO);
    }, [navigation]);

    return (
        <View style={styles.container}>
            <TodoButton
                title="Add Todo"
                onPress={handleAddTodo}
                style={styles.addButton}
            />
        </View>
    );
});
```

**AddTodoContainer- 只负责添加 Todo 的表单，容器组件，表单输入、局部状态**

```typescript
// src/presentation/features/todos/containers/AddTodoContainer.tsx
const AddTodoContainer: React.FC<AddTodoProps> = ({navigation}) => {
    // 添加渲染日志，用于检测过渡渲染问题
    console.log(`➕ AddTodoContainer 重新渲染`);
    
    const dispatch: AppDispatch = useDispatch();

    //Tip：局部状态，AddTodo组件内部输入框状态，使用useState保存
    const [username, setUsername] = useState("");
    const [title, setTitle] = useState("");

    //Tip：函数式组件，useTheme获取主题全局状态
    const theme = useTheme();

    /**
     * Tip：函数注释格式样例：
     * 处理添加Todo按钮点击事件
     */
    const handleAddTodo = () => {
        if (!username.trim() || !title.trim()) {
            return; // 简单的表单验证
        }

        // 使用异步thunk添加todo，传递用户名
        dispatch(addTodoAsync({
            title: title.trim(),
            username: username.trim(), // 修改：传递用户名
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
export const selectFilteredSections = createSelector(
  [selectSections, (state: RootState, filter: FilterType) => filter],
  (sections, filter) => {
    // 添加计算日志，用于测试缓存优化
    console.log(`🔄 selectFilteredSections 重新计算开始:`);
    console.log(`   - 过滤器: ${filter}`);
    console.log(`   - 时间戳: ${new Date().toLocaleTimeString()}`);
    console.log(`   - 输入数据: ${sections.length} 个分组`);
    
    const pred = filterPredicate[filter];
    const result = sections
      .map(section => ({
        ...section,
        data: section.data.filter(todo => pred(todo.completed))
      }))
      .filter(section => section.data.length > 0 || filter === "All");
    
    console.log(`✅ selectFilteredSections 计算完成:`);
    console.log(`   - 结果: ${result.length} 个分组`);
    console.log(`   - 总项目数: ${result.reduce((sum, section) => sum + section.data.length, 0)} 个`);
    
    return result;
  }
);

export const selectFilterCount = (
    state: RootState,
    filter: FilterType
) => {
    const list = selectSections(state).flatMap(sec => sec.data);
    return list.filter(t => filterPredicate[filter](t.completed)).length;
};
```

**合理状态管理、过渡渲染优化后效果**
```
+ useMemo-props变化渲染、useCallback-依赖变化生成callback

 //初次加载
 (NOBRIDGE) LOG  🏠 TodoListContainer 重新渲染
 (NOBRIDGE) LOG  🔍 StatusFilter 重新渲染: filter=All, titleColor=#ff0000
 (NOBRIDGE) LOG  📋 TodoList 重新渲染: filter=All
 (NOBRIDGE) LOG  🎯 TodoActions 重新渲染
 (NOBRIDGE) LOG  📋 TodoList 重新渲染: filter=All
 (NOBRIDGE) LOG  🔍 StatusFilter 重新渲染: filter=All, titleColor=#ff0000
 (NOBRIDGE) LOG  📋 TodoList 重新渲染: filter=All
 (NOBRIDGE) LOG  🔄 TodoItem 重新渲染: ID=1, 标题="user1 todo1 title", 完成状态=false
 (NOBRIDGE) LOG  🔄 TodoItem 重新渲染: ID=2, 标题="user1 todo2 title", 完成状态=true
 (NOBRIDGE) LOG  🔄 TodoItem 重新渲染: ID=3, 标题="user2 todo1 title", 完成状态=true
 (NOBRIDGE) LOG  🔄 TodoItem 重新渲染: ID=4, 标题="user2 todo2 title", 完成状态=false

//Do Todo
 (NOBRIDGE) LOG  📋 TodoList 重新渲染: filter=All
 (NOBRIDGE) LOG  🔄 TodoItem 重新渲染: ID=1, 标题="user1 todo1 title", 完成状态=true

//Delete Todo
 (NOBRIDGE) LOG  🔍 StatusFilter 重新渲染: filter=All, titleColor=#ff0000
 (NOBRIDGE) LOG  📋 TodoList 重新渲染: filter=All

//Filter Todo
 (NOBRIDGE) LOG  🏠 TodoListContainer 重新渲染
 (NOBRIDGE) LOG  🔍 StatusFilter 重新渲染: filter=Done, titleColor=#ff0000
 (NOBRIDGE) LOG  📋 TodoList 重新渲染: filter=Done

//收起Section
 (NOBRIDGE) LOG  📋 TodoList 重新渲染: filter=Done
//展开Section
 (NOBRIDGE) LOG  📋 TodoList 重新渲染: filter=Done
 (NOBRIDGE) LOG  🔄 TodoItem 重新渲染: ID=2, 标题="user1 todo2 title", 完成状态=true


+ createSelecttor-缓存优化
 (NOBRIDGE) LOG  🏠 TodoListContainer 重新渲染
 (NOBRIDGE) LOG  🔍 StatusFilter 重新渲染: filter=All, titleColor=#ff0000
 (NOBRIDGE) LOG  📋 TodoList 重新渲染: filter=All
 
 //首次展示过滤计算
 (NOBRIDGE) LOG  🔄 selectFilteredSections 重新计算开始:
 (NOBRIDGE) LOG     - 过滤器: All
 (NOBRIDGE) LOG     - 时间戳: 11:11:07
 (NOBRIDGE) LOG     - 输入数据: 0 个分组
 (NOBRIDGE) LOG  ✅ selectFilteredSections 计算完成:
 (NOBRIDGE) LOG     - 结果: 0 个分组
 (NOBRIDGE) LOG     - 总项目数: 0 个
 (NOBRIDGE) LOG  🎯 TodoActions 重新渲染
 (NOBRIDGE) LOG  📋 TodoList 重新渲染: filter=All
 (NOBRIDGE) LOG  🔄 selectFilteredSections 重新计算开始:
 (NOBRIDGE) LOG     - 过滤器: All
 (NOBRIDGE) LOG     - 时间戳: 11:11:09
 (NOBRIDGE) LOG     - 输入数据: 2 个分组
 (NOBRIDGE) LOG  ✅ selectFilteredSections 计算完成:
 (NOBRIDGE) LOG     - 结果: 2 个分组
 (NOBRIDGE) LOG     - 总项目数: 4 个
 (NOBRIDGE) LOG  🔍 StatusFilter 重新渲染: filter=All, titleColor=#ff0000
 (NOBRIDGE) LOG  📋 TodoList 重新渲染: filter=All
 (NOBRIDGE) LOG  🔄 TodoItem 重新渲染: ID=1, 标题="user1 todo1 title", 完成状态=false
 (NOBRIDGE) LOG  🔄 TodoItem 重新渲染: ID=2, 标题="user1 todo2 title", 完成状态=true
 (NOBRIDGE) LOG  🔄 TodoItem 重新渲染: ID=3, 标题="user2 todo1 title", 完成状态=true
 (NOBRIDGE) LOG  🔄 TodoItem 重新渲染: ID=4, 标题="user2 todo2 title", 完成状态=false
 
 //点击过滤按钮计算
 (NOBRIDGE) LOG  🏠 TodoListContainer 重新渲染
 (NOBRIDGE) LOG  🔍 StatusFilter 重新渲染: filter=Done, titleColor=#ff0000
 (NOBRIDGE) LOG  📋 TodoList 重新渲染: filter=Done
 (NOBRIDGE) LOG  🔄 selectFilteredSections 重新计算开始:
 (NOBRIDGE) LOG     - 过滤器: Done
 (NOBRIDGE) LOG     - 时间戳: 11:11:29
 (NOBRIDGE) LOG     - 输入数据: 2 个分组
 (NOBRIDGE) LOG  ✅ selectFilteredSections 计算完成:
 (NOBRIDGE) LOG     - 结果: 2 个分组
 (NOBRIDGE) LOG     - 总项目数: 2 个
 
  //点击过滤按钮计算
 (NOBRIDGE) LOG  🏠 TodoListContainer 重新渲染
 (NOBRIDGE) LOG  🔍 StatusFilter 重新渲染: filter=UnDone, titleColor=#ff0000
 (NOBRIDGE) LOG  📋 TodoList 重新渲染: filter=UnDone
 (NOBRIDGE) LOG  🔄 selectFilteredSections 重新计算开始:
 (NOBRIDGE) LOG     - 过滤器: UnDone
 (NOBRIDGE) LOG     - 时间戳: 11:11:32
 (NOBRIDGE) LOG     - 输入数据: 2 个分组
 (NOBRIDGE) LOG  ✅ selectFilteredSections 计算完成:
 (NOBRIDGE) LOG     - 结果: 2 个分组
 (NOBRIDGE) LOG     - 总项目数: 2 个
 (NOBRIDGE) LOG  🔄 TodoItem 重新渲染: ID=1, 标题="user1 todo1 title", 完成状态=false
 (NOBRIDGE) LOG  🔄 TodoItem 重新渲染: ID=4, 标题="user2 todo2 title", 完成状态=false

 //再次点击过滤按钮未重新计算
 (NOBRIDGE) LOG  🏠 TodoListContainer 重新渲染
 (NOBRIDGE) LOG  🔍 StatusFilter 重新渲染: filter=Done, titleColor=#ff0000
 (NOBRIDGE) LOG  📋 TodoList 重新渲染: filter=Done
 (NOBRIDGE) LOG  🔄 TodoItem 重新渲染: ID=2, 标题="user1 todo2 title", 完成状态=true
 (NOBRIDGE) LOG  🔄 TodoItem 重新渲染: ID=3, 标题="user2 todo1 title", 完成状态=true
 //同上
 (NOBRIDGE) LOG  🏠 TodoListContainer 重新渲染
 (NOBRIDGE) LOG  🔍 StatusFilter 重新渲染: filter=All, titleColor=#ff0000
 (NOBRIDGE) LOG  📋 TodoList 重新渲染: filter=All
 (NOBRIDGE) LOG  🔄 TodoItem 重新渲染: ID=1, 标题="user1 todo1 title", 完成状态=false
 (NOBRIDGE) LOG  🔄 TodoItem 重新渲染: ID=4, 标题="user2 todo2 title", 完成状态=false
 (NOBRIDGE) LOG  🏠 TodoListContainer 重新渲染
 (NOBRIDGE) LOG  🔍 StatusFilter 重新渲染: filter=Done, titleColor=#ff0000
 (NOBRIDGE) LOG  📋 TodoList 重新渲染: filter=Done
 (NOBRIDGE) LOG  🏠 TodoListContainer 重新渲染
 (NOBRIDGE) LOG  🔍 StatusFilter 重新渲染: filter=UnDone, titleColor=#ff0000
 (NOBRIDGE) LOG  📋 TodoList 重新渲染: filter=UnDone
 (NOBRIDGE) LOG  🔄 TodoItem 重新渲染: ID=1, 标题="user1 todo1 title", 完成状态=false
 (NOBRIDGE) LOG  🔄 TodoItem 重新渲染: ID=4, 标题="user2 todo2 title", 完成状态=false
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

### 4.4、过渡渲染问题

**❌ 错误做法：没有使用 React.memo 导致不必要的重新渲染**

```typescript
// 反例：TodoItem 组件没有使用 React.memo
const TodoItem: React.FC<TodoItemProps> = ({ todo }) => {
    const dispatch = useAppDispatch();
    const isDone = todo.completed;

    // 每次渲染都会创建新的函数引用
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

**❌ 错误做法：没有使用 createSelector 导致重复计算**

```typescript
// 反例：选择器没有使用 createSelector
export const selectFilteredSections = (state: RootState, filter: FilterType) => {
    const pred = filterPredicate[filter];
    return selectSections(state)
        .map(section => ({ 
            ...section, 
            data: section.data.filter(todo => pred(todo.completed)) 
        }))
        .filter(section => section.data.length > 0 || filter === "All");
};
```

**❌ 错误做法：useEffect 依赖问题导致不必要的副作用执行**

```typescript
// 反例：useEffect 依赖 dispatch 导致重复执行
const TodoListContainer: React.FC = () => {
    const dispatch = useAppDispatch();
    const [filter, setFilter] = useState<FilterType>("All");

    // 每次 dispatch 变化都会执行
    useEffect(() => {
        dispatch(fetchTodosWithSectionsAsync());
    }, [dispatch]); // dispatch 每次都是新引用

    return (
        // 组件内容
    );
};
```

**❌ 错误做法：没有使用 useCallback 导致子组件重新渲染**

```typescript
// 反例：回调函数没有使用 useCallback
const TodoListContainer: React.FC = () => {
    const [filter, setFilter] = useState<FilterType>("All");

    // 每次渲染都会创建新的函数引用
    const handleFilterChange = (newFilter: FilterType) => {
        setFilter(newFilter);
    };

    return (
        <View>
            <StatusFilter
                filter={filter}
                onFilterChange={handleFilterChange} // 每次都传递新函数
                titleColor={titleColor}
            />
            <TodoList filter={filter} />
        </View>
    );
};
```

**缺点：**
- 不必要的组件重新渲染，影响性能
- 重复计算导致性能下降
- 不必要的副作用执行
- 子组件因为父组件重新渲染而重新渲染
- 函数引用不稳定，导致子组件重新渲染

## 总结

1. **正确的组件拆分**能够提高代码的可维护性、可测试性和可复用性
2. **合理的状态管理**能够减少组件间的耦合，提高性能
3. **清晰的职责分离**能够使代码结构更加清晰，便于团队协作
4. **避免过渡渲染**能够显著提升应用性能，减少不必要的计算和渲染
5. **使用 React.memo、useCallback、createSelector 等优化技术**能够有效避免过渡渲染问题
