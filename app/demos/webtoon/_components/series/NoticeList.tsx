import { cls } from "@/lib/client/utils";
import { dateFormatting, enterTextFormatter } from "@/lib/webtoon-demo/formatters";
import type { SeriesNotification, SeriesNotificationType } from "@/lib/webtoon-demo/types";
import NoticeListItem from "../ui/NoticeListItem";

type NoticeListProps = {
  notifications: SeriesNotification[];
};

function seriesTypeLabel(type?: SeriesNotificationType) {
  switch (type) {
    case "ALL":
      return "전체 공지";
    case "SERIES":
      return "시리즈 공지";
    case "SERIALIZATION":
      return "연재 공지";
    default:
      return undefined;
  }
}

export default function NoticeList({ notifications }: NoticeListProps) {
  if (!notifications.length) {
    return (
      <p className={cls("px-3 py-10 text-center text-[13px] font-normal text-gray-300")}>
        공지사항이 없습니다.
      </p>
    );
  }

  return (
    <section className="space-y-2">
      {notifications.map((notice, index) => (
        <NoticeListItem
          key={notice.id}
          index={index}
          title={String(notice.title)}
          isRecent={notice.isRecent ?? false}
          type={seriesTypeLabel(notice.type)}
          beginAt={dateFormatting({
            time: notice.beginAt,
            customOptions: { dateStyle: "medium" },
          })}
        >
          {enterTextFormatter(String(notice.content))}
        </NoticeListItem>
      ))}
    </section>
  );
}
