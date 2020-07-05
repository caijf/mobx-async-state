/**
 * title: 查询表单和Ant Table
 */

import React, { useCallback } from 'react';
import { observer } from "mobx-react-lite";
import { Form, Input, Select, Button, Table } from 'antd';

import PaginationState from "../store/PaginationState";
import getUserList from "../services/getUserList";

const formItemLayout = {
  labelCol: { span: 4 },
  wrapperCol: { span: 14 },
};

const buttonItemLayout = {
  wrapperCol: { offset: 4, span: 14 },
};

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
    dataIndex: 'id'
  },
  {
    title: 'gender',
    dataIndex: 'gender'
  },
];

const getUserListState = new PaginationState(getUserList);

export default observer(() => {
  const { run, refresh, data, loading, pagination, changePagination } = getUserListState;

  const [form] = Form.useForm();

  const handleReset = useCallback(() => {
    form.resetFields();
    run(form.getFieldsValue())
  }, []);

  return (
    <div>
      <Form
        {...formItemLayout}
        form={form}
        initialValues={{}}
        onFinish={run}
      >
        <Form.Item label="name" name="name">
          <Input placeholder="请输入" />
        </Form.Item>
        <Form.Item label="gender" name="gender">
          <Select placeholder="请选择">
            <Select.Option value="male">male</Select.Option>
            <Select.Option value="female">female</Select.Option>
          </Select>
        </Form.Item>
        <Form.Item {...buttonItemLayout}>
          <Button type="primary" htmlType="submit" loading={loading}>查询</Button>
          <Button onClick={handleReset} style={{ marginLeft: 16 }} disabled={loading}>重置</Button>
          <Button onClick={refresh} style={{ marginLeft: 16 }} disabled={loading}>刷新</Button>
        </Form.Item>
      </Form>
      <Table
        dataSource={data || []}
        columns={columns}
        pagination={pagination}
        onChange={changePagination}
        loading={loading}
        rowKey="id"
        bordered
      />
    </div>
  );
});
