# mobx-async-state

Mobx 异步函数的状态管理，自动观察 `loading` `data` `error` 数据。[查看文档示例]


## 对比 hooks

API 完全与 rc-hooks 的 [useAsync] 保持一致，与 `hooks` 相比有以下区别：

- 使用 `Context` 管理状态
- 可以在组件外使用和修改
- 没有 `hooks` 的生命周期
- 在单页应用中，状态可能应用在`“全局”`，需要注意清除或重新实例


## 安装

```shell
npm install mobx-async-state
# or
yarn add mobx-async-state
```

## 使用

```javascript
import AsyncState from "mobx-async-state";

const someAsyfnState = new AsyncState(someAsyncFn, options);
```

更多用法和示例，请[查看文档示例]！


## API

### Result

参数 | 说明 | 类型 |
------------- | ------------- | ------------- |
data  | 异步函数的返回值，默认为 `undefined`。 | `any` |
error  | 异步函数抛出的异常，默认为 `undefined` | `any` |
loading  | 异步函数正在执行 | `boolean` |
params  | 执行异步函数的参数数组。比如你触发了 `run(1, 2, 3)`，则 params 等于 `[1, 2, 3]`。**该值未被观察，变更后不会触发组件更新。** | `array` |
run  | 手动触发异步函数。`debounce` 模式与 `throttle` 模式返回值为 `Promise<null>` | `(...args) => Promise` |
cancel  | 取消当前请求。如果有轮询，停止。 | `() => void` |
refresh  | 使用上一次的 `params`，重新执行异步函数。 | `() => void` |
mutate  | 直接修改 `data` | `(newData) => void` / `((oldData) => newData) => void` |
destroy  | 取消当前请求及订阅（如监听视窗焦点/显示）。 | `() => void` |

### Params

所有配置项都是可选的。

参数 | 说明 | 类型 | 默认值 |
------------- | ------------- | ------------- | ------------- |
autoRun  | 默认 `true`。即在初始化时自动执行异步函数。如果为 `false`，则需要手动调用 `run` 触发执行。 | `boolean` | `true` |
initialData  | 默认的 `data`。 | `any` | - |
defaultParams  | 如果 `autoRun=true` 自动执行 `run` 的默认参数。 |  `array`  | - |
formatResult  | 格式化请求结果 | `(data) => any` | - |
onSuccess  | 异步函数 `resolve` 时触发，参数为 `data` 和 `params`。 | `(data, params) => void` | - |
onError  | 异步函数报错时触发，参数为 `error` 和 `params` | `(error, parmams) => void` | - |
cacheKey  | 缓存的键值，启用缓存机制。异步成功结果，将被缓存。 | `string` | - |
cacheTime  | 缓存时间，单位为毫秒。 | `number` | `5*60*1000` |
loadingDelay  | 设置 `loading` 延迟时间，避免闪烁，单位为毫秒。| `number` | - |
pollingInterval | 轮询间隔，单位为毫秒。设置后，将进入轮询模式，定时触发 `run` | `number`  | - |
refreshOnWindowFocus  | 在屏幕重新获取焦点或重新显示时，是否重新发起请求。默认为 `false`，即不会重新发起请求。如果设置为 `true`，在屏幕重新聚焦或重新显示时，会重新发起请求。 | `boolean` | `false` |
focusTimespan  | 屏幕重新聚焦，如果每次都重新发起请求，不是很好，我们需要有一个时间间隔，在当前时间间隔内，不会重新发起请求。需要配置 `refreshOnWindowFocus` 使用。 | `number` | `5000` |
debounceInterval  | 防抖间隔, 单位为毫秒，设置后，请求进入防抖模式。 | `number` | - |
throttleInterval  | 节流间隔, 单位为毫秒，设置后，请求进入节流模式。 | `number` | - |

[useAsync]: https://doly-dev.github.io/rc-hooks/site/#/async/use-async
[查看文档示例]: https://caijf.github.io/mobx-async-state/site/#/mobx-asnyc-state