---
title: 文档示例
group:
  title: 文档示例
  path: /docs
  order: 1
---

# mobx-async-state

Mobx 异步函数的状态管理，自动观察 `loading` `data` `error` 数据。

**核心特性**

- 自动请求
- 手动请求
- 缓存 & 预加载
- 屏幕聚焦重新请求
- 轮询
- 防抖
- 节流
- 突变
- Loading Delay
- 并行请求
- 分页
- 加载更多
- ...

## ⚠️ 注意事项

- 组件中使用观察数据时，需在外层包裹 `observer`，否则无法更新组件。
- `import 'mobx-react-lite/batchingForReactDom'` 为 `observer` 配置观察者批处理，仅需在项目入口处引入一次即可，否则会有如下警告：

```
[MobX] You haven't configured observer batching which might result in unexpected behavior in some cases. See more at https://github.com/mobxjs/mobx-react-lite/#observer-batching
```

> 参考：https://stackoverflow.com/questions/61654633/mobx-react-console-warning-related-observer

## 代码演示

### 默认请求

<code src="./demo/pages/Default.tsx" />

### 手动触发

<code src="./demo/pages/AutoRun.tsx" />

### 缓存 & 预加载

<code src="./demo/pages/Preload.tsx" />

### 屏幕聚焦重新请求

<code src="./demo/pages/RefreshOnWindowFocus.tsx" />

### 轮询

<code src="./demo/pages/PollingInterval.tsx" />

### 防抖

<code src="./demo/pages/DebounceInterval.tsx" />

### 节流

<code src="./demo/pages/ThrottleInterval.tsx" />

### 突变

<code src="./demo/pages/Mutate.tsx" />

### Loading Delay

<code src="./demo/pages/LoadingDelay.tsx" />

### 并行请求

<code src="./demo/pages/Parallel.tsx" />

## API

```javascript
const {
  data,
  error,
  loading,
  params,
  run,
  cancel,
  refresh,
  mutate,
  destroy,
} = new AsyncState(asyncFn, {
  autoRun,
  initialData,
  defaultParams,
  onSuccess,
  onError,
  cacheKey,
  cacheTime,
  loadingDelay,
  pollingInterval,
  pollingWhenHidden,
  refreshOnWindowFocus,
  focusTimespan,
  debounceInterval,
  throttleInterval,
});
```

### Result

| 参数 | 说明 | 类型 |
| --- | --- | --- |
| data | 异步函数的返回值，默认为 `undefined`。 | `any` |
| error | 异步函数抛出的异常，默认为 `undefined` | `any` |
| loading | 异步函数正在执行 | `boolean` |
| params | 执行异步函数的参数数组。比如你触发了 `run(1, 2, 3)`，则 `params` 等于 `[1, 2, 3]`。**该值未被观察，变更后不会触发组件更新。** | `array` |
| run | 手动触发异步函数。`debounce` 模式与 `throttle` 模式返回值为 `Promise<null>` | `(...args) => Promise` |
| cancel | 取消当前请求。如果有轮询，停止。 | `() => void` |
| refresh | 使用上一次的 `params` ，重新执行异步函数。 | `() => void` |
| mutate | 直接修改 `data` | `(newData) => void` / `((oldData) => newData) => void` |
| destroy | 取消当前请求及订阅（如监听视窗焦点/显示）。 | `() => void` |

### Params

所有配置项都是可选的。

| 参数 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| autoRun | 默认 `true`。即在初始化时自动执行异步函数。如果为 `false`，则需要手动调用 `run` 触发执行。 | `boolean` | `true` |
| initialData | 默认的 `data`。 | `any` | - |
| defaultParams | 如果 `autoRun=true` 自动执行 `run` 的默认参数。 | `array` | - |
| formatResult | 格式化请求结果 | `(data) => any` | - |
| onSuccess | 异步函数 `resolve` 时触发，参数为 `data` 和 `params`。 | `(data, params) => void` | - |
| onError | 异步函数报错时触发，参数为 `error` 和 `params` | `(error, parmams) => void` | - |
| cacheKey | 缓存的键值，启用缓存机制。异步成功结果，将被缓存。 | `string` | - |
| cacheTime | 缓存时间，单位为毫秒。 | `number` | `5*60*1000` |
| loadingDelay | 设置 `loading` 延迟时间，避免闪烁，单位为毫秒。 | `number` | - |
| pollingInterval | 轮询间隔，单位为毫秒。设置后，将进入轮询模式，定时触发 `run` | `number` | - |
| pollingWhenHidden | 在页面隐藏时，是否继续轮询。默认为 `true`，即不会停止轮询<br />如果设置为 `false`，在页面隐藏时会暂时停止轮询，页面重新显示时继续上次轮询 | `boolean` | true |
| refreshOnWindowFocus | 在屏幕重新获取焦点或重新显示时，是否重新发起请求。默认为 `false`，即不会重新发起请求。<br />如果设置为 `true`，在屏幕重新聚焦或重新显示时，会重新发起请求。 | `boolean` | `false` |
| focusTimespan | 屏幕重新聚焦，如果每次都重新发起请求，不是很好，我们需要有一个时间间隔，在当前时间间隔内，不会重新发起请求。需要配置 `refreshOnWindowFocus` 使用。 | `number` | `5000` |
| debounceInterval | 防抖间隔, 单位为毫秒，设置后，请求进入防抖模式。 | `number` | - |
| throttleInterval | 节流间隔, 单位为毫秒，设置后，请求进入节流模式。 | `number` | - |

## 扩展用法

基于基础的 `AsyncState`，我们可以进一步封装，实现更高级的定制需求。下面演示 `分页` 和 `加载更多` 两种场景，你可以参考代码，根据业务实现自己的封装。

该场景以下面的 `请求参数` 和 `响应数据` 格式为示例

请求参数：

```
{
  page: {
    pageNum: number,
    pageSize: number
  },
  data: {
    ...
  }
}
```

响应数据：

```
{
  pageInfo: {
    ...,
    total: number
  },
  data: []
}
```

### 分页

- 自动管理分页条件 `page` ， `page: {pageNum: number, pageSize: number}` 。
- 内部缓存当前查询条件 `data` ，当分页变化后，自动携带当前查询条件触发请求。
- `run` 方法如果带有参数，表示修改了查询条件，将会重置当前页码为 `1`，并触发请求。
- `refresh` 自动带入当前参数并触发请求。
- `changePagination` 修改分页，将使用当前查询条件进行请求。

#### PaginationState

<code src="./demo/pages/Pagination1.tsx" />
<code src="./demo/pages/Pagination2.tsx" />
<code src="./demo/pages/Pagination3.tsx" />

#### API

查看 [`PaginationState.d.ts`](https://github.com/caijf/mobx-async-state/blob/master/src/demo/store/PaginationState.d.ts)

```
const {
  ...,
  changePagination,
  pagination
} = new PaginationState(asyncFn, {
  defaultPageNum,
  defaultPageSize,
  defaultTotal,
  defaultParams
});
```

#### Result

| 参数 | 说明 | 类型 |
| --- | --- | --- |
| changePagination | 页码改变时调用 | `({current, pageSize}) => void` |
| pagination | 分页数据 `current` `pageSize` `total` | `object` |

#### Params

将默认分页与默认参数提取出来，便于实现缓存。

| 参数            | 说明           | 类型     | 默认值 |
| --------------- | -------------- | -------- | ------ |
| defaultPageNum  | 默认当前页面   | `number` | `1`    |
| defaultPageSize | 默认每页的数量 | `number` | `10`   |
| defaultTotal    | 默认总数量     | `number` | `0`    |

### 加载更多

- 自动管理分页条件 `page` ， `page: {pageNum: number, pageSize: number}` 。
- 自动管理列表数据，返回的数据 `data` 即为合并数组。
- 首次加载需通过调用 `run`，并传入除分页外的查询参数。
- 加载下一页 `loadMore` 或 重新加载 `reload` 会自动带入之前参数，并自动管理分页参数。
- `loadingMore` 仅在非首页加载时为 `true` 。
- `refresh` 和 `reload` 是一样的，将会重置当前页码为 `1`，并触发请求。

#### LoadMoreState

<code src="./demo/pages/LoadMore1.tsx" />
<code src="./demo/pages/LoadMore2.tsx" />

#### API

查看 [`LoadMoreState.d.ts`](https://github.com/caijf/mobx-async-state/blob/master/src/demo/store/LoadMoreState.d.ts)

```
const {
  ...,
  reload,
  loadMore,
  loadingMore,
  done,
  pagination
} = new LoadMoreState(asyncFn, {
  defaultPageSize
});
```

#### Result

| 参数        | 说明                                  | 类型         |
| ----------- | ------------------------------------- | ------------ |
| reload      | 触发重新加载                          | `() => void` |
| loadMore    | 触发加载更多                          | `() => void` |
| loadingMore | 是否正在加载更多                      | `boolean`    |
| done        | 是否加载完成                          | `boolean`    |
| pagination  | 分页数据 `current` `pageSize` `total` | `object`     |

#### Params

| 参数            | 说明           | 类型     | 默认值 |
| --------------- | -------------- | -------- | ------ |
| defaultPageSize | 默认每页的数量 | `number` | `10`   |
