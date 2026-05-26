import React from "react";
import { ButtonProps } from "../button.types";
import CautionButton from "./CautionButton";
import LinkButton from "./LinkButton";
import OutlineButton from "./OutlineButton";
import PaleButton from "./PaleButton";
import PrimaryButton from "./PrimaryButton";
import SecondaryButton from "./SecondaryButton";
import TextButton from "./TextButton";

function BaseButton(props: ButtonProps) {
  switch (props.buttonStyle) {
    case "PRIMARY":
      return <PrimaryButton {...props} />;
    case "SECONDARY":
      return <SecondaryButton {...props} />;
    case "CAUTION":
      return <CautionButton {...props} />;
    case "OUTLINED":
      return <OutlineButton {...props} />;
    case "TEXT":
      return <TextButton {...props} />;
    case "LINK":
      return <LinkButton {...props} />;
    case "PALE":
      return <PaleButton {...props} />;
    default:
      return <PrimaryButton {...props} />;
  }
}

export default BaseButton;
