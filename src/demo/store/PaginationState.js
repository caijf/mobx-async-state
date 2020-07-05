import { decorate, observable, computed } from "mobx";
import AsyncState from "mobx-async-state";

const showTotal = num => `共 ${num} 条数据`;

class PaginationState {
  constructor(asyncFn, {
    defaultPageNum = 1,
    defaultPageSize = 10,
    defaultTotal = 10,
    defaultParams,
    ...restOptions
  } = {}) {
    // 分页
    this.page = {
      pageNum: defaultPageNum,
      pageSize: defaultPageSize,
      total: defaultTotal
    }

    // 查询条件
    this.params = defaultParams;

    // 异步函数实例
    this._async = new AsyncState(asyncFn, {
      ...restOptions,
      autoRun: false,
      onSuccess: (res, params) => {
        // 1. 设置分页
        this.page.total = res.pageInfo ? res.pageInfo.total : 0;

        if (restOptions.onSuccess) {
          restOptions.onSuccess(res, params)
        }
      }
    });

    this.refresh = this._async.refresh;
    this.mutate = this._async.mutate;
    this.cancel = this._async.cancel;
    this.destroy = this._async.destroy;
    this.changePagination = this.changePagination.bind(this);
    this.run = this.run.bind(this);

    if (typeof restOptions.autoRun === 'undefined' || restOptions.autoRun) {
      this.run();
    }
  }

  run(params) {
    // 如果查询参数变化，重置分页 和 参数
    if (params) {
      this.params = params;
      this.page.pageNum = 1;
    }

    const { pageNum, pageSize } = this.page;

    // 2. 传入参数，发起请求
    this._async.run({
      page: { pageSize, pageNum },
      data: this.params
    });
  }

  // 监听分页变化
  changePagination({ pageSize, current }) {
    this.page = {
      ...this.page,
      pageSize,
      pageNum: current
    };
    this.run();
  }

  get loading(){
    return this._async.loading;
  }
  get error(){
    return this._async.error;
  }
  get data(){
    // 3. 处理返回数据
    return this._async.data ? this._async.data.data : [];
  }
  get pagination() {
    const { total, pageNum, pageSize } = this.page;
    return {
      total,
      current: pageNum,
      pageSize,
      showTotal,
      showSizeChanger: true
    }
  }
}

export default decorate(PaginationState, {
  page: observable,
  data: computed,
  error: computed,
  loading: computed,
  pagination: computed,
});
