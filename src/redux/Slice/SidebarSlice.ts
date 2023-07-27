import { createSlice } from "@reduxjs/toolkit";
import { AppDispatch } from "..";
import instance from "../../config";
import {
  IFriend,
  IListrooms,
  ISidebarSlice,
  TlistGroupsMap,
  typeMapItem,
} from "./slice.type";
import { socket } from "../../components/ChatPerSonContainer/ChatPerSonContainer";
import { updateRoomsAccount } from "./AccountSlice";
type IKeyOf = keyof IFriend;
const initStateSidebar: ISidebarSlice = {
  listFriends: [],
  listGroups: {},
  listRoomGroups: [],
};
const SidebarSlice = createSlice({
  name: "sidebar",
  initialState: initStateSidebar,
  reducers: {
    updateFristSidebarLogin(state, action) {
      state.listFriends = action.payload.listFriends;
      state.listGroups = action.payload.listGroups;
      state.listRoomGroups = action.payload.listRoomGroups;
    },
    updateStatusSidebar(
      state: ISidebarSlice,
      action: {
        payload: { idFriend: string; status: boolean; timeOff: string };
      }
    ) {
      const itemFindFriends = state.listFriends.find(
        (friend) => friend._id == action.payload.idFriend
      );

      if (itemFindFriends) {
        itemFindFriends.status = action.payload.status;
        itemFindFriends.timeOff = new Date().toISOString();
      }
    },
    updateInfoNameFriend(state, action) {
      const { id, value } = action.payload;
      const key: IKeyOf = action.payload.key;
      const indexFriend = state.listFriends.findIndex((f) => f._id == id);
      if (indexFriend >= 0 && key && value) {
        if (state.listFriends[indexFriend][key] != value) {
          if (key == "fullname" || key == "avatar") {
            state.listFriends[indexFriend][key] = value;
          }
        }
      }
    },
  },
});
export default SidebarSlice.reducer;
export const { updateStatusSidebar, updateInfoNameFriend } =
  SidebarSlice.actions;
export const getDataListFriend = (idUser: string) => {
  return (dispatch: AppDispatch) => {
    instance
      .post("/user/listfriend", { data: idUser, method: "post" })
      .then((res) => res.data)
      .then((res) => {
        if (res) {
          if (res.accountRoom?.rooms?.length > 0) {
            dispatch(updateRoomsAccount(res.accountRoom.rooms));
          }

          // const listfriends = res.listfriends.friends;
          // nếu bạn bè off line thì chuyển sang false luôn
          const listRooms: IListrooms[] = res.listfriends.rooms;

          const listChatFriends: IFriend[] = [];
          const listChatGroups: TlistGroupsMap<typeMapItem> = {};
          const listRoomGroups: IFriend[] = [];

          listRooms.forEach((item) => {
            if (item.type == "friend") {
              const friend = item.listUser.filter((item) => item._id != idUser);

              if (friend[0]) {
                listChatFriends.push({
                  ...friend[0],
                  idRoom: item._id,
                  typechat: item.type,
                });
              }
            } else if (item.type == "group") {
              if (item._id) {
                socket.emit("join-in-group-all", item._id);
              }

              listRoomGroups.push({
                fullname: item.name,
                idRoom: item._id,
                typechat: item.type,
                _id: item._id,
                avatar: item?.avatar?.url || "/images/group.png",
                des: item?.des || "",
                status: true,
                timeOff: new Date().toISOString(),
              });
              listChatGroups[item._id] = {
                name: item.name,
                idRoom: item._id,
                typechat: item.type,
                listUser: item.listUser,
                role: item.role,
                des: item?.des || "",
              };
            }
          });

          dispatch(
            SidebarSlice.actions.updateFristSidebarLogin({
              listFriends: listChatFriends,
              listGroups: listChatGroups,
              listRoomGroups,
            })
          );
        }
      });
  };
};
