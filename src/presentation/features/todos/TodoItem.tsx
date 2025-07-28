//Todos列表Item组件
import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { useAppDispatch } from "../../../state/store/hooks.ts";
import { deleteTodo, markTodoAsDone } from "../../../state/store/todos/todosSlice.ts";
import type { TodoForUI } from "../../../type/ui";
import TodoButton from "../../components/TodoButton.tsx";

interface TodoItemProps {
    todo: TodoForUI;
}

// Tips：展示层 - Component
// 定义：纯展示组件，只接收 props，不直接访问 Redux。
// 职责：
// 1. 根据 props 渲染 UI（Todo 文本、按钮）。
// 2. 触发由父组件传入或内部包装的回调（删除 / 完成）。
// 优势：
// • 无状态或仅本地 UI 状态，便于复用与单元测试；
// • 关注视图与交互，实现简单。
const TodoItem: React.FC<TodoItemProps> = ({ todo }) => {
    const dispatch = useAppDispatch();
    const isDone = todo.completed;

    const handleDelete = () => {
        dispatch(deleteTodo(todo.id));
    };

    const handleToggleDone = () => {
        dispatch(markTodoAsDone(todo.id));
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
