import React from "react";
import { View, StyleSheet } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { NavigationProp } from "@react-navigation/native";
import TodoButton from "../../../components/TodoButton";
import { RouteConfig } from "../../../../configs/routeConfig";

/**
 * Tips：组件拆分原则和思路 - TodoActions
 * 
 * 组件拆分原则：
 * 
 * 1. 单一职责原则
 *    - TodoActions只负责操作按钮的渲染和交互
 *    - 包含添加Todo等操作按钮
 *    - 直接处理导航逻辑，不依赖props传递
 * 
 * 2. 可复用性原则
 *    - 可在其他需要操作按钮的页面复用
 *    - 通过直接使用导航，不依赖特定的业务逻辑
 *    - 组件接口简洁，适应不同的操作需求
 * 
 * 3. 可测试性原则
 *    - 组件行为可预测，易于单元测试
 *    - 通过Mock导航进行测试
 *    - 可以轻松Mock不同的操作场景
 * 
 * 4. 可维护性原则
 *    - 组件结构简单，易于理解和修改
 *    - 操作逻辑集中，便于调试
 *    - 样式与逻辑分离，便于UI调整
 * 
 * 5. 性能优化原则
 *    - 组件体积小，渲染性能好
 *    - 按钮点击事件处理简单高效
 *    - 不依赖外部props，减少重渲染
 * 
 * 优势：
 * • 组件职责明确，只处理操作按钮逻辑
 * • 直接使用导航，减少props传递
 * • 可在多个页面复用，减少重复代码
 * • 便于独立测试，提高代码质量
 * • 组件间耦合度低，修改影响范围小
 */
const TodoActions: React.FC = React.memo(() => {
    // 添加渲染日志，用于检测过渡渲染问题
    console.log(`🎯 TodoActions 重新渲染`);
    
    const navigation = useNavigation<NavigationProp<any>>();

    const handleAddTodo = React.useCallback(() => {
        navigation.navigate(RouteConfig.ADD_TODO);
    }, [navigation]);

    return (
        <View style={styles.container}>
            <TodoButton
                title="Add Todo"
                onPress={handleAddTodo}
                style={styles.addButton}
            />
        </View>
    );
});

const styles = StyleSheet.create({
    container: {
        marginTop: 16,
    },
    addButton: {
        alignSelf: "center",
        width: "100%",
    },
});

export default TodoActions; 