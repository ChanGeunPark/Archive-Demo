import { cls } from "@/lib/client/utils";

type ContainTabProps = {
  id: string;
  checked: boolean;
  onClick: (e: React.MouseEvent<HTMLDivElement>) => void;
  title: string;
  index: number;
};

export default function ContainTab({ id, checked, onClick, title, index }: ContainTabProps) {
  return (
    <div className="relative flex h-full items-center justify-center text-center">
      <div
        id={id}
        role="tab"
        aria-selected={checked}
        className={cls(
          "flex h-[30px] cursor-pointer items-center justify-center whitespace-nowrap break-keep rounded-full px-3 text-[14px] font-medium transition-all",
          "bg-gray-50 text-gray-500 lg:hover:bg-gray-100",
          index > 0 ? "ml-2" : "",
          checked
            ? "!bg-primaryMain !font-extrabold !text-gray-900 lg:hover:!bg-primaryDark"
            : ""
        )}
        onClick={onClick}
      >
        {title}
      </div>
    </div>
  );
}
