//Todos列表组件
import React, { useEffect, useState } from "react";
import {SectionList, View, Text, ActivityIndicator, StyleSheet, TouchableOpacity, Image} from "react-native";
import { useNavigation, NavigationProp } from "@react-navigation/native";
import { useAppDispatch, useAppSelector } from "../../../state/store/hooks.ts";
import { toggleSection } from "../../../state/store/todos/todosSlice.ts";
import { fetchTodosAsync, fetchUsersAsync } from "../../../state/store/todos/todosThunks.ts";
import TodoItem from "./TodoItem.tsx";
import TodoButton from "../../components/TodoButton.tsx";
import { styles as commonStyles } from "../../styles/styles.ts";
import { RouteConfig } from "../../../configs/routeConfig.ts";
import { ThemeConsumer } from "../../../state/context/ThemeProvider.tsx";
import { selectLoading, selectError, selectFilteredSections,selectFilterCount } from "../../../state/store/todos/todosSelectors.ts";
import { FilterTypes, type FilterType } from "../../../type/ui/filter";

// Tips：展示层 - Container
// 定义：连接 Redux 的 UI 容器组件，负责数据获取、状态订阅与事件分发。
// 职责：
// 1. 使用 hooks 读取 selector 数据（sections/loading/error）。
// 2. dispatch Thunk 或同步 Action（如 fetch / toggleSection）。
// 3. 将数据和回调传递给纯展示组件，控制导航。
// 优势：
// • UI 与状态管理解耦；
// • 逻辑集中，易测试；
// • 复用展示组件，保持视图纯粹。
//
const TodoListContainer: React.FC = () => {
    const navigation = useNavigation<NavigationProp<any>>();
    const dispatch = useAppDispatch();

    const [filter, setFilter] = useState<FilterType>("All");
    const [userId, setUserId] = useState<number | undefined>(undefined);
    const isInitializedRef = React.useRef(false);

    // 计数派生：仅获取当前过滤类型的数量
    const currentCount = useAppSelector((s) => selectFilterCount(s, filter));
    // 全量用户列表，用于用户过滤按钮
    const users = useAppSelector(state => state.todos.users);
    const sections = useAppSelector(state => selectFilteredSections(state, filter));
    const loading = useAppSelector(selectLoading);
    const error = useAppSelector(selectError);

    // 首次进入：先拉取用户列表，再拉全部 todos
    useEffect(() => {
        dispatch(fetchUsersAsync())
            .unwrap()
            .then(() => dispatch(fetchTodosAsync(undefined)))
            .then(() => {
                isInitializedRef.current = true;
            })
            .catch(() => {}); // 错误已由 slice 处理
    }, [dispatch]);

    // 当用户切换过滤条件时（包含选择"全部用户"）刷新列表
    useEffect(() => {
        // 只有在初始化完成后才响应 userId 变化
        if (isInitializedRef.current) {
            dispatch(fetchTodosAsync(userId));
        }
    }, [dispatch, userId]);

    const handleAddTodo = () => {
        navigation.navigate(RouteConfig.ADD_TODO);
    };

    //Tip：函数组件 + hooks，ThemeConsumer获取主题全局状态
        return (
            <ThemeConsumer>
            {({ titleColor }) => (
                    <View style={commonStyles.container}>
                    <Text style={[{ color: titleColor }, commonStyles.title]}>Todo List</Text>
                        {/* 第一行：完成状态过滤 */}
                        <View style={styles.filterContainer}>
                         {FilterTypes.map((type: FilterType) => (
                                <TouchableOpacity
                                    key={type}
                                onPress={() => setFilter(type)}
                                style={[styles.filterButton, filter === type && { backgroundColor: titleColor }]}
                                >
                                    <Text
                                    style={[styles.filterButtonText, filter === type && { color: "white" }]}
                                    >
                                        {type}
                                    </Text>
                                {filter === type && (
                                    <Text style={styles.countText}>{currentCount}</Text>
                                )}
                                </TouchableOpacity>
                            ))}
                        </View>

                        {/* 第二行：用户过滤 */}
                        <View style={styles.userFilterContainer}>
                          <TouchableOpacity
                             key={0}
                             onPress={() => setUserId(undefined)}
                             style={[styles.filterButton, userId === undefined && { backgroundColor: titleColor }]}
                          >
                             <Text style={[styles.filterButtonText, userId === undefined && { color: "white" }]}>All Users</Text>
                          </TouchableOpacity>
                          {users.map(u => (
                             <TouchableOpacity
                                 key={u.id}
                                 onPress={() => setUserId(u.id)}
                                 style={[styles.filterButton, userId === u.id && { backgroundColor: titleColor }]}
                             >
                                 <Text style={[styles.filterButtonText, userId === u.id && { color: "white" }]}>{u.username}</Text>
                             </TouchableOpacity>
                          ))}
                        </View>
                        <View style={styles.listContainer}>
                            {loading ? (
                            <ActivityIndicator size="large" color="#0000ff" />
                            ) : error ? (
                                <Text style={styles.errorText}>Error: {error}</Text>
                            ) : (
                                <SectionList
                                sections={sections}
                                    keyExtractor={(item) => item.id.toString()}
                                renderSectionHeader={({ section: { title, expanded } }) => (
                                    <TouchableOpacity onPress={() => dispatch(toggleSection(title))}>
                                            <View style={styles.sectionHeader}>
                                                <Text style={styles.sectionTitle}>{title}</Text>
                                                <Image
                                                source={expanded ? require("../../../assets/icons/setion_header_down.png") : require("../../../assets/icons/section_header_up.png")}
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
                            )}
                        <TodoButton title="Add Todo" onPress={handleAddTodo} style={styles.addButton} />
                        </View>
                    </View>
                )}
            </ThemeConsumer>
        );
};
export default TodoListContainer;

// Styles
const styles = StyleSheet.create({
    listContainer: {
        flex: 1,
        justifyContent: 'space-between',
    },
    flatList: {
        flex: 1,
    },
    addButton: {
        alignSelf: 'center',
        marginTop: 16,
        width: '100%',
    },
    errorText: {
        textAlign: 'center',
        color: 'red',
    },
    sectionHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: '#f4f4f4',
    },
    sectionTitle: {
        fontWeight: 'bold',
        fontSize: 18,
        paddingTop: 10,
        paddingBottom: 10,
    },
    icon: {
        width: 20,
        height: 20,
    },
    filterContainer: {
        flexDirection: 'row',
        justifyContent: 'flex-start',
        marginVertical: 10,
    },
    filterButton: {
        padding: 10,
        borderRadius: 5,
        width: 80,
        alignItems: 'center',
    },
    filterButtonText: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    countText: {
        fontSize: 12,
        color: 'white',
    },
    userFilterContainer: {
        flexDirection: 'row',
        justifyContent: 'flex-start',
        marginVertical: 10,
    },
});
