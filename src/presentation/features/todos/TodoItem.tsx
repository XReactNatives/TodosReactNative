//Todos列表Item组件
import React, { Component } from "react";
import { View, Text, StyleSheet } from "react-native";
import { connect } from "react-redux";

import { deleteTodo, markTodoAsDone } from "../../../state/store/todos/todosActions.ts";
import type { TodoWithUsername } from "../../../types/ui";
import TodoButton from "../../components/TodoButton.tsx";

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
                <Text style={[styles.itemText, isDone && styles.strikeThrough]}>
                    {todo.title}
                </Text>
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
                    <TodoButton title="Delete" onPress={this.handleDelete} style={styles.deleteButton} />
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

const mapDispatchToProps = {
    deleteTodo,
    markTodoAsDone,
};

export default connect(null, mapDispatchToProps)(TodoItem);
