"use client";

import { cls } from "@/lib/client/utils";
import { usePagination } from "@/lib/webtoon-demo/hooks/usePagination";
import { useState } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
} from "recharts";
import KeyboardArrowLeftIcon from "@/components/icons/arrow/KeyboardArrowLeftIcon";
import KeyboardArrowRightIcon from "@/components/icons/arrow/KeyboardArrowRightIcon";
import ChizuButton from "./ChizuButton";
import SwipeablePages from "./SwipeablePages";

type CustomizedStickChartProps = {
  userVoteHistory?: Array<{ episode: number; cake: number }>;
  className?: string;
};

export default function CustomizedStickChart({
  userVoteHistory,
  className,
}: CustomizedStickChartProps) {
  const [currentPage, setCurrentPage] = useState(1);

  const history = usePagination({
    data: userVoteHistory,
    itemsPerPage: 5,
    pageNumber: currentPage,
  });

  const formatXAxis = (tickItem: number | string) => `${tickItem}화`;

  return (
    <SwipeablePages
      className="w-full"
      initialPageIndex={currentPage}
      totalPage={history.totalPages || 0}
      onChangePage={setCurrentPage}
    >
      <section className={cls(className, Number(userVoteHistory?.length) < 5 && "mb-4")}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={history.getPaginatedData()}
            margin={{ top: 5, right: 20, left: 20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              dataKey="episode"
              scale="point"
              tickFormatter={formatXAxis}
              padding={
                userVoteHistory && userVoteHistory.length < 4
                  ? { left: 60, right: 60 }
                  : { left: 40, right: 40 }
              }
              style={{ fontSize: "13px" }}
            />
            <Tooltip
              formatter={(value) =>
                value == null ? "" : Number(value).toLocaleString("ko-KR")
              }
              labelFormatter={(label) => `${label}화`}
              labelStyle={{ fontSize: "13px", color: "#000" }}
              itemStyle={{ fontSize: "13px", color: "#000" }}
            />
            <Bar dataKey="cake" fill="#303338" maxBarSize={35} />
          </BarChart>
        </ResponsiveContainer>
      </section>

      {Number(userVoteHistory?.length) > 5 ? (
        <div className="mb-6 mt-2 flex items-center justify-center space-x-2">
          <ChizuButton
            buttonSize="SMALL"
            buttonStyle="OUTLINED"
            disabled={history.isFirstPage}
            onClick={() => {
              if (!history.isFirstPage) setCurrentPage(currentPage - 1);
            }}
          >
            <KeyboardArrowLeftIcon
              className={history.isFirstPage ? "fill-gray-400" : "fill-gray-900"}
            />
          </ChizuButton>
          <ChizuButton
            buttonSize="SMALL"
            buttonStyle="OUTLINED"
            disabled={history.isLastPage}
            onClick={() => {
              if (!history.isLastPage) setCurrentPage(currentPage + 1);
            }}
          >
            <KeyboardArrowRightIcon
              className={history.isLastPage ? "fill-gray-400" : "fill-gray-900"}
            />
          </ChizuButton>
        </div>
      ) : null}
    </SwipeablePages>
  );
}
