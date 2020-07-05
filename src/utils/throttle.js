// 节流
// 多次调用在一定时间间隔内仅执行一次
export default function throttle(fn, timespan) {
  // 最后一次执行时间
  let last = "";
  // 定时器
  let timer = null;
  // 最后执行时的参数
  let lastArgs;
  // 正在等待执行
  let pendding = false;

  // 取消执行
  function cancel() {
    clearTimeout(timer);
    pendding = false;
  }

  function throttled() {
    lastArgs = arguments;

    if (pendding) {
      return;
    }

    const now = +new Date();
    const context = this;

    if (last && now < last + timespan) {
      pendding = true;
      timer = setTimeout(() => {
        last = now;
        pendding = false;
        fn.apply(context, lastArgs);
      }, timespan);
    } else {
      last = now;
      fn.apply(context, lastArgs);
    }
  }

  throttled.cancel = cancel;

  return throttled;
}