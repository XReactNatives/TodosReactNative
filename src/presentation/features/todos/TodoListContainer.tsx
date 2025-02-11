//Todos列表组件
import React, {Component} from "react";
import {SectionList, View, Text, ActivityIndicator, StyleSheet, TouchableOpacity, Image} from "react-native";
import {connect} from "react-redux";

import {fetchTodosWithUsernamesAsync, toggleSection} from "../../../state/store/todos/todosActions.ts";
import TodoItem from "./TodoItem.tsx";
import TodoButton from "../../components/TodoButton.tsx";
import type {NavigationProp} from "@react-navigation/native";
import {styles as commonStyles} from "../../styles/styles.ts";
import {RouteConfig} from "../../../configs/routeConfig.ts";
import type {AppDispatch, RootState} from "../../../state/store/rootReducer.ts";
import {ThemeConsumer} from "../../../state/context/ThemeProvider.tsx";
import {selectSections, selectLoading, selectError, selectFilteredSections} from "../../../state/store/todos/todosSelectors.ts";
import {Section} from "../../../type/ui";

interface TodoListProps {
    navigation: NavigationProp<any>;
    loading: boolean;
    error: string | null;
    fetchTodosWithUsernamesAsync: () => void;
    toggleSection: (title: string) => void;
    filterSections: (filter: string) => Section[];
}

class TodoListContainer extends Component<TodoListProps, { filter: string }> {
    constructor(props: TodoListProps) {
        super(props);
        this.state = {
            filter: 'All',
        };
    }

    componentDidMount() {
        this.props.fetchTodosWithUsernamesAsync();
    }

    handleAddTodo = () => {
        this.props.navigation.navigate(RouteConfig.ADD_TODO);
    };

    setFilter = (filter: string) => {
        this.setState({ filter });
    };

    render() {
        const {loading, error, filterSections} = this.props;
        const {filter} = this.state;
        const filteredSections = filterSections(filter);

        //Tip：类组件，ThemeConsumer获取主题全局状态
        return (
            <ThemeConsumer>
                {({titleColor}) => (
                    <View style={commonStyles.container}>
                        <Text style={[{color: titleColor}, commonStyles.title]}>
                            Todo List
                        </Text>
                        <View style={styles.filterContainer}>
                            {['All', 'Done', 'UnDone'].map((type) => (
                                <TouchableOpacity
                                    key={type}
                                    onPress={() => this.setFilter(type)}
                                    style={[
                                        styles.filterButton,
                                        filter === type && {backgroundColor: titleColor},
                                    ]}
                                >
                                    <Text
                                        style={[
                                            styles.filterButtonText,
                                            filter === type && {color: 'white'},
                                        ]}
                                    >
                                        {type}
                                    </Text>
                                </TouchableOpacity>
                            ))}
                        </View>
                        <View style={styles.listContainer}>
                            {loading ? (
                                <ActivityIndicator size="large" color="#0000ff"/>
                            ) : error ? (
                                <Text style={styles.errorText}>Error: {error}</Text>
                            ) : (
                                <SectionList
                                    sections={filteredSections}
                                    keyExtractor={(item) => item.id.toString()}
                                    renderSectionHeader={({section: {title, expanded}}) => (
                                        <TouchableOpacity onPress={() => this.props.toggleSection(title)}>
                                            <View style={styles.sectionHeader}>
                                                <Text style={styles.sectionTitle}>{title}</Text>
                                                <Image
                                                    source={expanded ? require('../../../assets/icons/setion_header_down.png') : require('../../../assets/icons/section_header_up.png')}
                                                    style={styles.icon}
                                                />
                                            </View>
                                        </TouchableOpacity>
                                    )}
                                    renderItem={({item, section}) =>
                                        section.expanded ? <TodoItem todo={item}/> : null
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

const mapStateToProps = (state: RootState) => ({
    sections: selectSections(state),
    loading: selectLoading(state),
    error: selectError(state),
    filterSections: (filter: string) => selectFilteredSections(state, filter),
});

const mapDispatchToProps = (dispatch: AppDispatch) => ({
    fetchTodosWithUsernamesAsync: () => dispatch(fetchTodosWithUsernamesAsync()),
    toggleSection: (title: string) => dispatch(toggleSection(title)),
});

export default connect(mapStateToProps, mapDispatchToProps)(TodoListContainer);

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
    filterContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginVertical: 10,
    },
    filterButton: {
        padding: 10,
        borderRadius: 5,
        width: 80,
        alignItems: 'center',
    },
    filterButtonText: {
        fontSize: 16,
        fontWeight: 'bold',
    },
});
