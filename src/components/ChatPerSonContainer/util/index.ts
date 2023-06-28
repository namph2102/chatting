import instance from "../../../config";
// nếu không có phòng thì tạo phòng còn nếu có thì lấy dữ liệu comment  trên phòng
export const handleRoomChat = (
  roomid: string,
  _idAccount: string,
  _idPerson: string
) => {
  return instance.post("/room/create", {
    data: { accountid: _idAccount, personid: _idPerson, roomid: roomid },
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

export const sortArrayFollowKey = (arr: any[], key: string) => {
  if (arr.length <= 1) {
    return arr;
  }
  quicksort(arr, 0, arr.length - 1, key);
  return arr;
};
const quicksort = (list: any[], left: number, right: number, key: string) => {
  const pilot = list[Math.floor((right + left) / 2)][key];
  let l = left;
  let r = right;
  let tam;
  console.log(pilot);
  do {
    while (list[l][key] < pilot) {
      l++;
    }
    while (list[r][key] > pilot) {
      r--;
    }
    if (l <= r) {
      tam = list[l][key];
      list[l][key] = list[r][key];
      list[r][key] = tam;
      l++;
      r--;
    }
  } while (l <= r);
  if (left < r) {
    quicksort(list, left, r, key);
  }
  if (l < right) {
    quicksort(list, l, right, key);
  }
};
export const handleCoverSize = (size: number) => {
  if (!size) return 0;
  return size > 1024
    ? (size / 1024).toFixed(2) + " MB"
    : size.toFixed(2) + " KB";
};
