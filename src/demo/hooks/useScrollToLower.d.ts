interface ScrollToLowerOptions {
  ref?: React.Ref<HTMLElement> | null;
  threshold?: number;
  ready?: boolean;
  onLoad?: () => void;
}

declare function useScrollToLower(options?: ScrollToLowerOptions): void;

export default useScrollToLower;