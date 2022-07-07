import { decorate, observable, computed, action, runInAction, toJS } from "mobx";
import { getCache, setCache } from "./utils/cache";
import { isDocumentVisible } from './utils';
import subscribeFocus from './utils/windowFocus';
import subscribeVisible from './utils/windowVisible';
import debounce from './utils/debounce';
import throttle from './utils/throttle';

const noop = () => { };

/**
 * mobx 异步函数的状态管理
 */
class AsyncState {
  /**
   * 创建一个mobx异步函数管理，自动观察 loading data error 数据。
   * 
   * @param {Promise<any>} asyncFn - 异步函数
   * @param {object} options - 配置项
   */
  constructor(asyncFn, options = {}) {
    // 异步函数
    this.asyncFn = asyncFn;

    // 配置项
    this.options = {
      defaultParams: [],
      defaultLoading: false,
      // initialData,
      onSuccess: noop,
      onError: noop,
      autoRun: true,
      // formatResult,
      cacheKey: '',
      cacheTime: 5 * 60 * 1000,
      pollingInterval: 0,
      pollingWhenHidden: true,
      refreshOnWindowFocus: false,
      focusTimespan: 5000,
      // loadingDelay,
      // debounceInterval,
      // throttleInterval,
      ...options
    };

    const { defaultParams, defaultLoading, initialData, cacheKey, debounceInterval, throttleInterval, focusTimespan, pollingInterval, refreshOnWindowFocus } = this.options;

    // 计数，用于防止多次请求倒置问题
    this.__requestCount = 0;

    // 参数
    this.params = Array.isArray(defaultParams) ? defaultParams : (defaultParams ? [defaultParams] : []);

    // 返回值
    this.originData = cacheKey ? getCache(cacheKey) : initialData;

    // 错误
    this.originError = null;

    // 标识正在执行
    this.loading = defaultLoading;

    // 防抖运行
    this.debounceRun = debounceInterval ? debounce(this._run.bind(this), debounceInterval) : undefined;

    // 节流运行
    this.throttleRun = throttleInterval ? throttle(this._run.bind(this), throttleInterval) : undefined;

    // 轮询定时器
    this.pollingTimer = null;

    // 视窗获取焦点标识触发轮询标识
    this.pollingWhenVisibleFlag = false;

    // 延迟loading定时器
    this.loadingDelayTimer = null;

    // 取消订阅集合
    this.unsubscribe = [];

    // 订阅页面显示时轮询
    if (pollingInterval) {
      this.unsubscribe.push(subscribeVisible(this.rePolling.bind(this)));
    }

    // 订阅屏幕聚焦时请求
    if (refreshOnWindowFocus) {
      const throttleRefresh = throttle(this.refresh.bind(this), focusTimespan);
      this.unsubscribe.push(subscribeFocus(throttleRefresh));
    }

    this._run = this._run.bind(this);
    this.run = this.run.bind(this);
    this.cancel = this.cancel.bind(this);
    this.rePolling = this.rePolling.bind(this);
    this.mutate = this.mutate.bind(this);
    this.refresh = this.refresh.bind(this);
    this.destroy = this.destroy.bind(this);

    // 自动执行
    if (this.options.autoRun) {
      this.run(...this.params);
    }
  }

  // 转换data
  get data() {
    return toJS(this.originData);
  }

  // 转换error
  get error() {
    return toJS(this.originError);
  }

  // 重启轮询
  rePolling() {
    if (this.pollingWhenVisibleFlag) {
      this.pollingWhenVisibleFlag = false;
      this.refresh();
    }
  }

  // 触发异步函数
  run(...args) {
    if (this.debounceRun) {
      this.debounceRun(...args);
      return Promise.resolve(null);
    }

    if (this.throttleRun) {
      this.throttleRun(...args);
      return Promise.resolve(null);
    }

    this.__requestCount += 1;
    return this._run(...args);
  }

  _run(...args) {
    const { loadingDelay, formatResult, cacheKey, cacheTime, onSuccess, onError, pollingInterval, pollingWhenHidden } = this.options;

    // 取消轮询定时器
    if (this.pollingTimer) {
      clearTimeout(this.pollingTimer);
    }

    // 取消延迟loading
    if (this.loadingDelayTimer) {
      clearTimeout(this.loadingDelayTimer);
    }

    const currentCount = this.__requestCount;

    this.params = args;
    this.loading = !loadingDelay;

    // 设置延迟loading定时器
    if (loadingDelay) {
      this.loadingDelayTimer = setTimeout(() => {
        this.loading = true;
      }, loadingDelay);
    } else {
      this.loadingDelayTimer = null;
    }

    return new Promise((resolve, reject) => {
      this.asyncFn(...args).then(res => {
        if (currentCount === this.__requestCount) {
          if (this.loadingDelayTimer) {
            clearTimeout(this.loadingDelayTimer);
          }

          const fmtData = typeof formatResult === 'function' ? formatResult(res) : res;

          runInAction(() => {
            this.loading = false;
            this.originData = fmtData;
            this.originError = null;
          });

          if (cacheKey) {
            setCache(cacheKey, fmtData, cacheTime);
          }

          typeof onSuccess === 'function' && onSuccess(fmtData, this.params);
          resolve(fmtData);
        }
      }).catch(err => {
        if (currentCount === this.__requestCount) {
          if (this.loadingDelayTimer) {
            clearTimeout(this.loadingDelayTimer);
          }

          runInAction(() => {
            this.loading = false;
            this.originError = err;
          });

          typeof onError === 'function' && onError(err, this.params);
          reject(err);
        }
      }).finally(() => {
        if (currentCount === this.__requestCount) {
          // 轮询
          if (pollingInterval) {
            // 视窗失去焦点
            if (!isDocumentVisible() && !pollingWhenHidden) {
              this.pollingWhenVisibleFlag = true;
              return;
            }

            this.pollingTimer = setTimeout(() => {
              this.run(...args);
            }, pollingInterval);
          }
        }
      });
    });
  }

  // 取消执行异步函数
  cancel() {
    if (this.debounceRun) {
      this.debounceRun.cancel();
    }

    if (this.throttleRun) {
      this.throttleRun.cancel();
    }

    // 取消轮询定时器
    if (this.pollingTimer) {
      clearTimeout(this.pollingTimer);
    }

    // 取消延迟loading
    if (this.loadingDelayTimer) {
      clearTimeout(this.loadingDelayTimer);
    }

    this.pollingWhenVisibleFlag = false;

    this.__requestCount += 1;
    this.loading = false;
  }

  // 销毁
  destroy() {
    this.cancel();
    // 取消订阅
    this.unsubscribe.forEach(s => s());
  }

  // 用之前的参数，重新执行异步函数
  refresh() {
    return this.run(...this.params);
  }

  // 直接修改data
  mutate(newData) {
    if (typeof newData === 'function') {
      this.originData = newData(this.data);
    } else {
      this.originData = newData;
    }
  }
}

export default decorate(AsyncState, {
  loading: observable,
  originError: observable,
  originData: observable,
  error: computed,
  data: computed,
  _run: action,
  cancel: action,
  refresh: action,
  mutate: action
});
