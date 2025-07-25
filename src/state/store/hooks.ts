import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux";
import type { RootState, AppDispatch } from "./rootReducer.ts";

// Tips：展示层-Typed Hooks
// 定义：对 React-Redux hooks 的类型安全封装。
// 职责：
// 1. useAppDispatch 返回严格的 AppDispatch 类型，可分发 Thunk。
// 2. useAppSelector 带 RootState 泛型，自动推断选择器返回值。
// 优势：
// • 组件层无须显式声明泛型，减少样板；
// • 集中管理类型变动，提升可维护性。
// 封装一次，避免每个组件分别声明 RootState / AppDispatch 泛型
export const useAppDispatch: () => AppDispatch = useDispatch;
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector; 