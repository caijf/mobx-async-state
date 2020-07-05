/**
 * title: 缓存 & 预加载
 * desc: |
 *  如果设置了 `options.cacheKey` ， `AsyncState` 会将当前请求结束数据缓存起来。下次组件初始化时，如果有缓存数据，我们会优先返回缓存数据，然后在背后发送新请求。
 * 
 *  同一个 `cacheKey` 的请求，是全局共享的，也就是你可以提前加载数据。利用该特性，可以很方便的实现预加载。
 */

import React, { useState } from 'react';
import { Button, Spin } from 'antd';
import { observer } from "mobx-react-lite";
import AsyncState from "mobx-async-state";

import getArticle from "../services/getArticle";

const getArticleState = new AsyncState(getArticle, {
  autoRun: false,
  cacheKey: 'article'
});

export default observer(() => {
  const [visible, setVisible] = useState(false);

  return (
    <div>
      <p>When the mouse hovers over the button, the article data is preloaded.</p>
      <p>
        <Button onMouseEnter={() => getArticleState.run()} onClick={() => setVisible(b => !b)}>show/hidden</Button>
      </p>
      {visible && <Article />}
    </div>
  )
});

const Article = observer(() => {
  return (
    <Spin spinning={!getArticleState.data && getArticleState.loading}>
      <p>Latest request time: {getArticleState.data?.time}</p>
      <p>{getArticleState.data?.data}</p>
    </Spin>
  );
});
