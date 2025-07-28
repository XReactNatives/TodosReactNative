import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { useNavigation, NavigationProp } from "@react-navigation/native";
import { ThemeConsumer } from "../../../../state/context/ThemeProvider";
import { RouteConfig } from "../../../../configs/routeConfig";
import { styles as commonStyles } from "../../../styles/styles";
import { useTodoList } from "../hooks/useTodoList";
import TodoFilters from "../components/TodoFilters";
import TodoList from "../components/TodoList";
import TodoActions from "../components/TodoActions";

// 类型定义：TodoListContainer组件的Props
interface TodoListContainerProps {
    // 容器组件通常不需要 props，因为会通过 hooks 获取状态
    // 但保留类型定义以备将来扩展
}

/**
 * Tips：组件拆分原则和思路 - TodoListContainer
 * 
 * 组件拆分原则：
 * 
 * 1. 容器组件职责
 *    - 负责组合和布局子组件
 *    - 处理导航和全局主题
 *    - 不包含具体的UI渲染逻辑
 *    - 通过自定义Hook获取业务逻辑
 * 
 * 2. 组件组合原则
 *    - 将复杂UI拆分为多个子组件
 *    - 每个子组件职责单一，易于维护
 *    - 通过props传递数据和回调
 *    - 组件间松耦合，便于独立开发和测试
 * 
 * 3. 状态管理原则
 *    - 使用自定义Hook封装业务逻辑
 *    - 容器组件只关注UI组合和布局
 *    - 状态变更通过明确的接口进行
 *    - 避免在容器组件中直接操作状态
 * 
 * 4. 可维护性原则
 *    - 组件结构清晰，易于理解和修改
 *    - 子组件可独立开发和测试
 *    - 修改影响范围小，便于重构
 *    - 代码复用性高，减少重复代码
 * 
 * 5. 性能优化原则
 *    - 组件职责单一，避免不必要的重渲染
 *    - 使用React.memo优化子组件
 *    - 状态订阅精确，只订阅需要的状态
 *    - 回调函数优化，避免重复创建
 * 
 * 优势：
 * • 组件职责明确，易于理解和维护
 * • 子组件可复用，减少重复代码
 * • 便于独立测试，提高代码质量
 * • 组件间耦合度低，修改影响范围小
 * • 状态管理清晰，便于调试和维护
 */
const TodoListContainer: React.FC<TodoListContainerProps> = () => {
    const navigation = useNavigation<NavigationProp<any>>();
    
    // 使用自定义Hook获取业务逻辑和状态
    const {
        filter,
        userId,
        currentCount,
        users,
        sections,
        loading,
        error,
        setFilter,
        setUserId,
    } = useTodoList();

    // 处理添加Todo的导航
    const handleAddTodo = () => {
        navigation.navigate(RouteConfig.ADD_TODO);
    };

    return (
        <ThemeConsumer>
            {({ titleColor }) => (
                <View style={commonStyles.container}>
                    {/* 标题区域 */}
                    <Text style={[{ color: titleColor }, commonStyles.title]}>
                        Todo List
                    </Text>
                    
                    {/* 过滤区域 */}
                    <TodoFilters
                        filter={filter}
                        onFilterChange={setFilter}
                        currentCount={currentCount}
                        users={users}
                        selectedUserId={userId}
                        onUserChange={setUserId}
                        titleColor={titleColor}
                    />
                    
                    {/* 列表内容区域 */}
                    <View style={styles.listContainer}>
                        <TodoList
                            sections={sections}
                            loading={loading}
                            error={error}
                        />
                        <TodoActions onAddTodo={handleAddTodo} />
                    </View>
                </View>
            )}
        </ThemeConsumer>
    );
};

const styles = StyleSheet.create({
    listContainer: {
        flex: 1,
        justifyContent: "space-between",
    },
});

export default TodoListContainer; 