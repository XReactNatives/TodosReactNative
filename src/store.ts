// Redux Store 配置
import { configureStore } from "@reduxjs/toolkit";
import rootReducer from "./store/rootReducer";

export default configureStore({ reducer: rootReducer });
