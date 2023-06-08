import { BsRobot } from "react-icons/bs";
import {
  BiUserCircle,
  BiChat,
  BiBookHeart,
  BiPhoneCall,
  BiBookmarks,
  BiCog,
} from "react-icons/bi";

import { SiderBar } from "../sidebar";
import Bookmark from "../boorkmark";
import Video from "../../components/webmedia/Video";
import SpotifySearch from "../../components/chatContainer/component/spotify";

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
    path: "profile",
  },
  {
    title: "Chat",
    Icon: BiChat,
    component: SiderBar,
    path: "chat",
  },
  {
    title: "Contact",
    Icon: BiBookHeart,
    component: SiderBar,
    path: "contact",
  },
  {
    title: "Call",
    Icon: BiPhoneCall,
    component: Video,
    path: "call",
  },
  {
    title: "Bookmarks",
    Icon: BiBookmarks,
    component: SpotifySearch,
    path: "bookmark",
  },
  {
    title: "Settings",
    Icon: BiCog,
    component: Bookmark,
    path: "setting",
  },
];
