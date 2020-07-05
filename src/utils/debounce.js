// 防抖
// 调用一定时间间隔后才执行，期间每次调用都将重新计时
export default function debounce(fn, timespan) {
  let timer = null;

  function cancel() {
    clearTimeout(timer);
  }

  function debounced(...args) {
    const context = this;
    clearTimeout(timer);
    timer = setTimeout(() => {
      fn.call(context, ...args);
    }, timespan);
  }

  debounced.cancel = cancel;

  return debounced;
}