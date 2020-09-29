/**
 * title: 并行请求
 * desc: 将有请求的组件单独封装，每一个请求都有独立的状态。
 */

import React, { useCallback, useMemo } from "react";
import { observer } from "mobx-react-lite";
import { Button, message } from 'antd';
import AsyncState from "mobx-async-state";

function deleteUser(userId: string): Promise<{ success: boolean }> {
  console.log(userId);
  return new Promise(resolve => {
    setTimeout(() => {
      resolve({ success: true });
    }, 1000);
  });
}

const DeleteButton = observer(({ id, username }: { id: string, username: string }) => {
  const { run, loading } = useMemo(() => new AsyncState(deleteUser, { autoRun: false }), []);

  const handleDelete = useCallback((sid: string) => {
    run(sid).then((result) => {
      if (result.success) {
        message.success(`Delete user ${username}`);
      }
    });
  }, []);

  return <Button loading={loading} onClick={() => { handleDelete(id) }}>delete {username}</Button>
});

export default () => {
  const users = [{ id: '1', username: 'A' }, { id: '2', username: 'B' }, { id: '3', username: 'C' }];

  return (
    <div>
      <div>You can click all buttons, each request has its own status.</div>
      <ul>
        {users.map((user => (
          <li key={user.id} style={{ marginTop: 8 }}>
            <DeleteButton {...user} />
          </li>
        )))}
      </ul>
    </div>
  );
};
