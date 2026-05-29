import { cls } from "@/lib/client/utils";

type LineDividerProps = {
  orientation: "horizontal" | "vertical";
  className?: string;
};

export default function LineDivider({ orientation, className }: LineDividerProps) {
  return (
    <hr
      className={cls(
        "shrink-0 border-gray-100",
        orientation === "vertical" ? "h-full w-px border-l" : "w-full border-t",
        className
      )}
    />
  );
}
