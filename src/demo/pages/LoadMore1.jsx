/**
 * title: 基本用法
 * desc: |
 *    首次加载需通过调用 `run`，并传入查询参数。
 * 
 *    加载下一页 `loadMore` 或 重新加载 `reload` 会自动带入之前参数和分页。
 */

import React, { useEffect } from 'react';
import { observer } from "mobx-react-lite";
import { Button, Spin, List, Typography } from 'antd';

import LoadMoreState from "../store/LoadMoreState";
import getUserList from "../services/getUserList";

const getUserListState = new LoadMoreState(getUserList, {
  defaultPageSize: 5,
  autoRun: false
});

export default observer(() => {
  const { run, data, loading, loadingMore, done, loadMore } = getUserListState;

  useEffect(() => {
    run({ someParams: 1 });
  }, []);

  return (
    <div>
      <Spin spinning={loading && !loadingMore}>
        <List
          dataSource={data}
          renderItem={item => (
            <List.Item key={item.id}>
              <Typography.Text mark>[{item.id}]</Typography.Text> {item.name}
            </List.Item>
          )}
        />
      </Spin>
      <Button
        onClick={() => loadMore()}
        loading={loadingMore}
        disabled={done}
      >
        click to load more
      </Button>
    </div>
  );
});
