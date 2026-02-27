//Todos列表Item组件
import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { useNavigation } from "@react-navigation/native";
import type { NavigationProp } from "@react-navigation/native";
import type { RootStackParamList } from "../../../../type/navigation";
import { useAppDispatch } from "../../../../state/store/hooks";
import { toggleTodoStatusAsync, deleteTodoAsync } from "../../../../state/store/todos/todosThunks";
import type { TodoForUI } from "../../../../type/ui";
import { RouteConfig } from "../../../../configs/routeConfig";
import TodoButton from "../../../components/TodoButton";

// 类型定义：TodoItem组件的Props
interface TodoItemProps {
    todo: TodoForUI;
}

// Tips：展示层 - Component（展示组件）
// 定义：负责单个Todo项渲染和交互的展示组件，直接订阅Redux状态。
// 职责：
// 1. 根据props渲染单个Todo项的UI界面
// 2. 处理Todo项的交互事件（切换状态、删除）
// 3. 管理Todo项的视觉状态（完成/未完成样式）
// 4. 分发Redux actions处理用户操作
// 5. 不处理业务逻辑，只关注单个Todo项的展示和交互
// 优势：
// • 组件职责单一，只处理单个Todo项的渲染逻辑
// • 直接分发Redux actions，减少props传递
// • 可在多个列表组件中复用
// • 便于独立测试，提高代码质量
// • 交互处理清晰，便于调试和维护

// Tips：React.memo 优化
// 定义：React.memo 是一个高阶组件，用于记忆化函数组件。
// 职责：
// 1. 当 props 没有变化时，跳过重新渲染
// 2. 通过浅比较（shallow comparison）检测 props 变化
// 3. 提供自定义比较函数以支持深度比较
// 优势：
// • 避免不必要的重新渲染，提高性能
// • 特别适用于列表项组件，减少渲染开销
// • 当父组件重新渲染时，子组件不会重复渲染
// • 保持组件的纯函数特性，便于测试和调试

const TodoItem: React.FC<TodoItemProps> = React.memo(({ todo }) => {
    // 添加渲染日志，用于检测过渡渲染问题
    console.log(`🔄 TodoItem 重新渲染: ID=${todo.id}, 标题="${todo.title}", 完成状态=${todo.completed}`);
    
    const dispatch = useAppDispatch();
    const navigation = useNavigation<NavigationProp<RootStackParamList>>();
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

    const handlePressTitle = React.useCallback(() => {
        navigation.navigate(RouteConfig.TODO_DETAIL, { todoId: todo.id });
    }, [navigation, todo.id]);

    const buttonTitle = isDone ? "Undo" : "Done";

    return (
        <View style={styles.itemContainer}>
            <TouchableOpacity onPress={handlePressTitle} style={styles.titleContainer}>
                <Text style={[styles.itemText, isDone && styles.strikeThrough]}>
                    {todo.title}
                </Text>
            </TouchableOpacity>
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

//Tip：局部样式，组件内单独使用的方式通过StyleSheet定义在组件内部
const styles = StyleSheet.create({
    itemContainer: {
        flexDirection: "row",
        marginBottom: 10,
        alignItems: "center",
    },
    titleContainer: {
        flex: 1,
        marginRight: 6,
    },
    itemText: {
        fontSize: 16,
        color: "#000",
    },
    strikeThrough: {
        textDecorationLine: "line-through",
        color: "gray",
    },
    buttonContainer: {
        flexDirection: "row",
    },
    doneButton: {
        backgroundColor: "gray",
    },
    deleteButton: {
        marginLeft: 6,
    },
});

export default TodoItem; 