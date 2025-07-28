import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { useAppSelector } from "../../../../state/store/hooks";
import { FilterTypes, type FilterType } from "../../../../type/ui/filter";
import { selectFilterCount } from "../../../../state/store/todos/todosSelectors";

// 类型定义：StatusFilter组件的Props
interface StatusFilterProps {
    filter: FilterType;
    onFilterChange: (filter: FilterType) => void;
    titleColor: string;
}

/**
 * Tips：组件拆分原则和思路 - StatusFilter
 * 
 * 组件拆分原则：
 * 
 * 1. 单一职责原则
 *    - StatusFilter只负责状态过滤功能的UI和交互
 *    - 处理All/Active/Completed三种状态的过滤
 *    - 通过props接收UI状态，直接订阅Redux业务状态
 * 
 * 2. 可复用性原则
 *    - 可在其他需要状态过滤的页面复用
 *    - 通过props传递UI状态，直接订阅Redux业务状态
 *    - 组件接口清晰，适应不同的状态过滤需求
 * 
 * 3. 可测试性原则
 *    - 组件行为可预测，易于单元测试
 *    - 通过props注入UI状态，Mock Redux业务状态
 *    - 可以轻松Mock不同的状态过滤场景
 * 
 * 4. 可维护性原则
 *    - 组件结构清晰，易于理解和修改
 *    - 状态过滤逻辑集中，便于调试
 *    - 样式与逻辑分离，便于UI调整
 * 
 * 5. 性能优化原则
 *    - 只订阅需要的业务状态，UI状态通过props传递
 *    - 状态过滤条件变化时只重新渲染必要的部分
 *    - 按钮点击事件处理简单高效
 * 
 * 优势：
 * • 组件职责明确，只处理状态过滤逻辑
 * • UI状态通过props传递，业务状态直接订阅
 * • 便于独立测试，提高代码质量
 * • 组件间耦合度低，修改影响范围小
 */
const StatusFilter: React.FC<StatusFilterProps> = ({
    filter,
    onFilterChange,
    titleColor,
}) => {
    // 直接订阅currentCount
    const currentCount = useAppSelector(state => selectFilterCount(state, filter));

    return (
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
    );
};

const styles = StyleSheet.create({
    filterContainer: {
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

export default StatusFilter; 