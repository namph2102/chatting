import { Tooltip } from "@mui/material";
import { FC } from "react";
import { IconType } from "react-icons/lib";
import { componentsProps } from "../../styles/componentsProps";
import { cn, deFaultIconSize } from "../../servies/utils";
import { NavLink } from "react-router-dom";

type MenuProps = {
  title: string;
  Icon: IconType;
  path: string;
  className?: string;
};
export const MenuItem: FC<MenuProps> = ({
  title,
  Icon,
  path,
  className = {},
}) => {
  // active ? "lg:border-r-main lg:border-r-2 text-main" : ""
  return (
    <li className={cn("cursor-pointer", className ? className : "")}>
      <NavLink to={path}>
        <span
          id="menu-sidebar_effect"
          className={cn("flex items-center  justify-center capitalize ")}
        >
          <Tooltip
            componentsProps={componentsProps}
            title={title}
            arrow
            placement="left"
            className="text-xl cursor-pointer"
          >
            <span className="lg">
              <Icon fontSize={deFaultIconSize} />
            </span>
          </Tooltip>
        </span>
      </NavLink>
    </li>
  );
};
