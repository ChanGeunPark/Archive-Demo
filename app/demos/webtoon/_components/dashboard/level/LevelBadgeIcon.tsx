import { Level10Badge, LevelStarterBadge } from "../icons/DashboardIcons";

type LevelBadgeIconProps = {
  level: number;
  className?: string;
};

export default function LevelBadgeIcon({ level, className }: LevelBadgeIconProps) {
  if (Number(level) < 10) {
    return <LevelStarterBadge className={className} width={24} height={24} />;
  }
  return <Level10Badge className={className} width={24} height={24} />;
}
