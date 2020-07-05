/**
 * title: 默认请求
 * desc: 在这个例子中， `AsyncState` 接收了一个异步函数 `getUsername` ，在组件初次加载时， 自动触发该函数执行。同时 `AsyncState` 会自动管理异步请求的 `loading` , `data` , `error` 等状态。
 */

import 'mobx-react-lite/batchingForReactDom';
import React from 'react';
import { observer } from "mobx-react-lite";
import AsyncState from "mobx-async-state";

import getUsername from "../services/getUsername";

const getUsernameState = new AsyncState(getUsername);

export default observer(() => {
  if (getUsernameState.loading) {
    return <div>loading...</div>
  }
  if (getUsernameState.error) {
    return <div>failed to load</div>
  }
  return <div>Username: {getUsernameState.data}</div>
})
