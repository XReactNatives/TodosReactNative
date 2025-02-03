//API 配置文件
export const apiConfig = {
  production: {
    baseURL: 'https://jsonplaceholder.typicode.com',
  },
  development: {
    baseURL: 'https://mock.typicode.com',
  },

  /**
   * 根据环境获取api配置
   */
  get getConfigByEnv() {
    return process.env.NODE_ENV === 'production'
      ? this.production
      : this.development;
  },
};
