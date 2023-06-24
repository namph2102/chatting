import instance from "../../../config";
// nếu không có phòng thì tạo phòng còn nếu có thì lấy dữ liệu comment  trên phòng
export const handleRoomChat = (_idAccount: string, _idPerson: string) => {
  return instance.post("/room/create", {
    data: { accountid: _idAccount, personid: _idPerson },
  });
};
export const containsLink = (str: string) => {
  const pattern = /(http|https):\/\/\S+/i;
  return pattern.test(str);
};
export const coverTimeMS = (time: number) => {
  if (!time) return `00:00`;
  if (time < 60) return `00:${time.toFixed(0).padStart(2, "0")}`;
  const minute = Math.floor(time / 60);
  return `${minute.toFixed(0).padStart(2, "0")}:${Math.floor(time - minute * 60)
    .toFixed(0)
    .padStart(2, "0")}`;
};
export const convertToBase64 = (
  blob: Blob,
  Callback: (base64: any) => void
) => {
  const reader = new FileReader();

  reader.onloadend = () => {
    const base64Data = reader.result;
    Callback(base64Data);
  };

  reader.readAsDataURL(blob);
};
