/* eslint-disable @typescript-eslint/ban-ts-comment */
// @ts-nocheck — miragejs 类型声明中 get/patch/delete/post 的 HandlerOptions 三参数与 Schema 方法签名与运行时不一致
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
      type RouteWithOpts = (path: string, h: (s: unknown, r?: unknown) => unknown, opts?: { timing?: number }) => void;
      const getWithOpts: RouteWithOpts = (path, h, opts) => { (this as { get(path: string, handler?: unknown, options?: unknown): void }).get(path, h, opts); };
      const patchWithOpts: RouteWithOpts = (path, h, opts) => { (this as { patch(path: string, handler?: unknown, options?: unknown): void }).patch(path, h, opts); };
      const deleteWithOpts: RouteWithOpts = (path, h, opts) => { (this as { delete(path: string, handler?: unknown, options?: unknown): void }).delete(path, h, opts); };
      const postWithOpts: RouteWithOpts = (path, h, opts) => { (this as { post(path: string, handler?: unknown, options?: unknown): void }).post(path, h, opts); };
      getWithOpts(todosApiUrl, (schema) => (schema as { all(type: string): { models: unknown[] } }).all('todo').models, { timing: 1000 });
      getWithOpts(`${todosApiUrl}/:id`, (schema, request) => {
        const s = schema as { find(type: string, id: string): { attrs: { userId?: number } } | null };
        const id = (request as { params: { id: string } }).params.id;
        const todo = s.find('todo', id);
        if (!todo) return new Response(404, {}, { error: "Todo not found" });
        const user = (schema as { find(type: string, id: string): { attrs: { username: string } } | null }).find('user', String(todo.attrs.userId));
        if (!user) return new Response(404, {}, { error: "User not found" });
        return { ...todo.attrs, username: user.attrs.username };
      }, { timing: 500 });
      patchWithOpts(`${todosApiUrl}/:id`, (schema, request) => {
        const s = schema as { find(type: string, id: string): { attrs: Record<string, unknown>; update(attrs: unknown): void } | null };
        const id = (request as { params: { id: string }; requestBody: string }).params.id;
        const { completed } = JSON.parse((request as { requestBody: string }).requestBody);
        const todo = s.find('todo', id);
        if (!todo) return new Response(404, {}, { error: "Todo not found" });
        todo.update({ completed });
        return { success: true, todo: todo.attrs };
      }, { timing: 500 });
      deleteWithOpts(`${todosApiUrl}/:id`, (schema, request) => {
        const s = schema as { find(type: string, id: string): { destroy(): void } | null };
        const id = (request as { params: { id: string } }).params.id;
        const todo = s.find('todo', id);
        if (!todo) return new Response(404, {}, { error: "Todo not found" });
        todo.destroy();
        return { success: true, message: "Todo deleted successfully" };
      }, { timing: 500 });
      postWithOpts(todosApiUrl, (schema, request) => {
        const s = schema as { findBy(type: string, attrs: Record<string, unknown>): { attrs: { id: string; username: string } } | null; all(type: string): { models: unknown[] }; create(type: string, attrs: Record<string, unknown>): { attrs: { id: string; username: string } } };
        const { title, username, completed = false } = JSON.parse((request as { requestBody: string }).requestBody);
        let user = s.findBy('user', { username });
        if (!user) {
          user = s.create('user', { id: String(s.all('user').models.length + 1), name: username, username, email: `${username}@example.com`, address: { street: 'Unknown', suite: 'Unknown', city: 'Unknown', zipcode: '00000', geo: { lat: '0', lng: '0' } }, phone: '000-000-0000', website: 'example.com', company: { name: 'Unknown', catchPhrase: 'Unknown', bs: 'Unknown' } });
        }
        const newTodo = (schema as { create(type: string, attrs: Record<string, unknown>): { attrs: Record<string, unknown> } }).create('todo', { title, userId: Number(user.attrs.id), completed });
        return { success: true, todo: { ...newTodo.attrs, username: user.attrs.username } };
      }, { timing: 500 });
      getWithOpts(usersApiUrl, (schema) => (schema as { all(type: string): { models: unknown[] } }).all('user').models, { timing: 1000 });
    },
  });
}
