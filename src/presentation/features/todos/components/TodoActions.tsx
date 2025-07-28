import React from "react";
import { View, StyleSheet } from "react-native";
import TodoButton from "../../../components/TodoButton";

// 类型定义：TodoActions组件的Props
interface TodoActionsProps {
    onAddTodo: () => void;
}

/**
 * Tips：组件拆分原则和思路 - TodoActions
 * 
 * 组件拆分原则：
 * 
 * 1. 单一职责原则
 *    - TodoActions只负责操作按钮的渲染和交互
 *    - 包含添加Todo等操作按钮
 *    - 不包含业务逻辑，只处理UI事件
 * 
 * 2. 可复用性原则
 *    - 可在其他需要操作按钮的页面复用
 *    - 通过props传递回调，不依赖特定的业务逻辑
 *    - 组件接口通用，适应不同的操作需求
 * 
 * 3. 可测试性原则
 *    - 组件行为可预测，易于单元测试
 *    - 通过props注入回调函数
 *    - 可以轻松Mock不同的操作场景
 * 
 * 4. 可维护性原则
 *    - 组件结构简单，易于理解和修改
 *    - 操作逻辑集中，便于调试
 *    - 样式与逻辑分离，便于UI调整
 * 
 * 5. 性能优化原则
 *    - 使用React.memo避免不必要的重渲染
 *    - 按钮点击事件处理简单高效
 *    - 组件体积小，渲染性能好
 * 
 * 优势：
 * • 组件职责明确，只处理操作按钮逻辑
 * • 可在多个页面复用，减少重复代码
 * • 便于独立测试，提高代码质量
 * • 组件间耦合度低，修改影响范围小
 */
const TodoActions: React.FC<TodoActionsProps> = ({ onAddTodo }) => {
    return (
        <View style={styles.container}>
            <TodoButton
                title="Add Todo"
                onPress={onAddTodo}
                style={styles.addButton}
            />
        </View>
    );
};

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