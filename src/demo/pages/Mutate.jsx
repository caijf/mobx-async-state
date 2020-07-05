/**
 * title: 突变
 * desc: 你可以通过 `mutate` ，直接修改 `data` 。 `mutate` 函数参数可以为 `newData` 或 `(oldData)=> newData` 。
 */

import React, { useState, useCallback, useEffect } from 'react';
import { observer } from "mobx-react-lite";
import { Button, Input, message } from 'antd';
import AsyncState from "mobx-async-state";

import getUsername from "../services/getUsername";
import changeUsername from "../services/changeUsername";

const getUsernameState = new AsyncState(getUsername, {
  autoRun: false
});
const changeUsernameState = new AsyncState(changeUsername, {
  autoRun: false
});

export default observer(() => {
  const [state, setState] = useState('');

  useEffect(() => {
    getUsernameState.run().then(result => {
      setState(result);
    });
  }, []);

  const handleChangeUsername = useCallback((name) => {
    changeUsernameState.run(name).then((result) => {
      if (result.success) {
        getUsernameState.mutate(changeUsernameState.params[0]);
        message.success(`The username was changed to "${changeUsernameState.params[0]}" !`);
      }
    });
  }, []);

  return (
    <div>
      <p>usrename: {getUsernameState.data}</p>
      <Input
        onChange={e => setState(e.target.value)}
        value={state}
        placeholder="Please enter username"
        style={{ width: 240, marginRight: 16 }}
      />
      <Button onClick={() => handleChangeUsername(state)} loading={changeUsernameState.loading}>
        Edit
      </Button>
    </div>
  );
});
