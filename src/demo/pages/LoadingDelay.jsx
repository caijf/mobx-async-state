/**
 * title: Loading Delay
 * desc: 通过设置 `options.loadingDelay` ，可以延迟 `loading` 变成 `true` 的时间，有效防止闪烁。
 */

import React from 'react';
import { observer } from "mobx-react-lite";
import { Spin, Button } from 'antd';
import AsyncState from "mobx-async-state";

import getCurrentTime from "../services/getCurrentTime";

const getCurrentTimeState = new AsyncState(getCurrentTime);
const withLoadingDelayState = new AsyncState(getCurrentTime, {
  loadingDelay: 200
});

export default observer(() => {
  const trigger = () => {
    getCurrentTimeState.run();
    withLoadingDelayState.run();
  }

  return (
    <div>
      <p>loadingDelay can set delay loading, which can effectively prevent loading from flickering.</p>
      <Button onClick={trigger}>
        run
      </Button>

      <div style={{ margin: '24px 0', width: 300 }}>
        <Spin spinning={getCurrentTimeState.loading}>
          Double Count: {getCurrentTimeState.data}
        </Spin>
      </div>
      <div>
        <Spin spinning={withLoadingDelayState.loading}>
          Double Count: {withLoadingDelayState.data}
        </Spin>
      </div>
    </div>
  );
});
