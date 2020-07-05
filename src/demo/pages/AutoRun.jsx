/**
 * title: 手动触发
 * desc: 通过设置 `options.autoRun = false` , 则需要手动调用 `run` 时才会触发执行异步函数。
 */

import 'mobx-react-lite/batchingForReactDom';
import React, { useState, useCallback } from 'react';
import { observer } from "mobx-react-lite";
import { Button, Input, message } from 'antd';
import AsyncState from "mobx-async-state";

import changeUsername from "../services/changeUsername";

const changeUsernameState = new AsyncState(changeUsername, {
  autoRun: false
});

export default observer(() => {
  const [state, setState] = useState('');
  const { run, loading } = changeUsernameState;

  const handleClick = useCallback((val) => {
    run(val).then((result) => {
      if (result.success) {
        setState('');
        message.success(`The username was changed to "${changeUsernameState.params[0]}" !`);
      }
    });
  }, []);

  return (
    <div>
      <Input
        onChange={e => setState(e.target.value)}
        value={state}
        placeholder="Please enter username"
        style={{ width: 240, marginRight: 16 }}
      />
      <Button onClick={() => handleClick(state)} loading={loading}>
        Edit
      </Button>
    </div>
  );
});

