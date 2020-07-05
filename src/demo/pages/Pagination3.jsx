/**
 * title: Ant Table
 */

import React from 'react';
import { observer } from "mobx-react-lite";
import { Button, Table } from 'antd';

import PaginationState from "../store/PaginationState";
import getUserList from "../services/getUserList";

const columns = [
  {
    title: 'name',
    dataIndex: 'name',
  },
  {
    title: 'email',
    dataIndex: 'email',
  },
  {
    title: 'id',
    dataIndex: 'id',
    sorter: true
  },
  {
    title: 'gender',
    dataIndex: 'gender',
    filters: [
      {
        text: 'male',
        value: 'male',
      },
      {
        text: 'female',
        value: 'female',
      },
    ]
  },
];

const getUserListState = new PaginationState(getUserList, {
  defaultPageSize: 5
});

export default observer(() => {
  const { run, refresh, data, loading, pagination, changePagination } = getUserListState;

  return (
    <div>
      <Button onClick={refresh} style={{ marginBottom: 16 }}>刷新</Button>
      <Table
        dataSource={data || []}
        columns={columns}
        pagination={pagination}
        onChange={(page, filters, sorter) => {
          if (page.current === pagination.current && page.pageSize === pagination.pageSize) {
            run({ filters, sorter });
          } else {
            changePagination(page);
          }
        }}
        loading={loading}
        rowKey="id"
        bordered
      />
    </div>
  );
});
