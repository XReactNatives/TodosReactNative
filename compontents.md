# React/React Native 组件拆分与状态管理最佳实践

## 目录
- [组件/状态图](#组件/状态图)
- [拆分/存储原则](#拆分/存储原则)
- [拆分案例代码](#拆分案例代码)
- [反例分析](#反例分析)


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

## 总结

1. **正确的组件拆分**能够提高代码的可维护性、可测试性和可复用性
2. **合理的状态管理**能够减少组件间的耦合，提高性能
3. **清晰的职责分离**能够使代码结构更加清晰，便于团队协作
