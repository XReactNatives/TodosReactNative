//Todos列表Item组件
import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { useAppDispatch } from "../../../../state/store/hooks";
import { toggleTodoStatusAsync, deleteTodoAsync } from "../../../../state/store/todos/todosThunks";
import type { TodoForUI } from "../../../../type/ui";
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
};

//Tip：局部样式，组件内单独使用的方式通过StyleSheet定义在组件内部
const styles = StyleSheet.create({
    itemContainer: {
        flexDirection: "row",
        marginBottom: 10,
        alignItems: "center",
    },
    itemText: {
        flex: 1,
        marginRight: 6,
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