import { useEffect, useState, useRef } from "react";
import { useAppDispatch, useAppSelector } from "../../../../state/store/hooks";
import { fetchTodosAsync, fetchUsersAsync } from "../../../../state/store/todos/todosThunks";
import { selectLoading, selectError, selectFilteredSections, selectFilterCount } from "../../../../state/store/todos/todosSelectors";
import { FilterType } from "../../../../type/ui/filter";

// 类型定义：useTodoList Hook的返回类型
interface UseTodoListReturn {
    // 状态
    filter: FilterType;
    userId: number | undefined;
    currentCount: number;
    users: Array<{
        id: number;
        username: string;
        name: string;
    }>;
    sections: Array<{
        title: string;
        data: Array<{
            id: number;
            username: string;
            title: string;
            completed: boolean;
        }>;
        expanded: boolean;
    }>;
    loading: boolean;
    error: string | null;
    // 方法
    setFilter: (filter: FilterType) => void;
    setUserId: (userId: number | undefined) => void;
}

/**
 * Tips：自定义Hook - useTodoList
 * 
 * 状态管理原则和思路：
 * 
 * 1. 状态分层原则
 *    - 全局状态（Redux）：todos数据、users数据、loading/error状态
 *    - 组件状态（useState）：UI交互状态（filter、userId）
 *    - 临时状态（useRef）：初始化标志位
 * 
 * 2. 状态订阅原则
 *    - 组件只订阅需要的状态，避免不必要的重渲染
 *    - 使用selector进行状态选择，提高性能
 *    - 状态变更通过明确的接口进行
 * 
 * 3. 状态更新原则
 *    - 异步操作通过Thunk进行，保持Reducer纯净
 *    - 同步状态变更通过useState进行
 *    - 避免在组件中直接操作全局状态
 * 
 * 4. 状态初始化原则
 *    - 使用useRef避免初始化时的重复请求
 *    - 确保数据依赖关系正确（先加载users，再加载todos）
 *    - 错误处理统一在Slice层处理
 * 
 * 优势：
 * • 业务逻辑与UI解耦，便于测试和复用
 * • 状态管理逻辑集中，易于维护
 * • 组件职责单一，只关注UI渲染
 * • 状态变更逻辑清晰，便于调试
 */
export const useTodoList = (): UseTodoListReturn => {
    const dispatch = useAppDispatch();
    
    // 组件状态：UI交互相关的状态
    const [filter, setFilter] = useState<FilterType>("All");
    const [userId, setUserId] = useState<number | undefined>(undefined);
    
    // 临时状态：避免初始化时的重复请求
    const isInitializedRef = useRef(false);

    // 全局状态订阅：只订阅组件需要的状态
    const currentCount = useAppSelector((s) => selectFilterCount(s, filter));
    const users = useAppSelector(state => state.todos.users);
    const sections = useAppSelector(state => selectFilteredSections(state, filter));
    const loading = useAppSelector(selectLoading);
    const error = useAppSelector(selectError);

    // 初始化逻辑：确保数据依赖关系正确
    useEffect(() => {
        dispatch(fetchUsersAsync())
            .unwrap()
            .then(() => dispatch(fetchTodosAsync(undefined)))
            .then(() => {
                isInitializedRef.current = true;
            })
            .catch(() => {}); // 错误已由 slice 处理
    }, [dispatch]);

    // 用户过滤逻辑：响应userId变化，重新获取数据
    useEffect(() => {
        if (isInitializedRef.current) {
            dispatch(fetchTodosAsync(userId));
        }
    }, [dispatch, userId]);

    return {
        // 状态
        filter,
        userId,
        currentCount,
        users,
        sections,
        loading,
        error,
        // 方法：提供明确的接口进行状态变更
        setFilter,
        setUserId,
    };
}; 