import { motion } from "framer-motion";
import React, { useState } from "react";
import { cls } from "@/lib/client/utils";
// import { useConnectWallet } from "../../../lib/store/connectWalletStore";

interface FollowButtonProps {
  children?: React.ReactNode;
  buttonStyle?: "FULL" | "BASIC";
  followeeAddress?: string;
  state?: string;
  className?: string;
  buttonColor?: string;
  hoverColor?: string;
  unfollowHoverColor?: string;
  unfollowColor?: string;
  [key: string]: unknown;
}
function FollowButton({
  children,
  followeeAddress,
  buttonStyle,
  unfollowColor,
  className,
  state,
  buttonColor,
  hoverColor,
  unfollowHoverColor,
  ...rest
}: FollowButtonProps) {
  const [followState, setFollowState] = useState<boolean>(false);
  const [followHover, setFollowHover] = useState<string>("Following");

  // const { demoUserId, isDemoConnected, setShowModal } = useConnectWallet();

  const setState = () => {
    // if (isDemoConnected) {
    //   setFollowState(!followState);
    // } else {
    //   setShowModal(true);
    // }
  };
  // if (demoUserId === followeeAddress) return null;

  const buttonMainStyle =
    buttonStyle == "BASIC"
      ? "w-[80px] lg:w-[96px]"
      : buttonStyle == "FULL"
        ? "w-full"
        : "w-full";

  return (
    <motion.button
      className={cls(
        "h6",
        buttonMainStyle,
        className + "",
        followState
          ? "border-2 border-neutralPale bg-white text-[#44536B]"
          : "",
        followState && unfollowColor ? `!text-[${unfollowColor}] border` : "",
      )}
      {...rest}
      style={
        followState ? { backgroundColor: "" } : { backgroundColor: buttonColor }
      }
      transition={{ type: "spring", stiffness: 400, damping: 17 }}
      whileTap={{ scale: 0.9 }}
      onClick={() => setState()}
      whileHover={
        followState
          ? { backgroundColor: unfollowHoverColor }
          : { backgroundColor: hoverColor }
      }
      onMouseEnter={() => setFollowHover("Unfollow")}
      onMouseLeave={() => setFollowHover("Following")}
    >
      {followState ? followHover : "Follow"}
    </motion.button>
  );
}
export default FollowButton;
