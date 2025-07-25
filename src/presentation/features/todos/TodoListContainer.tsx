//Todos列表组件
import React, { useEffect, useState } from "react";
import {SectionList, View, Text, ActivityIndicator, StyleSheet, TouchableOpacity, Image} from "react-native";
import { useNavigation, NavigationProp } from "@react-navigation/native";
import { useAppDispatch, useAppSelector } from "../../../state/store/hooks.ts";
import { toggleSection } from "../../../state/store/todos/todosSlice.ts";
import { fetchTodosWithUsernamesAsync } from "../../../state/store/todos/todosThunks.ts";
import TodoItem from "./TodoItem.tsx";
import TodoButton from "../../components/TodoButton.tsx";
import { styles as commonStyles } from "../../styles/styles.ts";
import { RouteConfig } from "../../../configs/routeConfig.ts";
import { ThemeConsumer } from "../../../state/context/ThemeProvider.tsx";
import { selectLoading, selectError, selectFilteredSections } from "../../../state/store/todos/todosSelectors.ts";

type FilterType = "All" | "Done" | "UnDone";

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

    const loading = useAppSelector(selectLoading);
    const error = useAppSelector(selectError);
    const sections = useAppSelector(state => selectFilteredSections(state, filter));

    useEffect(() => {
        dispatch(fetchTodosWithUsernamesAsync());
    }, [dispatch]);

    const handleAddTodo = () => {
        navigation.navigate(RouteConfig.ADD_TODO);
    };

    //Tip：函数组件 + hooks，ThemeConsumer获取主题全局状态
    return (
        <ThemeConsumer>
            {({ titleColor }) => (
                <View style={commonStyles.container}>
                    <Text style={[{ color: titleColor }, commonStyles.title]}>Todo List</Text>
                    <View style={styles.filterContainer}>
                        {(["All", "Done", "UnDone"] as FilterType[]).map((type) => (
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
        justifyContent: 'space-around',
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
});
