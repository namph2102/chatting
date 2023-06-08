import React, { FC } from "react";
import * as styles from "./toptip.module.scss";
import { cn } from "../../../servies/utils";
interface ToltipProviderProps {
  title: string;
  className?: string;
  children: React.ReactNode;
}

const ToltipProvider: FC<ToltipProviderProps> = ({
  title,
  children,
  className,
}) => {
  const classStyle: any = styles;
  return (
    <div
      data-title={title}
      className={cn(classStyle.toptip, "relative inline-block", className)}
    >
      {children}
    </div>
  );
};

export default ToltipProvider;
