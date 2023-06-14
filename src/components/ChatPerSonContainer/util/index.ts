import instance from "../../../config";
// nếu không có phòng thì tạo phòng còn nếu có thì lấy dữ liệu comment  trên phòng
export const handleRoomChat = (_idAccount: string, _idPerson: string) => {
  return instance.post("/room/create", {
    data: { accountid: _idAccount, personid: _idPerson },
  });
};
