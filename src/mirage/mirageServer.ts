import {createServer, Model} from 'miragejs';

import {apiConfig} from '../configs/apiConfig';

const todosApiUrl = `${apiConfig.baseURL}/todos`;
const usersApiUrl = `${apiConfig.baseURL}/users`;

export function makeServer({environment = 'development'} = {}) {
  return createServer({
    environment,

    models: {
      todo: Model,
      user: Model,
    },

    seeds(server) {
      server.create('todo', {
        userId: 1,
        id: '1',
        title: 'user1 todo1 title',
        completed: false,
      });
      server.create('todo', {
        userId: 1,
        id: '2',
        title: 'user1 todo2 title',
        completed: true,
      });

      server.create('todo', {
        userId: 2,
        id: '3',
        title: 'user2 todo1 title',
        completed: true,
      });

      server.create('todo', {
        userId: 2,
        id: '4',
        title: 'user2 todo2 title',
        completed: false,
      });

      server.create('user', {
        id: '1',
        name: 'Leanne Graham',
        username: 'user1',
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

      server.create('user', {
        id: '2',
        name: 'Leanne Graham2222',
        username: 'user2',
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
        (schema) => {
          return schema.todos.all().models;
        },
        {timing: 1000},
      );

      // 新增：PATCH /todos/:id 接口 - 用于切换todo状态
      this.patch(
        `${todosApiUrl}/:id`,
        (schema, request) => {
          const { id } = request.params;
          const { completed } = JSON.parse(request.requestBody);

          const todo = schema.todos.find(id);
          if (!todo) {
            return new Response(404, {}, { error: "Todo not found" });
          }

          // 更新todo状态
          todo.update({ completed });

          return {
            success: true,
            todo: todo.attrs
          };
        },
        { timing: 500 } // 模拟网络延迟
      );

      // 新增：DELETE /todos/:id 接口 - 用于删除todo
      this.delete(
        `${todosApiUrl}/:id`,
        (schema, request) => {
          const { id } = request.params;

          const todo = schema.todos.find(id);
          if (!todo) {
            return new Response(404, {}, { error: "Todo not found" });
          }

          // 删除todo
          todo.destroy();

          return {
            success: true,
            message: "Todo deleted successfully"
          };
        },
        { timing: 500 } // 模拟网络延迟
      );

      // 新增：POST /todos 接口 - 用于添加todo
      this.post(
        todosApiUrl,
        (schema, request) => {
          const { title, username, completed = false } = JSON.parse(request.requestBody);
          
          // 查找或创建用户
          let user = schema.users.findBy({ username });
          if (!user) {
            // 创建新用户
            user = schema.users.create({
              id: String(schema.users.all().models.length + 1),
              name: username,
              username: username,
              email: `${username}@example.com`,
              address: {
                street: 'Unknown',
                suite: 'Unknown',
                city: 'Unknown',
                zipcode: '00000',
                geo: {lat: '0', lng: '0'},
              },
              phone: '000-000-0000',
              website: 'example.com',
              company: {
                name: 'Unknown',
                catchPhrase: 'Unknown',
                bs: 'Unknown',
              },
            });
          }
          
          // 创建新todo，使用用户的id
          const newTodo = schema.todos.create({
            title,
            userId: Number(user.id),
            completed
          });

          // 返回包含用户名的完整数据
          return {
            success: true,
            todo: {
              ...newTodo.attrs,
              username: user.username // 添加用户名信息
            }
          };
        },
        { timing: 500 } // 模拟网络延迟
      );

      // this.get(usersApiUrl, schema => {
      //   return schema.users.all().models;
      // });

      // this.get(usersApiUrl, _ => {
      //   return new Response(404, {}, {error: ['Internal Server Error']}); // 返回500 错误
      // });

      this.get(
        usersApiUrl,
        schema => {
          return schema.users.all().models;
        },
        {timing: 1000},
      );
    },
  });
}
