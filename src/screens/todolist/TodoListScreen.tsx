//Todos列表组件
import React, { Component } from "react";
import { FlatList, View, Text } from "react-native";
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

interface TodoListProps {
    navigation: NavigationProp<any>;
    todos: Todo[];
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
        const { todos } = this.props;

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
                        <FlatList
                            data={todos}
                            renderItem={({ item }) => <TodoItem todo={item} />}
                            keyExtractor={(item) => item.id.toString()}
                        />
                        <TodoButton
                            title="Add Todo"
                            onPress={this.handleAddTodo}
                        />
                    </View>
                )}
            </ThemeConsumer>
        );
    }
}

const mapStateToProps = (state: any) => ({
    todos: state.todos.todos || [],
});

const mapDispatchToProps = (dispatch: AppDispatch) => ({
    fetchTodos: () => dispatch(fetchTodosAsync()),
});

export default connect(mapStateToProps, mapDispatchToProps)(TodoListScreen);