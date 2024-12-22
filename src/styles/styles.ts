//公共样式
import { StyleSheet } from "react-native";

//Tip：公共样式，组件间共用的方式通过StyleSheet定义在styles/styles.ts文件中
export const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
    },
    title: {
        fontSize: 24,
        fontWeight: "bold",
        marginBottom: 16,
    },
    buttonBackground: {
        padding: 10,
        borderRadius: 5,
        alignItems: "center",
    },
    buttonText: {
        color: "#ffffff",
    },
});
