/**
 * Metro 基础包（core）入口：仅引入框架与共享层，供 `scripts/bundle` 打 core.bundle。
 * 真机双包加载时需先执行 core，再执行业务包（见 docs/BUNDLE_SPLIT_NATIVE.md）。
 */
import 'react';
import 'react-native';
import '@react-navigation/native';
import '@react-navigation/native-stack';
import '@reduxjs/toolkit';
import 'react-redux';
import 'redux';

import './utils/api';
import './utils/error';
import './utils/toast';
import './configs/apiConfig';
import './configs/routeConfig';
import './presentation/components/TodoButton';
import './presentation/styles/styles';
import './store';
import './state/store/rootReducer';
import './state/store/hooks';
import './state/context/ThemeProvider';

import {AppRegistry, View} from 'react-native';

AppRegistry.registerComponent('TodosReactNative', () => View);
