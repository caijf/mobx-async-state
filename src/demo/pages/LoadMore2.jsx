/**
 * title: 上拉加载更多
 */

import React, { useRef, useCallback, useEffect } from 'react';
import { observer } from "mobx-react-lite";
import { Avatar, Button, List } from 'antd';

import LoadMoreState from "../store/LoadMoreState";
import useScrollToLower from "../hooks/useScrollToLower";
import getUserList from "../services/getUserList";

const getUserListState = new LoadMoreState(getUserList, {
  autoRun: false
});

const Footer = observer(() => {
  const { done, loadMore, loading, pagination } = getUserListState;
  return (
    <>
      {done ? <span>No more data</span> : (
        <Button onClick={loadMore} loading={loading}>
          {loading ? 'Loading more' : 'Click to load more'}
        </Button>
      )}

      <span style={{ float: 'right', fontSize: 12 }}>total: {pagination.total}</span>
    </>
  )
});

export default observer(() => {
  const containerRef = useRef(null);
  const { run, data, loading, loadingMore, done, loadMore, reload } = getUserListState;

  useEffect(() => {
    run({ a: 1 });
  }, []);
  console.log('loading:', loading, ' done:', done);
  useScrollToLower({
    ready: !loading && !done,
    onLoad: loadMore,
    ref: containerRef
  });

  return (
    <div ref={containerRef} style={{ height: 300, overflowY: 'auto' }}>
      <List
        header={
          <Button onClick={reload} loading={loading && !loadingMore} disabled={loadingMore}>
            Reload
          </Button>
        }
        footer={<Footer />}
        loading={loading && !loadingMore}
        bordered
        dataSource={data}
        renderItem={item => (
          <List.Item>
            <List.Item.Meta
              avatar={
                <Avatar src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png" />
              }
              title={<a>{item.name}</a>}
              description="rc-hooks is a react hooks library"
            />
          </List.Item>
        )}
      />
    </div>
  );
});
