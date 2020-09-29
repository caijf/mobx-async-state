import AsyncState, { Options } from 'mobx-async-state/types';

interface LoadMoreOptions extends Options<any, any[] | undefined> {
  defaultPageSize?: number;
}

interface PaginationValues {
  current: number;
  pageSize: number;
  total: number;
  [key: string]: any;
}

declare class LoadMoreState extends AsyncState {
  constructor(asyncFn: (...args: any) => Promise<any>, options?: LoadMoreOptions)
  reload: () => Promise<any>;
  loadMore: () => Promise<any>;
  loadingMore: boolean;
  done: boolean;
  pagination: PaginationValues;
}

export default LoadMoreState;