import Typography from "@/components/typography/Typography";
import {
  enterTextFormatter,
  formatAuthors,
  formatCensorship,
  formatGenreType,
  formatIntervalType,
} from "@/lib/webtoon-demo/formatters";
import type { Series } from "@/lib/webtoon-demo/types";
import CardBox from "../ui/CardBox";
import InformationListItem from "../ui/InformationListItem";

type SeriesInfoDetailProps = {
  seriesItem: Series;
};

export default function SeriesInfoDetail({ seriesItem }: SeriesInfoDetailProps) {
  return (
    <CardBox px={4} py={6} className="lg:p-8">
      <div className="mb-8">
        <Typography variant="h5" color={800} className="mb-4">
          작품소개
        </Typography>

        <InformationListItem
          title="장르"
          content={seriesItem.genre.map((genre, index) => (
            <span key={genre}>
              {index > 0 && ", "}
              {formatGenreType(genre)}
            </span>
          ))}
        />

        <InformationListItem
          title="등급"
          content={formatCensorship(seriesItem.censorship)}
        />

        <InformationListItem
          title="연재일"
          content={seriesItem.intervalType.map((intervalType) =>
            formatIntervalType(intervalType)
          )}
        />

        <p className="mt-4 whitespace-pre-line text-[13px] font-medium leading-5 text-gray-600">
          {enterTextFormatter(seriesItem.description)}
        </p>
      </div>

      <div className="border-t-2 border-gray-50 pt-8">
        <Typography variant="h5" color={800} className="mb-4">
          작가소개
        </Typography>

        {formatAuthors(seriesItem.authorsRole).map((role, index) => {
          const authorName = role.value[0];
          const authorBio = seriesItem.authors.find((author) => author.name === authorName)?.bio;

          return (
            <div key={index}>
              <InformationListItem
                title={Object.keys(role)[0]}
                content={role.value.join(", ")}
              />
              <InformationListItem
                title="소개말"
                content={
                  <span className="whitespace-pre-line">
                    {enterTextFormatter(authorBio ?? "")}
                  </span>
                }
              />
            </div>
          );
        })}
      </div>
    </CardBox>
  );
}
