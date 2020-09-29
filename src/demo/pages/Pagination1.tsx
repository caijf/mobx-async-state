/**
 * title: 普通分页
 */

import React from 'react';
import { observer } from 'mobx-react-lite';
import { List, Pagination } from 'antd';

import PaginationState from "../store/PaginationState";
import getUserList from "../services/getUserList";

const getUserListState = new PaginationState(getUserList);

export default observer(() => {
  const { data, loading, pagination, changePagination } = getUserListState;

  return (
    <div>
      <List
        dataSource={data || []}
        loading={loading}
        renderItem={(item: any) => (
          <List.Item>
            {item.name} - {item.email}
          </List.Item>
        )}
      />
      <Pagination
        {...pagination}
        onChange={(current, pageSize) => changePagination({ current, pageSize })}
        onShowSizeChange={(current, pageSize) => changePagination({ current, pageSize })}
        style={{ marginTop: 16, textAlign: 'right' }}
      />
    </div>
  );
});
