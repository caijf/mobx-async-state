/**
 * title: 节流
 * desc: 通过设置 `options.throttleInterval` ，则进入节流模式。此时如果频繁触发 `run` ，则会以节流策略进行请求。
 */

import React from 'react';
import { observer } from 'mobx-react-lite';
import { Select } from 'antd';
import AsyncState from "mobx-async-state";

import getEmail from "../services/getEmail";

const { Option } = Select;

const getEmailState = new AsyncState(getEmail, {
  throttleInterval: 1000,
  autoRun: false
});

export default observer(() => {
  return (
    <div>
      <p>Enter quickly to see the effect</p>
      <Select
        showSearch
        placeholder="Select Emails"
        filterOption={false}
        onSearch={getEmailState.run}
        onBlur={getEmailState.cancel}
        loading={getEmailState.loading}
        style={{ width: 300 }}
      >
        {getEmailState.data && getEmailState.data.map(i => <Option key={i}>{i}</Option>)}
      </Select>
    </div>
  );
});
