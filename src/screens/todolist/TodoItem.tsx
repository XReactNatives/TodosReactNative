//Todos列表Item组件
import React, { Component } from "react";
import { View, Text, StyleSheet } from "react-native";
import { connect } from "react-redux";

import { deleteTodo, markTodoAsDone } from "../../store/todos/todosActions";
import type { TodoWithUsername } from "../../types/ui";
import TodoButton from "../../components/TodoButton";

interface TodoItemProps {
    todo: TodoWithUsername;
    deleteTodo: (id: number) => void;
    markTodoAsDone: (id: number) => void;
}

class TodoItem extends Component<TodoItemProps> {
    handleDelete = () => {
        this.props.deleteTodo(this.props.todo.id);
    };

    handleDone = () => {
        this.props.markTodoAsDone(this.props.todo.id);
    };

    render() {
        const { todo } = this.props;
        const isDone = todo.completed;

        return (
            <View style={styles.itemContainer}>
                <View style={styles.textContainer}>
                    <Text style={[styles.itemText, isDone && styles.strikeThrough]}>
                        {todo.title}
                    </Text>
                    <Text style={styles.usernameText}>{todo.username}</Text>
                </View>
                <View style={styles.buttonContainer}>
                    {!isDone ? (
                        <TodoButton title="Done" onPress={this.handleDone} />
                    ) : (
                        <TodoButton
                            title="Done"
                            onPress={() => {}}
                            style={styles.doneButton}
                        />
                    )}
                    <TodoButton title="Delete" onPress={this.handleDelete} />
                </View>
            </View>
        );
    }
}

//Tip：局部样式，组件内单独使用的方式通过StyleSheet定义在组件内部
const styles = StyleSheet.create({
    itemContainer: {
        flexDirection: "row",
        marginBottom: 10,
        alignItems: "center",
    },
    textContainer: {
        flex: 1,
    },
    usernameText: {
        marginTop: 5,
        fontSize: 12,
        color: "#888",
    },
    itemText: {
        flex: 1,
        fontSize: 16,
        color: "#000",
    },
    strikeThrough: {
        textDecorationLine: "line-through",
    },
    buttonContainer: {
        flexDirection: "row",
    },
    doneButton: {
        backgroundColor: "gray",
    },
});

const mapDispatchToProps = {
    deleteTodo,
    markTodoAsDone,
};

export default connect(null, mapDispatchToProps)(TodoItem);
