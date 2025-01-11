// Redux Store 配置
import {configureStore} from "@reduxjs/toolkit";
import rootReducer from "./store/rootReducer";
import logger from 'redux-logger';

const store = configureStore({
    reducer: rootReducer,
    middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(logger),
});

export default store;