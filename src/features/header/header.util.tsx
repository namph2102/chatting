import { BsRobot } from "react-icons/bs";
import {
  BiUserCircle,
  BiChat,
  BiBookHeart,
  BiPhoneCall,
  BiCog,
  BiBell,
} from "react-icons/bi";

import { SiderBar } from "../sidebar";
import NoticePage from "../Notice";
import CallHistory from "../call";

export const listMenu = [
  {
    title: "ChatBox",
    Icon: BsRobot,
    hiddenMoblie: true,
    component: SiderBar,
    path: "/",
  },
  {
    title: "Profile",
    Icon: BiUserCircle,
    hiddenMoblie: true,
    component: SiderBar,
    path: "/thong-tin",
  },
  {
    title: "Chat",
    Icon: BiChat,
    component: SiderBar,
    path: "/nhan-tin",
  },
  {
    title: "Contact",
    Icon: BiBookHeart,
    component: SiderBar,
    path: "/ho-tro",
  },
  {
    title: "Call",
    Icon: BiPhoneCall,
    component: CallHistory,
    path: "/call",
  },
  {
    title: "Thông báo",
    Icon: BiBell,
    component: NoticePage,
    path: "/thong-bao",
  },
  {
    title: "Settings",
    Icon: BiCog,
    component: SiderBar,
    path: "/cai-dat",
  },
];
