//Todos Reducer
import {
    ADD_TODO,
    DELETE_TODO,
    FETCH_TODOS_REQUEST,
    FETCH_TODOS_SUCCESS,
    FETCH_TODOS_FAILURE,
    MARK_TODO_AS_DONE,
    TOGGLE_SECTION,
} from "./todosTypes.ts";
import type {TodoWithUsername, Section} from "../../../types/ui";
import type {TodoAction} from "./todosTypes.ts";

//Tips：复杂的全局状态管理-redux实现，Todo应用全局状态todos，使用react-redux全局保存
const initialState = {
    sections: [] as Section[],
    loading: false,
    error: null as string | null,
};

//Tip：Reducer的状态处理遵循Redux的基本原则：
//1.动作驱动：所有的状态变化都是由动作（action）驱动的（不可直接修改state）。动作是一个包含type和payload属性（可选）的对象。
//2.不可变性：每次状态更新时，必须返回一个新的状态对象（通过...扩展运算符实现），而不是直接修改现有的状态对象。
//3.纯函数：Reducer必须是纯函数，意味着给定相同的输入（当前动作和状态），它总是返回相同的输出（新的状态），且不产生副作用（不应该执行诸如API调用、修改DOM、或更改输入参数等操作）。
const todosReducer = (state = initialState, action: TodoAction) => {
    switch (action.type) {                                     //动作驱动：变化由action驱动，包含type和payload属性(可选）
        case FETCH_TODOS_REQUEST:
            return {
                ...state,
                loading: true,
                error: null,
            };
        case FETCH_TODOS_SUCCESS:
            return {                                            //不可变性：返回新的状态对象，不直接修改state
                ...state,                                       //...运算符，创建状态的副本
                loading: false,
                sections: action.payload as Section[],
            };
        case FETCH_TODOS_FAILURE:
            return {
                ...state,
                loading: false,
                error: action.payload as string,
            };
        case ADD_TODO:
            const newPayload = action.payload as TodoWithUsername; // 这里确保正确的 payload 类型
            const sectionExists = state.sections.some(section => section.title === newPayload.username);
            return {
                ...state,
                sections: sectionExists
                    ? state.sections.map(section =>
                        section.title === newPayload.username
                            ? {...section, data: [...section.data, newPayload]}
                            : section
                    )
                    : [...state.sections, {title: newPayload.username, data: [newPayload], expanded: true}],
            };
        case DELETE_TODO:
            return {
                ...state,
                sections: state.sections
                    .map(section => ({
                        ...section,
                        data: section.data.filter(todo => todo.id !== action.payload),
                    }))
                    .filter(section => section.data.length > 0), // 删除空的section
            };
        case MARK_TODO_AS_DONE:
            return {
                ...state,
                sections: state.sections.map(section => ({
                    ...section,
                    data: section.data.map(todo =>
                        todo.id === action.payload ? {...todo, completed: true} : todo
                    ),
                })),
            };
        case TOGGLE_SECTION:
            return {
                ...state,
                sections: state.sections.map(section =>
                    section.title === action.payload
                        ? {...section, expanded: !section.expanded}
                        : section
                ),
            };
        default:
            return state;
    }
};

export default todosReducer;
