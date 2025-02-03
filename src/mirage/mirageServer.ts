import {createServer, Model, Response} from 'miragejs';

import {apiConfig} from '../config/apiConfig';

const todosApiUrl = `${apiConfig.getConfigByEnv.baseURL}/todos`;
const usersApiUrl = `${apiConfig.getConfigByEnv.baseURL}/users`;

export function makeServer({environment = 'development'} = {}) {
  return createServer({
    environment,

    models: {
      todo: Model,
      user: Model,
    },

    seeds(server) {
      //FIXME id为什么总是默认是string类型？？
      server.create('todo', {
        userId: 1,
        id: 1,
        title: 'delectus aut autem1111',
        completed: false,
      });
      server.create('todo', {
        userId: 1,
        id: 2,
        title: 'quis ut nam facilis et officia qui',
        completed: false,
      });

      server.create('user', {
        id: 1,
        name: 'Leanne Graham',
        username: 'Bret',
        email: 'Sincere@april.biz',
        address: {
          street: 'Kulas Light',
          suite: 'Apt. 556',
          city: 'Gwenborough',
          zipcode: '92998-3874',
          geo: {lat: '-37.3159', lng: '81.1496'},
        },
        phone: '1-770-736-8031 x56442',
        website: 'hildegard.org',
        company: {
          name: 'Romaguera-Crona',
          catchPhrase: 'Multi-layered client-server neural-net',
          bs: 'harness real-time e-markets',
        },
      });
    },

    routes() {
      this.namespace = '';
      // this.timing = 10000;//全局延时

      //成功返回
      // this.get(todosApiUrl, schema => {
      //   return schema.todos.all().models; //默认会返回200和数据
      // });

      //失败返回
      // this.get(todosApiUrl, _ => {
      //   return new Response(404, {}, {error: ['Internal Server Error']}); // 返回500 错误
      // });

      //单独延时返回
      this.get(
        todosApiUrl,
        schema => {
          return schema.todos.all().models;
        },
        {timing: 4000},
      );

      // this.get(usersApiUrl, schema => {
      //   return schema.users.all().models;
      // });

      this.get(usersApiUrl, _ => {
        return new Response(404, {}, {error: ['Internal Server Error']}); // 返回500 错误
      });

      this.get(
        usersApiUrl,
        schema => {
          return schema.users.all().models;
        },
        {timing: 4000},
      );
    },
  });
}
