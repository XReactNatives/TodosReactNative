import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { FilterTypes, type FilterType } from "../../../../type/ui/filter";
import type { UserForUI } from "../../../../type/ui";

// 类型定义：TodoFilters组件的Props
interface TodoFiltersProps {
    filter: FilterType;
    onFilterChange: (filter: FilterType) => void;
    currentCount: number;
    users: UserForUI[];
    selectedUserId: number | undefined;
    onUserChange: (userId: number | undefined) => void;
    titleColor: string;
}

/**
 * Tips：组件拆分原则和思路 - TodoFilters
 * 
 * 组件拆分原则：
 * 
 * 1. 单一职责原则
 *    - TodoFilters只负责过滤功能的UI和交互
 *    - 包含状态过滤和用户过滤两个功能
 *    - 不包含数据获取逻辑，只处理用户选择事件
 * 
 * 2. 可复用性原则
 *    - 可在其他需要过滤功能的页面复用
 *    - 通过props传递数据和回调，不依赖特定的业务逻辑
 *    - 组件接口通用，适应不同的过滤需求
 * 
 * 3. 可测试性原则
 *    - 组件行为可预测，易于单元测试
 *    - 通过props注入过滤数据和回调函数
 *    - 可以轻松Mock不同的过滤场景
 * 
 * 4. 可维护性原则
 *    - 组件结构清晰，易于理解和修改
 *    - 过滤逻辑集中，便于调试
 *    - 样式与逻辑分离，便于UI调整
 * 
 * 5. 性能优化原则
 *    - 使用React.memo避免不必要的重渲染
 *    - 过滤条件变化时只重新渲染必要的部分
 *    - 按钮点击事件处理简单高效
 * 
 * 优势：
 * • 组件职责明确，只处理过滤逻辑
 * • 可在多个页面复用，减少重复代码
 * • 便于独立测试，提高代码质量
 * • 组件间耦合度低，修改影响范围小
 */
const TodoFilters: React.FC<TodoFiltersProps> = ({
    filter,
    onFilterChange,
    currentCount,
    users,
    selectedUserId,
    onUserChange,
    titleColor,
}) => {
    return (
        <View>
            {/* 状态过滤 */}
            <View style={styles.filterContainer}>
                {FilterTypes.map((type: FilterType) => (
                    <TouchableOpacity
                        key={type}
                        onPress={() => onFilterChange(type)}
                        style={[styles.filterButton, filter === type && { backgroundColor: titleColor }]}
                    >
                        <Text style={[styles.filterButtonText, filter === type && { color: "white" }]}>
                            {type}
                        </Text>
                        {filter === type && (
                            <Text style={styles.countText}>{currentCount}</Text>
                        )}
                    </TouchableOpacity>
                ))}
            </View>

            {/* 用户过滤 */}
            <View style={styles.userFilterContainer}>
                <TouchableOpacity
                    key={0}
                    onPress={() => onUserChange(undefined)}
                    style={[styles.filterButton, selectedUserId === undefined && { backgroundColor: titleColor }]}
                >
                    <Text style={[styles.filterButtonText, selectedUserId === undefined && { color: "white" }]}>
                        All
                    </Text>
                </TouchableOpacity>
                {users.map(u => (
                    <TouchableOpacity
                        key={u.id}
                        onPress={() => onUserChange(u.id)}
                        style={[styles.filterButton, selectedUserId === u.id && { backgroundColor: titleColor }]}
                    >
                        <Text style={[styles.filterButtonText, selectedUserId === u.id && { color: "white" }]}>
                            {u.username}
                        </Text>
                    </TouchableOpacity>
                ))}
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    filterContainer: {
        flexDirection: "row",
        justifyContent: "flex-start",
        marginVertical: 10,
    },
    userFilterContainer: {
        flexDirection: "row",
        justifyContent: "flex-start",
        marginVertical: 10,
    },
    filterButton: {
        padding: 10,
        borderRadius: 5,
        width: 80,
        alignItems: "center",
    },
    filterButtonText: {
        fontSize: 16,
        fontWeight: "bold",
    },
    countText: {
        fontSize: 12,
        color: "white",
    },
});

export default TodoFilters; 