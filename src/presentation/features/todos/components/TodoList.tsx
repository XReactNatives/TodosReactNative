import React from "react";
import { View, Text, ActivityIndicator, StyleSheet } from "react-native";
import { SectionList, TouchableOpacity, Image } from "react-native";
import { useAppDispatch, useAppSelector } from "../../../../state/store/hooks";
import { toggleSection } from "../../../../state/store/todos/todosSlice";
import { selectFilteredSections, selectLoading, selectError } from "../../../../state/store/todos/todosSelectors";
import type { FilterType } from "../../../../type/state/filter";
import TodoItem from "./TodoItem";

// 类型定义：TodoList组件的Props
interface TodoListProps {
    filter: FilterType;
}

// Tips：展示层 - Component（展示组件）
// 定义：负责UI渲染和用户交互的纯展示组件，直接订阅Redux业务状态。
// 职责：
// 1. 根据props和Redux状态渲染UI界面
// 2. 处理用户交互事件，分发Redux actions
// 3. 管理加载状态、错误状态、正常状态的UI展示
// 4. 处理列表渲染、虚拟化等性能优化
// 5. 不处理业务逻辑，只关注UI展示和交互
// 优势：
// • 组件职责明确，只处理UI渲染逻辑
// • 直接订阅Redux业务状态，减少props传递
// • 可在多个页面复用，减少重复代码
// • 便于独立测试，提高代码质量
// • 状态处理清晰，便于调试和维护

/**
 * Tips：组件拆分原则和思路 - TodoList
 *
 * 组件拆分原则：
 *
 * 1. 单一职责原则
 *    - TodoList只负责列表的渲染和交互
 *    - 处理加载状态、错误状态、正常状态的UI展示
 *    - 直接订阅Redux业务状态，UI状态通过props传递
 *
 * 2. 可复用性原则
 *    - 可在其他需要展示分组列表的页面复用
 *    - 通过Redux状态管理业务数据，UI状态通过props传递
 *    - 组件接口清晰，适应不同的数据格式
 *
 * 3. 可测试性原则
 *    - 组件行为可预测，易于单元测试
 *    - 可以Mock不同的Redux状态（加载、错误、正常）
 *    - 交互事件处理简单，便于测试
 *
 * 4. 可维护性原则
 *    - 组件结构清晰，易于理解和修改
 *    - 状态处理逻辑集中，便于调试
 *    - 样式与逻辑分离，便于UI调整
 *
 * 5. 性能优化原则
 *    - 只订阅需要的业务状态，UI状态通过props传递
 *    - 使用SectionList进行虚拟化渲染
 *    - 条件渲染避免不必要的组件创建
 *
 * 优势：
 * • 组件职责明确，只处理列表渲染逻辑
 * • 直接订阅Redux业务状态，减少props传递
 * • 可在多个页面复用，减少重复代码
 * • 便于独立测试，提高代码质量
 * • 状态处理清晰，便于调试和维护
 */
const TodoList: React.FC<TodoListProps> = ({ filter }) => {
    // 添加渲染日志，用于检测过渡渲染问题
    console.log(`📋 TodoList 重新渲染: filter=${filter}`);
    
    const dispatch = useAppDispatch();

    // 直接订阅Redux业务状态
    const sections = useAppSelector(state => selectFilteredSections(state, filter));
    const loading = useAppSelector(selectLoading);
    const error = useAppSelector(selectError);

    // 加载状态处理
    if (loading) {
        return <ActivityIndicator size="large" color="#0000ff" />;
    }

    // 错误状态处理
    if (error) {
        return <Text style={styles.errorText}>Error: {error}</Text>;
    }

    // 正常状态处理
    return (
        <SectionList
            sections={sections}
            keyExtractor={(item) => item.id.toString()}
            renderSectionHeader={({ section: { title, expanded } }) => (
                <TouchableOpacity onPress={() => dispatch(toggleSection(title))}>
                    <View style={styles.sectionHeader}>
                        <Text style={styles.sectionTitle}>{title}</Text>
                        <Image
                            source={expanded ? require("../../../../assets/icons/setion_header_down.png") : require("../../../../assets/icons/section_header_up.png")}
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
    );
};

const styles = StyleSheet.create({
    flatList: {
        flex: 1,
    },
    errorText: {
        textAlign: "center",
        color: "red",
    },
    sectionHeader: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        backgroundColor: "#f4f4f4",
    },
    sectionTitle: {
        fontWeight: "bold",
        fontSize: 18,
        paddingTop: 10,
        paddingBottom: 10,
    },
    icon: {
        width: 20,
        height: 20,
    },
});

export default TodoList;
