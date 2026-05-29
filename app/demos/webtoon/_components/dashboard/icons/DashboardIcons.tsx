import type { IconType } from "react-icons";
import {
  IoAdd,
  IoGiftOutline,
  IoInformationCircleOutline,
  IoMedalOutline,
  IoRefresh,
  IoTrophy,
} from "react-icons/io5";
import { MdCake } from "react-icons/md";

type IconProps = {
  className?: string;
  size?: number;
};

function withIcon(Icon: IconType, defaultClassName?: string) {
  return function WrappedIcon({ className, size }: IconProps) {
    return <Icon className={className ?? defaultClassName} size={size} aria-hidden />;
  };
}

export const CakeIcon = withIcon(MdCake);
export const GiftIcon = withIcon(IoGiftOutline, "text-alertMain");
export const RefreshIcon = withIcon(IoRefresh);
export const InformationIcon = withIcon(IoInformationCircleOutline);
export const PlusIcon = withIcon(IoAdd);
export const GoldTiaraIcon = withIcon(IoTrophy);
export const LevelStarterBadge = withIcon(IoMedalOutline);
export const Level10Badge = withIcon(IoMedalOutline);
