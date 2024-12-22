//Todos列表Item组件
import React, { Component } from "react";
import { View, Text, StyleSheet } from "react-native";
import { connect } from "react-redux";

import { deleteTodo, markTodoAsDone } from "../../store/todos/todosActions";
import type { Todo } from "../../types/todos";
import TodoButton from "../../components/TodoButton";

interface TodoItemProps {
    todo: Todo;
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
        );
    }
}

//Tip：局部样式，组件内单独使用的方式通过StyleSheet定义在组件内部
const styles = StyleSheet.create({
    itemContainer: {
        flexDirection: "row",
        marginBottom: 10,
    },
    itemText: {
        flex: 1,
    },
    strikeThrough: {
        textDecorationLine: "line-through",
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
