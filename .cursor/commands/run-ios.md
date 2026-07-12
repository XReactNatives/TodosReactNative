---
description: 启动 Metro 并在 iOS 模拟器运行
---

1. 若 Metro 未运行，后台启动：`npm start`
2. 运行 iOS：`npm run ios`

首次运行需先 `cd ios && pod install && cd ..`。若报 Mirage/网络相关问题，确认 `apiConfig.baseURL` 指向 `http://localhost:3000`。
