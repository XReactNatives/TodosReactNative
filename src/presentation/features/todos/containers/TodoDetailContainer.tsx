import React, { useEffect, useCallback } from "react";
import { View, Text, StyleSheet, ActivityIndicator } from "react-native";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import type { RootStackParamList } from "../../../../type/navigation";
import { useAppDispatch, useAppSelector } from "../../../../state/store/hooks";
import { fetchTodoDetailAsync, toggleTodoStatusAsync, deleteTodoAsync } from "../../../../state/store/todos/todosThunks";
import { selectTodoDetail, selectDetailLoading, selectDetailError } from "../../../../state/store/todos/todosSelectors";
import { useTheme } from "../../../../state/context/ThemeProvider";
import { styles as commonStyles } from "../../../styles/styles";
import TodoButton from "../../../components/TodoButton";

type TodoDetailProps = NativeStackScreenProps<RootStackParamList, "TodoDetailScreen">;

const TodoDetailContainer: React.FC<TodoDetailProps> = ({ navigation, route }) => {
    const dispatch = useAppDispatch();
    const theme = useTheme();
    const todoId = route.params.todoId;

    const todoDetail = useAppSelector(state => selectTodoDetail(state, todoId));
    const loading = useAppSelector(selectDetailLoading);
    const error = useAppSelector(selectDetailError);

    useEffect(() => {
        if (todoId) {
            dispatch(fetchTodoDetailAsync(todoId));
        }
    }, [dispatch, todoId]);

    const handleToggleDone = useCallback(() => {
        if (todoDetail) {
            dispatch(toggleTodoStatusAsync({
                todoId: todoDetail.id,
                currentCompleted: todoDetail.completed
            }));
        }
    }, [dispatch, todoDetail]);

    const handleDelete = useCallback(() => {
        if (todoDetail) {
            dispatch(deleteTodoAsync(todoDetail.id));
            navigation.goBack();
        }
    }, [dispatch, todoDetail, navigation]);

    if (loading) {
        return (
            <View style={commonStyles.container}>
                <ActivityIndicator size="large" color="#0000ff" />
            </View>
        );
    }

    if (error) {
        return (
            <View style={commonStyles.container}>
                <Text style={[styles.errorText, { color: theme.titleColor }]}>
                    Error: {error.message}
                </Text>
            </View>
        );
    }

    if (!todoDetail) {
        return (
            <View style={commonStyles.container}>
                <Text style={[styles.errorText, { color: theme.titleColor }]}>
                    Todo not found
                </Text>
            </View>
        );
    }

    const buttonTitle = todoDetail.completed ? "Undo" : "Done";
    const statusText = todoDetail.completed ? "已完成" : "未完成";

    return (
        <View style={commonStyles.container}>
            <Text style={[{ color: theme.titleColor }, commonStyles.title]}>
                Todo Detail
            </Text>

            <View style={styles.detailContainer}>
                <View style={styles.detailRow}>
                    <Text style={styles.label}>ID:</Text>
                    <Text style={styles.value}>{todoDetail.id}</Text>
                </View>

                <View style={styles.detailRow}>
                    <Text style={styles.label}>User ID:</Text>
                    <Text style={styles.value}>{todoDetail.userId}</Text>
                </View>

                <View style={styles.detailRow}>
                    <Text style={styles.label}>Username:</Text>
                    <Text style={styles.value}>{todoDetail.username}</Text>
                </View>

                <View style={styles.detailRow}>
                    <Text style={styles.label}>Title:</Text>
                    <Text style={[styles.value, styles.titleValue]}>{todoDetail.title}</Text>
                </View>

                <View style={styles.detailRow}>
                    <Text style={styles.label}>Status:</Text>
                    <Text style={[styles.value, todoDetail.completed && styles.completedText]}>
                        {statusText}
                    </Text>
                </View>
            </View>

            <View style={styles.buttonContainer}>
                <View style={styles.buttonWrapper}>
                    <TodoButton
                        title={buttonTitle}
                        onPress={handleToggleDone}
                        style={todoDetail.completed ? styles.doneButton : undefined}
                    />
                </View>
                <View style={styles.buttonWrapper}>
                    <TodoButton
                        title="Delete"
                        onPress={handleDelete}
                        style={styles.deleteButton}
                    />
                </View>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    detailContainer: {
        marginTop: 20,
        marginBottom: 20,
    },
    detailRow: {
        flexDirection: "row",
        marginBottom: 15,
        alignItems: "flex-start",
    },
    label: {
        fontSize: 16,
        fontWeight: "bold",
        color: "#333",
        width: 100,
    },
    value: {
        fontSize: 16,
        color: "#000",
        flex: 1,
    },
    titleValue: {
        fontWeight: "500",
    },
    completedText: {
        color: "gray",
        textDecorationLine: "line-through",
    },
    buttonContainer: {
        flexDirection: "row",
        marginTop: 20,
        marginHorizontal: -16,
        paddingHorizontal: 16,
    },
    buttonWrapper: {
        flex: 1,
        marginHorizontal: 8,
    },
    doneButton: {
        backgroundColor: "gray",
    },
    deleteButton: {},
    errorText: {
        textAlign: "center",
        fontSize: 16,
        marginTop: 20,
    },
});

export default TodoDetailContainer;
