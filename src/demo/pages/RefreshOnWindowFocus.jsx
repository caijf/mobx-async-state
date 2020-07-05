/**
 * title: 屏幕聚焦重新请求
 * desc: 如果你设置了 `options.refreshOnWindowFocus = true` ，则在浏览器窗口 `refocus` 和 `revisible` 时，会重新发起请求。你可以通过设置 `options.focusTimespan` 来设置请求间隔，默认为 `5000ms` 。
 */

import React from 'react';
import { observer } from "mobx-react-lite";
import { Spin } from 'antd';
import AsyncState from "mobx-async-state";

import getUsername from "../services/getUsername";

const getUsernameState = new AsyncState(getUsername, {
  refreshOnWindowFocus: true
});

export default observer(() => {
  return (
    <div>
      <p>You can try to click elsewhere and click back to try. (Or hide the page and show it again)</p>
      <Spin spinning={getUsernameState.loading}>
        <div>Username: {getUsernameState.data}</div>
      </Spin>
    </div>
  )
});
