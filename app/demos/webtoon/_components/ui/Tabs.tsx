"use client";

import { cls } from "@/lib/client/utils";
import ContainTab from "./ContainTab";

export type TabValue = {
  menu: string;
  title: string;
};

type TabsProps = {
  menu: string;
  selectableMenus: TabValue[];
  onClick: (e: React.MouseEvent<HTMLDivElement>) => void;
  className?: string;
  alert?: {
    alertIndex: number;
    state: boolean;
  };
};

export default function Tabs({
  menu,
  selectableMenus,
  onClick,
  className,
  alert,
}: TabsProps) {
  return (
    <nav
      className={cls(
        "scrollbar-hide flex h-14 w-full items-center overflow-x-auto overflow-y-hidden",
        className
      )}
    >
      {selectableMenus.map((item, index) => {
        const checked = menu === item.menu;
        return (
          <div className="relative" key={`tab_${item.menu}_${index}`}>
            {alert?.state && alert.alertIndex === index ? (
              <span className="absolute right-2 top-1 z-20 block h-1 w-1 rounded-full bg-red-500" />
            ) : null}
            <ContainTab
              id={item.menu}
              title={item.title}
              checked={checked}
              onClick={onClick}
              index={index}
            />
          </div>
        );
      })}
    </nav>
  );
}
