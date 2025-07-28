import { Platform, ToastAndroid, Alert } from 'react-native';

/**
 * 跨平台Toast工具函数
 * @param message - 提示消息
 * @param isSuccess - 是否为成功提示，默认为true
 */
export const showToast = (message: string, isSuccess: boolean = true) => {
    if (Platform.OS === 'android') {
        // Android使用原生Toast
        ToastAndroid.show(message, ToastAndroid.SHORT);
    } else {
        // iOS使用Alert但设置为可取消，减少突兀感
        Alert.alert(
            isSuccess ? 'Success' : 'Error',
            message,
            [{ text: 'OK', style: 'default' }],
            { cancelable: true }
        );
    }
};

/**
 * 成功Toast
 * @param message - 成功消息
 */
export const showSuccessToast = (message: string) => {
    showToast(message, true);
};

/**
 * 错误Toast
 * @param message - 错误消息
 */
export const showErrorToast = (message: string) => {
    showToast(message, false);
};