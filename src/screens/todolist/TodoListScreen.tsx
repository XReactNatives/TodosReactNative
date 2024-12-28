//Todos列表组件
import React, { Component } from "react";
import { SectionList, View, Text, ActivityIndicator, StyleSheet, TouchableOpacity ,Image} from "react-native";
import { connect } from "react-redux";

import { fetchTodosWithUsernamesAsync, toggleSection } from "../../store/todos/todosActions";
import TodoItem from "./TodoItem";
import TodoButton from "../../components/TodoButton";
import type { NavigationProp } from "@react-navigation/native";
import { styles as commonStyles } from "../../styles/styles";
import { RouteConfig } from "../../config/routeConfig";
import type { AppDispatch } from "../../store/rootReducer";
import type { Section } from "../../store/todos/todosReducer";
import { ThemeConsumer } from "../../context/ThemeProvider";
import { selectSections, selectLoading, selectError } from "../../store/todos/todosSelectors";

interface TodoListProps {
    navigation: NavigationProp<any>;
    sections: Section[];
    loading: boolean;
    error: string | null;
    fetchTodos: () => void;
    toggleSection: (title: string) => void;
}

class TodoListScreen extends Component<TodoListProps> {
    componentDidMount() {
        this.props.fetchTodos();
    }

    handleAddTodo = () => {
        this.props.navigation.navigate(RouteConfig.ADD_TODO);
    };

    render() {
        const { sections, loading, error } = this.props;

        //Tip：类组件，ThemeConsumer获取主题全局状态
        return (
            <ThemeConsumer>
                {({ titleColor }) => (
                    <View style={commonStyles.container}>
                        <Text style={[{ color: titleColor }, commonStyles.title]}>
                            Todo List
                        </Text>
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
                                        <TouchableOpacity onPress={() => this.props.toggleSection(title)}>
                                            <View style={styles.sectionHeader}>
                                                <Text style={styles.sectionTitle}>{title}</Text>
                                                <Image
                                                    source={expanded ? require('../../assets/icons/setion_header_down.png') : require('../../assets/icons/section_header_up.png')}
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
    sections: selectSections(state),
    loading: selectLoading(state),
    error: selectError(state),
});

const mapDispatchToProps = (dispatch: AppDispatch) => ({
    fetchTodos: () => dispatch(fetchTodosWithUsernamesAsync()),
    toggleSection: (title: string) => dispatch(toggleSection(title)),
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
});