export interface Options<D, P> {
  autoRun?: boolean;
  initialData?: any;
  defaultParams?: any;
  formatResult?: (data: D) => any;
  onSuccess?: (data: D, params: P) => void;
  onError?: (error: any, params: P) => void;
  cacheKey?: string;
  cacheTime?: number;
  loadingDelay?: number;
  pollingInterval?: number;
  pollingWhenHidden?: boolean;
  refreshOnWindowFocus?: boolean;
  focusTimespan?: number;
  debounceInterval?: number;
  throttleInterval?: number;
}

declare class AsyncState {
  constructor(asyncFn: (...args: any) => Promise<any>, options?: Options<any, any[] | undefined>)
  data: any;
  error: any;
  loading: boolean;
  params: any[];
  run: (...args: any) => Promise<any>;
  cancel: () => void;
  refresh: () => void;
  mutate: (newData: any | ((oldData: any) => any)) => void;
  destroy: () => void;
}

export default AsyncState;