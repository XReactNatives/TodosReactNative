import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet } from "react-native";
import { useAppDispatch } from "../../../../state/store/hooks";
import { fetchTodosWithSectionsAsync } from "../../../../state/store/todos/todosThunks";
import { FilterType } from "../../../../type/state/filter";
import { ThemeConsumer } from "../../../../state/context/ThemeProvider";
import { styles as commonStyles } from "../../../styles/styles";
import StatusFilter from "../components/StatusFilter";
import TodoList from "../components/TodoList";
import TodoActions from "../components/TodoActions";

// Tips：展示层 - Container（容器组件）
// 定义：负责连接Redux和Component的容器组件，管理UI状态和组件组合。
// 职责：
// 1. 组合和布局子组件，处理组件间的协调
// 2. 管理UI状态（如filter状态），通过props传递给子组件
// 3. 处理全局主题和导航等跨组件功能
// 4. 负责数据初始化，触发异步数据加载
// 5. 订阅必要的Redux状态，但不直接处理业务逻辑
// 优势：
// • 将UI状态与业务状态分离，职责清晰
// • 子组件可复用，减少重复代码
// • 便于独立测试，提高代码质量
// • 组件间耦合度低，修改影响范围小
// • 状态管理清晰，便于调试和维护

/**
 * Tips：组件拆分原则和思路 - TodoListContainer
 *
 * 组件拆分原则：
 *
 * 1. 容器组件职责
 *    - 负责组合和布局子组件
 *    - 处理导航和全局主题
 *    - 管理UI状态（filter）
 *    - 负责数据初始化
 *
 * 2. 组件组合原则
 *    - 将复杂UI拆分为多个子组件
 *    - 每个子组件职责单一，易于维护
 *    - 通过props传递UI状态，子组件直接订阅业务状态
 *    - 组件间松耦合，便于独立开发和测试
 *
 * 3. 状态管理原则
 *    - UI状态在容器组件中管理，避免过度抽象
 *    - 业务状态让子组件直接订阅Redux
 *    - 状态变更通过明确的接口进行
 *    - 子组件负责自己的业务状态管理
 *
 * 4. 可维护性原则
 *    - 组件结构清晰，易于理解和修改
 *    - 子组件可独立开发和测试
 *    - 修改影响范围小，便于重构
 *    - 代码复用性高，减少重复代码
 *
 * 5. 性能优化原则
 *    - 容器组件只订阅必要的状态
 *    - 子组件精确订阅自己需要的状态
 *    - 状态变化影响范围最小化
 *    - 回调函数优化，避免重复创建
 *
 * 优势：
 * • 组件职责明确，易于理解和维护
 * • 子组件可复用，减少重复代码
 * • 便于独立测试，提高代码质量
 * • 组件间耦合度低，修改影响范围小
 * • 状态管理清晰，便于调试和维护
 */
const TodoListContainer: React.FC = () => {
    const dispatch = useAppDispatch();

    // UI状态：在容器组件中管理
    const [filter, setFilter] = useState<FilterType>("All");

    // 初始化逻辑：确保数据依赖关系正确
    useEffect(() => {
        dispatch(fetchTodosWithSectionsAsync());
    }, [dispatch]);

    return (
        <ThemeConsumer>
            {({ titleColor }) => (
                <View style={commonStyles.container}>
                    {/* 标题区域 */}
                    <Text style={[{ color: titleColor }, commonStyles.title]}>
                        Todo List
                    </Text>

                    {/* 状态过滤区域 */}
                    <StatusFilter
                        filter={filter}
                        onFilterChange={setFilter}
                        titleColor={titleColor}
                    />


                    {/* 列表内容区域 */}
                    <View style={styles.listContainer}>
                        <TodoList filter={filter} />
                        <TodoActions />
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
