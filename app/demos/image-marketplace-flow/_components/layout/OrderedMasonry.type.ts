import React from "react";

/**
 * @notice it defines types used only in masonry component
 * @dev see { paulcollett/react-masonry-css }
 * Implemented based on 'react-masonry-css'
 * Modified Below
 * - js to tsx
 * - prevent column size differnce problem
 * - changed class name
 */

// @dev children in OrderedMasonry should have OrderedMasonryImageProps
export type OrderedMasonryImageProps = {
  // image size represented as decimail in string or number
  stdHeight: string | number;

  // user custom props
  [key: string]: unknown;
};

export type OrderedMasonryBreakpoint = {
  /*
   * default num of columns
   * if width is not specified, default value would be set as num of columns
   */
  default: number;
  /**
   * Additional num of columns depanding on key
   * value should be 1 or bigger integer
   * [example]
   * 1440: 3
   * -> render 3 columns when window width is <= 1440
   */
  [key: number]: number;
};

export type OrderedMasonryProps = {
  // Any React children, in array
  children: React.ReactNode | React.ReactNode[] | undefined;
  // class name of element containing columns
  className?: string | undefined;

  // class name of element containing images
  columnClassName?: string | undefined;

  // see type OrderedMasonryBreakpoint
  // if user passes number, consider it as {default: passedNumber}
  breakpointCols?: OrderedMasonryBreakpoint | number;
};

export const OrderedMasonryDefaultProps = {
  children: undefined,
  className: undefined,
  columnClassName: undefined,
  imageClassName: undefined,
  breakpointCols: 3,
  source: [],
} as OrderedMasonryProps;
