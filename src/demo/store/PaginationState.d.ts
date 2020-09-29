import AsyncState, { Options } from 'mobx-async-state/types';

interface PageParam {
  current: number;
  pageSize: number;
  [key: string]: any;
}

interface PaginationValues {
  current: number;
  pageSize: number;
  total: number;
  [key: string]: any;
}

interface PaginationOptions extends Options<any, any[] | undefined> {
  defaultPageNum?: number;
  defaultPageSize?: number;
  defaultTotal?: number;
}

declare class PaginationState extends AsyncState {
  constructor(asyncFn: (...args: any) => Promise<any>, options?: PaginationOptions)
  changePagination: (page: PageParam) => void;
  pagination: PaginationValues
}

export default PaginationState;
