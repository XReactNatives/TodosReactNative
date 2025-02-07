//Todos添加组件
import React, {useState} from "react";
import {View, TextInput, StyleSheet, Text} from "react-native";
import {useDispatch} from "react-redux";

import {addTodo} from "../../../state/store/todos/todosActions.ts";
import type {NavigationProp} from "@react-navigation/native";
import {styles as commonStyles} from "../../../styles/styles.ts";
import type {AppDispatch} from "../../../state/store/rootReducer.ts";
import TodoButton from "../../components/TodoButton.tsx";
import {useTheme} from "../../../state/context/ThemeProvider.tsx";

interface AddTodoProps {
    navigation: NavigationProp<any>;
}

const AddTodoContainer: React.FC<AddTodoProps> = ({navigation}) => {
    const dispatch: AppDispatch = useDispatch();

    //Tip：局部状态，AddTodo组件内部输入框状态，使用useState保存
    const [username, setUsername] = useState("");
    const [title, setTitle] = useState("");

    //Tip：函数式组件，useTheme获取主题全局状态
    const theme = useTheme();

    /**
     * Tip：函数注释格式样例：
     * 处理添加Todo按钮点击事件
     */
    const handleAddTodo = () => {
        const id = Date.now();
        dispatch(addTodo({id, username, title, completed: false}));
        navigation.goBack();
    };

    return (
        <View style={commonStyles.container}>
            <Text style={[{color: theme.titleColor}, commonStyles.title]}>
                Add Todo
            </Text>
            <TextInput
                placeholder="Username"
                value={username}
                onChangeText={setUsername}
                style={styles.usernameInput}
            />
            <TextInput
                placeholder="Todo Title"
                value={title}
                onChangeText={setTitle}
                style={styles.titleInput}
            />
            <TodoButton title="Add Todo" onPress={handleAddTodo}/>
        </View>
    );
};

//局部样式
const styles = StyleSheet.create({
    titleInput: {borderBottomWidth: 1, marginBottom: 20},
    usernameInput: {borderBottomWidth: 1, marginBottom: 20},
});

export default AddTodoContainer;
