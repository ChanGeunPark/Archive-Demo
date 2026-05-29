type VoteOutlinedIconProps = {
  className?: string;
};

export default function VoteOutlinedIcon({ className }: VoteOutlinedIconProps) {
  return (
    <svg
      viewBox="0 0 16 16"
      fill="currentColor"
      className={className}
      aria-hidden
    >
      <path d="M8 1.5 10.2 5.8l4.8.7-3.5 3.4.8 4.8L8 12.8 3.7 14.7l.8-4.8L1 6.5l4.8-.7L8 1.5Z" />
    </svg>
  );
}
