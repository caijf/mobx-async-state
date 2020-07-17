import { decorate, observable, computed, action } from "mobx";
import AsyncState from "mobx-async-state";

class LoadMoreState {
  constructor(asyncFn, {
    defaultParams,
    defaultPageSize = 10,
    ...restOptions
  } = {}) {
    // 分页
    this.page = {
      pageNum: 1,
      pageSize: defaultPageSize,
      total: 0
    }
    // 查询条件
    this.params = defaultParams;

    // 数据
    this.data = [];

    // 异步函数实例
    this._async = new AsyncState(asyncFn, {
      ...restOptions,
      autoRun: false,
      onSuccess: (res, params) => {
        // 1. 设置分页和数据
        this.page.total = res.pageInfo ? res.pageInfo.total : 0;
        if (this.page.pageNum === 1) {
          this.data = res.data;
        } else {
          this.data = this.data.concat(res.data);
        }

        if (this.page.pageSize * this.page.pageNum >= this.page.total) {
          this.done = true;
        }

        if (restOptions.onSuccess) {
          restOptions.onSuccess(res, params);
        }
      },
      onError: (err, params) => {
        // 请求失败，如果不是第一页，页码减一
        if (this.page.pageNum > 1) {
          this.page.pageNum -= 1;
        }
        if (restOptions.onError) {
          restOptions.onError(err, params);
        }
      }
    });

    this.run = this.run.bind(this);
    this.loadMore = this.loadMore.bind(this);
    this.reload = this.reload.bind(this);
    this.cancel = this.cancel.bind(this);
    this.destroy = this.destroy.bind(this);

    this.refresh = this.reload;
    this.mutate = this._async.mutate;

    if (typeof restOptions.autoRun === 'undefined' || restOptions.autoRun) {
      this.run(defaultParams);
    }
  }

  get loading() {
    return this._async.loading;
  }
  get loadingMore() {
    return this.loading && this.page.pageNum !== 1;
  }
  get error() {
    return this._async.error;
  }
  get pagination() {
    const { pageNum, ...restPage } = this.page;
    return {
      current: pageNum,
      ...restPage
    };
  }
  // 传入参数，发起请求
  run(params) {
    this.params = params;
    const { pageNum, pageSize } = this.page;

    // 2. 传入参数，发起请求
    this._async.run({
      page: { pageNum, pageSize },
      data: this.params
    });
  }
  // 请求下一页
  loadMore() {
    if (this.done || this.loading) {
      return;
    }
    this.page.pageNum += 1;
    this.run(this.params);
  }
  // 重置到第一页，发起请求
  reload() {
    this.done = false;
    this.cancel();
    this.page.pageNum = 1;
    this.run(this.params);
  }
  cancel() {
    if (this.loading && this.page.pageNum > 1) {
      this.page.pageNum -= 1;
    }
    this._async.cancel();
  }
  destroy() {
    this.cancel()
    this._async.destroy();
  }
}

export default decorate(LoadMoreState, {
  page: observable,
  done: observable,
  loading: computed,
  loadingMore: computed,
  pagination: computed,
  error: computed,
  loadMore: action,
  reload: action
});