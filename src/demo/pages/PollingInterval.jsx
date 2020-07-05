/**
 * title: 轮询
 * desc: |
 *  通过设置 `options.pollingInterval` ，进入轮询模式，定时触发函数执行。
 *
 *  - 通过设置 `options.pollingWhenHidden=false` ，在屏幕不可见时，暂时暂停定时任务。
 *  - 通过 `run` / `cancel` 来 开启/停止 轮询。
 *  - 在 `options.autoRun=false` 时，需要第一次执行 `run` 后，才开始轮询。
 */

import React from 'react';
import { observer } from "mobx-react-lite";
import { Button, Spin } from 'antd';
import AsyncState from "mobx-async-state";

import getUsername from "../services/getUsername";

const getUsernameState = new AsyncState(getUsername, {
  pollingInterval: 1000,
  pollingWhenHidden: false
});

export default observer(() => {
  return (
    <>
      <Spin spinning={getUsernameState.loading}>
        <p>Username: {getUsernameState.data}</p>
      </Spin>
      <Button.Group>
        <Button onClick={getUsernameState.run}>start</Button>
        <Button onClick={getUsernameState.cancel}>stop</Button>
      </Button.Group>
    </>
  )
});
