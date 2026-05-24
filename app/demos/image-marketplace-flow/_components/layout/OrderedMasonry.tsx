"use client";

import React, {
  useState,
  useEffect,
  useCallback,
  useMemo,
  useRef,
} from "react";
import {
  OrderedMasonryImageProps,
  OrderedMasonryBreakpoint,
  OrderedMasonryProps,
  OrderedMasonryDefaultProps,
} from "./OrderedMasonry.type";

const getBreakpointColsKey = (
  breakpointCols: OrderedMasonryProps["breakpointCols"],
) => {
  if (!breakpointCols || typeof breakpointCols === "number") {
    return String(breakpointCols ?? "default");
  }

  return Object.keys(breakpointCols)
    .sort()
    .map((key) => `${key}:${breakpointCols[Number(key)]}`)
    .join("|");
};

/**
 * @notice it used to implement masonry design, like pinterest
 * @notice it sorts given images, and convert it to masonry columns
 * @dev see { paulcollett/react-masonry-css }
 * Implemented based on 'react-masonry-css'
 * Modified Below
 * - js to tsx
 * - prevent column size differnce problem
 * - changed class name
 */
const OrderedMasonry = ({
  children,
  className,
  columnClassName,
  breakpointCols,
}: OrderedMasonryProps) => {
  const [columnCount, setColumnCount] = useState<number>(0);
  const columnCountRef = useRef<number>(0);
  const breakpointColsKey = getBreakpointColsKey(breakpointCols);
  const normalizedBreakpointCols = useMemo(() => {
    const DEFAULT_COLUMNS = 1;

    if (breakpointCols && typeof breakpointCols == "number") {
      return {
        default: breakpointCols as number,
      } as OrderedMasonryBreakpoint;
    }

    if (breakpointCols == undefined) {
      return {
        default: DEFAULT_COLUMNS,
      } as OrderedMasonryBreakpoint;
    }

    return breakpointCols as OrderedMasonryBreakpoint;
  }, [breakpointColsKey]);

  /**
   * ==============================
   * Grid change on resize functions
   * ==============================
   */
  const getColumnCount = useCallback(() => {
    const INFINITY = Number.POSITIVE_INFINITY;
    const windowWidth =
      typeof window !== "undefined" ? window.innerWidth : INFINITY;

    let matchedBreakpoint = INFINITY;
    let columns = normalizedBreakpointCols.default;

    for (const breakpoint in normalizedBreakpointCols) {
      const optBreakpoint = parseInt(breakpoint);
      const isCurrentBreakpoint =
        optBreakpoint > 0 && windowWidth <= optBreakpoint;

      if (isCurrentBreakpoint && optBreakpoint < matchedBreakpoint) {
        matchedBreakpoint = optBreakpoint;
        columns = normalizedBreakpointCols[breakpoint];
      }
    }

    columns = Math.max(1, columns);
    return columns;
  }, [normalizedBreakpointCols]);

  const calculateColumnCount = useCallback(() => {
    const columns = getColumnCount();

    if (columnCountRef.current !== columns) {
      columnCountRef.current = columns;
      setColumnCount(columns);
    }
  }, [getColumnCount]);

  /**
   * ==============================
   * Column functions
   * ==============================
   */
  const getSortedSourceColumns = () => {
    if (children == undefined) {
      return [];
    }
    const currentColumnCount = columnCount;
    const columns = new Array<Array<React.ReactNode>>(currentColumnCount);
    const heightSums = new Array<number>(currentColumnCount);
    const items = React.Children.toArray(children);

    // init local variables
    for (let i = 0; i < columnCount; i++) {
      columns[i] = [];
      heightSums[i] = 0;
    }

    // distribute source images
    for (let i = 0; i < items.length; i++) {
      // find minimum height column
      let hungryColumnIndex = 0;
      for (let j = 0; j < columnCount; j++) {
        if (heightSums[hungryColumnIndex] > heightSums[j]) {
          hungryColumnIndex = j;
        }
      }

      // add image to minimum height column
      columns[hungryColumnIndex].push(items[i]);
      heightSums[hungryColumnIndex] += Number(
        ((items[i] as React.ReactElement).props as OrderedMasonryImageProps)
          .stdHeight,
      );
    }
    return columns;
  };

  const renderColumns = () => {
    const childrenInColumns = getSortedSourceColumns();
    const columnWidth = `${100 / childrenInColumns.length}%`;
    let columnClassNameOutput = columnClassName;

    if (typeof columnClassName === "undefined") {
      columnClassNameOutput = "ordered-masonry-grid_column";
    }

    return childrenInColumns.map((item: React.ReactNode, i: number) => {
      return (
        <div
          style={{ width: columnWidth }}
          className={columnClassNameOutput}
          key={i}
        >
          {item}
        </div>
      );
    });
  };

  /**
   * ==============================
   * Column functions
   * ==============================
   */
  useEffect(() => {
    calculateColumnCount();
    window.addEventListener("resize", calculateColumnCount);
    return () => {
      window.removeEventListener("resize", calculateColumnCount);
    };
  }, [calculateColumnCount]);

  let classNameOutput = className;

  if (typeof className === "undefined") {
    classNameOutput = "ordered-masonry-grid_column";
  }
  return (
    <div className={classNameOutput}>
      {columnCount > 0 ? renderColumns() : undefined}
    </div>
  );
};

export default OrderedMasonry;
