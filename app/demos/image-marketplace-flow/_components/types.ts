export interface MasonryImgProps {
  imgUrl: string;
  profileImgUrl?: string;
  title?: string;
  nickName?: string;
  ethClass?: string;
  works?: string;
  [key: string]: unknown;
  userProfile?: string;
  userScreenName?: string;
  userAddress?: string;
  userName?: string;
  link?: string;
  buyNowPrice?: number;
  height?: number;
  width?: number;
  likeButton?: boolean;
  auctionTime?: string | null;
  children?: React.ReactNode;
}
