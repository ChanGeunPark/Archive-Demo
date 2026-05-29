type InformationListItemProps = {
  title: string;
  content: React.ReactNode;
};

export default function InformationListItem({ title, content }: InformationListItemProps) {
  return (
    <div className="mb-1 flex items-start justify-start">
      <p className="w-[100px] shrink-0 text-sm font-normal text-gray-500">
        {title}
      </p>
      <p className="text-left text-sm font-medium text-gray-900">{content}</p>
    </div>
  );
}
