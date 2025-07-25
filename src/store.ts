// Redux Store 配置
import {configureStore} from "@reduxjs/toolkit";
import rootReducer from "./state/store/rootReducer";
import logger from 'redux-logger';

// Tips：状态层-Store（configureStore）
// 定义：Redux 全局状态容器，由 configureStore 创建，内置 thunk / Immer / DevTools。
// 职责：
// 1. 注册 rootReducer 作为根 reducer；
// 2. 自动集成 redux-thunk 以支持异步 Action；
// 3. 追加自定义中间件（如 redux-logger）。
// 优势：
// • 开箱即用的最佳实践配置，减少手动样板；
// • DevTools 默认启用，调试体验佳；
// • 类型推断友好。

// Tips：状态层-Middleware - redux-logger
// 定义：Redux 中间件，用于在控制台打印 action 与下一状态。
// 职责：
// 1. 拦截每一次 dispatch，输出 prevState -> action -> nextState 调试信息；
// 2. 帮助开发者快速定位状态变更来源。
// 优势：
// • 零配置即可获得详尽日志；
// • 与 DevTools 互补，适合在 RN 或无扩展环境下调试。

// Tips：状态层-Middleware - DevTools
// 定义：Redux DevTools 浏览器扩展或 React Native 调试面板，用于时间旅行、比对 state。
// 职责：
// 1. 记录每一次 action 与对应 state 快照，可回溯时间线；
// 2. 支持导入/导出 state、在不同环境复现问题。
// 优势：
// • configureStore 默认启用，无需额外配置；
// • 图形界面直观展示 state 树，极大提升调试效率。

// Tips：状态层-Middleware - redux-thunk
// 定义：官方异步中间件，允许 dispatch 函数而非普通对象。
// 职责：
// 1. 拦截函数 Action（Thunk），注入 dispatch / getState 执行副作用；
// 2. 支撑 createAsyncThunk 等异步流程，派发生命周期 action。
// 优势：
// • 已由 configureStore 默认集成，无需显式添加；
// • 简单轻量，与 Promise/async-await 自然配合。
const store = configureStore({
    reducer: rootReducer,
    middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(logger),
});

export default store;
