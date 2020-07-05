/**
 * title: 防抖
 * desc: 通过设置 `options.debounceInterval` ，则进入防抖模式。此时如果频繁触发 `run` ，则会以防抖策略进行请求。
 */

import React from 'react';
import { observer } from 'mobx-react-lite';
import { Select } from 'antd';
import AsyncState from "mobx-async-state";

import getEmail from "../services/getEmail";

const { Option } = Select;

const getEmailState = new AsyncState(getEmail, {
  debounceInterval: 500,
  autoRun: false
});

export default observer(() => {
  const { data, run, loading, cancel } = getEmailState;

  return (
    <div>
      <p>Enter quickly to see the effect</p>
      <Select
        showSearch
        placeholder="Select Emails"
        filterOption={false}
        onSearch={run}
        onBlur={cancel}
        loading={loading}
        style={{ width: 300 }}
      >
        {data && data.map(i => <Option key={i}>{i}</Option>)}
      </Select>
    </div>
  );
});
