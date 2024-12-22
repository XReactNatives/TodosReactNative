// `store.ts`
import { createStore } from 'redux';

// 定义初始状态
interface State {
  // 在此处定义状态的类型
}

const initialState: State = {};

// 创建 Reducer
const reducer = (state = initialState, action: { type: string }) => {
  switch (action.type) {
    // 处理不同的 action
    default:
      return state;
  }
};

// 创建 Redux 存储
const store = createStore(reducer);

export default store;