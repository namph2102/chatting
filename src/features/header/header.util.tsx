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
import SettingsSidebar from "../setting";
import ContactSidebar from "../contact";

export const listMenu = [
  {
    title: "chatbox",
    Icon: BsRobot,
    hiddenMoblie: true,
    component: SiderBar,
    path: "/*",
  },

  {
    title: "profile",
    Icon: BiUserCircle,
    hiddenMoblie: true,
    component: SettingsSidebar,
    path: "/thong-tin",
  },
  {
    title: "chats",
    Icon: BiChat,
    component: SiderBar,
    path: "/nhan-tin",
  },
  {
    title: "contact",
    Icon: BiBookHeart,
    component: ContactSidebar,
    path: "/ho-tro",
  },
  {
    title: "call",
    Icon: BiPhoneCall,
    component: CallHistory,
    path: "/call",
  },
  {
    title: "notice",
    Icon: BiBell,
    component: NoticePage,
    path: "/thong-bao",
  },
  {
    title: "settings",
    Icon: BiCog,
    component: SettingsSidebar,
    path: "/cai-dat",
  },
];
