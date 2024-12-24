//Todos列表组件
import React, { Component } from "react";
import { FlatList, View, Text, ActivityIndicator, StyleSheet } from "react-native";
import { connect } from "react-redux";

import { fetchTodosAsync } from "../../store/todos/todosActions";
import TodoItem from "./TodoItem";
import TodoButton from "../../components/TodoButton";
import type { NavigationProp } from "@react-navigation/native";
import { styles as commonStyles } from "../../styles/styles";
import { RouteConfig } from "../../config/routeConfig";
import type { AppDispatch } from "../../store/rootReducer";
import type { Todo } from "../../types/todos";
import { ThemeConsumer } from "../../context/ThemeProvider";
import { selectTodos, selectLoading, selectError } from "../../store/todos/todosSelectors";

interface TodoListProps {
    navigation: NavigationProp<any>;
    todos: Todo[];
    loading: boolean;
    error: string | null;
    fetchTodos: () => void;
}

class TodoListScreen extends Component<TodoListProps> {
    componentDidMount() {
        this.props.fetchTodos();
    }

    handleAddTodo = () => {
        this.props.navigation.navigate(RouteConfig.ADD_TODO);
    };

    render() {
        const { todos, loading, error } = this.props;

        //Tip：类组件，ThemeConsumer获取主题全局状态
        return (
            <ThemeConsumer>
                {({ titleColor }) => (
                    <View style={commonStyles.container}>
                        <Text
                            style={[{ color: titleColor }, commonStyles.title]}
                        >
                            Todo List
                        </Text>
                        <View style={styles.listContainer}>
                            {loading ? (
                                <ActivityIndicator size="large" color="#0000ff" />
                            ) : error ? (
                                <Text style={styles.errorText}>Error: {error}</Text>
                            ) : (
                                <FlatList
                                    data={todos}
                                    renderItem={({ item }) => <TodoItem todo={item} />}
                                    keyExtractor={(item) => item.id.toString()}
                                    style={styles.flatList}
                                />
                            )}
                            <TodoButton
                                title="Add Todo"
                                onPress={this.handleAddTodo}
                                style={styles.addButton}
                            />
                        </View>
                    </View>
                )}
            </ThemeConsumer>
        );
    }
}

const mapStateToProps = (state: any) => ({
    todos: selectTodos(state),
    loading: selectLoading(state),
    error: selectError(state),
});

const mapDispatchToProps = (dispatch: AppDispatch) => ({
    fetchTodos: () => dispatch(fetchTodosAsync()),
});

export default connect(mapStateToProps, mapDispatchToProps)(TodoListScreen);

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
        marginBottom: 20,
        width: '100%',
    },
    errorText: {
        textAlign: 'center',
        color: 'red',
    },
});