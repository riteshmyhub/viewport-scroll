import { useEffect, useRef, useState, type ReactNode } from "react";

/*  ---------------- Props ------------------ */
type ViewportScrollParams = { page: number; setHasMore: (v: boolean) => void };

type ScrollHandlerType = ({ page, setHasMore }: ViewportScrollParams) => Promise<any>;

type ViewportScrollProps = {
   asyncHandler: ScrollHandlerType;
   children: ReactNode;
   onPagination?: (page: number) => number;
   isLoading: boolean;
   threshold?: number;
};

type Props = React.DetailedHTMLProps<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement> & ViewportScrollProps;

/*  ---------------- VirtualScrolling Components ------------------ */
function ViewportScroll({ asyncHandler, children, isLoading, onPagination = (page) => page + 1, threshold = 100, ...divProps }: Props) {
   const [page, setPage] = useState(1);
   const [hasMore, setHasMore] = useState(true);

   const containerRef = useRef<HTMLDivElement | null>(null);
   const isLoadingRef = useRef(isLoading);
   const hasMoreRef = useRef(hasMore);

   useEffect(() => {
      isLoadingRef.current = isLoading;
   }, [isLoading]);

   useEffect(() => {
      hasMoreRef.current = hasMore;
   }, [hasMore]);

   const handleScroll = () => {
      const el = containerRef.current;
      if (!el) return;

      const { scrollTop, scrollHeight, clientHeight } = el;
      const nearBottom = scrollHeight - scrollTop - clientHeight < threshold;

      if (nearBottom && !isLoadingRef.current && hasMoreRef.current) {
         setPage((prevPage) => onPagination(prevPage));
      }
   };

   useEffect(() => {
      const fetchData = async () => {
         await asyncHandler({ page, setHasMore });
      };
      fetchData();
   }, [page]);

   useEffect(() => {
      const el = containerRef.current;
      if (!el) return;
      el.addEventListener("scroll", handleScroll);
      return () => el.removeEventListener("scroll", handleScroll);
   }, []);

   return (
      <div ref={containerRef} {...divProps}>
         {children}
      </div>
   );
}

export { ViewportScroll };
export type { ViewportScrollProps, ScrollHandlerType, ViewportScrollParams };
