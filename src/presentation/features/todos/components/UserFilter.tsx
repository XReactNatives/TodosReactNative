import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { useAppSelector } from "../../../../state/store/hooks";

// 类型定义：UserFilter组件的Props
interface UserFilterProps {
    selectedUserId: number | undefined;
    onUserChange: (userId: number | undefined) => void;
    titleColor: string;
}

/**
 * Tips：组件拆分原则和思路 - UserFilter
 * 
 * 组件拆分原则：
 * 
 * 1. 单一职责原则
 *    - UserFilter只负责用户过滤功能的UI和交互
 *    - 处理All/User1/User2等用户选择的过滤
 *    - 直接订阅Redux中的users状态，UI状态通过props传递
 * 
 * 2. 可复用性原则
 *    - 可在其他需要用户过滤的页面复用
 *    - 通过props传递UI状态，直接订阅Redux业务状态
 *    - 组件接口清晰，适应不同的用户过滤需求
 * 
 * 3. 可测试性原则
 *    - 组件行为可预测，易于单元测试
 *    - 通过props注入UI状态，Mock Redux业务状态
 *    - 可以轻松Mock不同的用户过滤场景
 * 
 * 4. 可维护性原则
 *    - 组件结构清晰，易于理解和修改
 *    - 用户过滤逻辑集中，便于调试
 *    - 样式与逻辑分离，便于UI调整
 * 
 * 5. 性能优化原则
 *    - 只订阅需要的业务状态，UI状态通过props传递
 *    - 用户过滤条件变化时只重新渲染必要的部分
 *    - 按钮点击事件处理简单高效
 * 
 * 优势：
 * • 组件职责明确，只处理用户过滤逻辑
 * • 直接订阅Redux中的users状态，减少props传递
 * • 便于独立测试，提高代码质量
 * • 组件间耦合度低，修改影响范围小
 */
const UserFilter: React.FC<UserFilterProps> = ({
    selectedUserId,
    onUserChange,
    titleColor,
}) => {
    // 直接订阅Redux中的users状态
    const users = useAppSelector(state => state.todos.users);

    return (
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
    );
};

const styles = StyleSheet.create({
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
});

export default UserFilter; 