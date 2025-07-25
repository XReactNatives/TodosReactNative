//Todos列表Item组件
import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { useAppDispatch } from "../../../state/store/hooks.ts";
import { deleteTodo, markTodoAsDone } from "../../../state/store/todos/todosSlice.ts";
import type { TodoWithUsername } from "../../../type/ui";
import TodoButton from "../../components/TodoButton.tsx";

interface TodoItemProps {
    todo: TodoWithUsername;
}

const TodoItem: React.FC<TodoItemProps> = ({ todo }) => {
    const dispatch = useAppDispatch();
    const isDone = todo.completed;

    const handleDelete = () => {
        dispatch(deleteTodo(todo.id));
    };

    const handleDone = () => {
        dispatch(markTodoAsDone(todo.id));
    };

    return (
        <View style={styles.itemContainer}>
            <Text style={[styles.itemText, isDone && styles.strikeThrough]}>
                {todo.title}
            </Text>
            <View style={styles.buttonContainer}>
                <TodoButton
                    title="Done"
                    onPress={isDone ? () => {} : handleDone}
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
