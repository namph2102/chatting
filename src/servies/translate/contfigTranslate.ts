import i18n from "i18next";
import { initReactI18next } from "react-i18next";
const personWorkChat = {
  vi: {
    ghim: "Tin nhắn đã ghim",
    ghimNot: "Chưa ghim tin nhắn nào",
    ghimNotice: "Tin nhắn đã ghim trong đoạn chat này sẽ hiển thị ở đây",
    removeGhim: "Bỏ Ghim",
    seeInMessage: "Xem trong đoạn chat",
    accept: "Chấp nhận",
    drop: "Kéo",
    drag: "thả",
    here: "tại đây",
    or: "hoặc",
    send: "gửi",
    to: "để",
    get: "Lấy",
    record: "Ghi âm",
    keypressToSpeak: "Nhấn vào để nói !",
    keyDownToSpeak: "Nhấn vào để dừng !",
    recordMessage: "Bạn không để kéo dài quá 6 phút",
    notSupport: "Trình duyệt không hỗ trợ",
    longitude: "Kinh độ",
    latitude: "Vĩ độ",
    separate: "Cách vị trí hiện tại",
    indexof: "Vị trí của",
    searchPlace: "Tên địa điểm muốn tìm?",
    zoomIn: "Phóng to",
    zoomOut: "Thu nhỏ",
    deleteMessage: "đã xóa nội dung này",
    cancel: "Hủy",
    codeScan: "Quét mã QR",
  },
  en: {
    cancel: "Cancel",
    deleteMessage: "deleted this message",
    zoomIn: "Zoom In",
    zoomOut: "Zoom Out",
    searchPlace: "The address you want to find?",
    indexof: "Index of",
    separate: "Distance from current location about",
    longitude: "Longitude",
    latitude: "Latitude",
    notSupport: "Browser don't support",
    get: "Get",
    ghim: "Message Ghimed",
    ghimNot: "Don't have ghim messages",
    ghimNotice: "Messages pinned in this chat will show up here",
    removeGhim: "Remove Ghim",
    seeInMessage: "See in box chat",
    accept: "Accept",
    to: "to",
    codeScan: "Scan Qr code",
    drop: "Drop",
    drag: "drag",
    here: "here",
    or: "or",
    send: "Send",
    record: "Record",
    keypressToSpeak: "Press into start speak !",
    keyDownToSpeak: "Press into stop speak !",
    recordMessage: "You can't speak over 6 minutes",
  },
};

const worksChat = {
  vi: {
    document: "Tài liệu",
    delete: "Xóa",
    boss: "Trưởng",
    memberSupport: "Người hỗ trợ",
    listFriend: "Danh sách bạn bè",
    listGroup: "Danh sách Nhóm",
    listMember: "Danh sách thành viên",
    online: "Đang hoạt động",
    offline: "Hoạt động",
    chatMessage: "Lời nhắn...",
    textcall: "Gọi điện",
    see: "Xem",
    size: "Kích thước",
    translateLng: "Dịch sang ngôn ngữ",
    typeLocation: "Nhập địa điểm muốn tìm hoặc bấm nút enter",
    open: "Mở",
    turnoff: "Tắt",
    openMore: "Mở rộng",
    closeopenMore: "Narrow",
    mandates: "Chức năng",
    img: "Ảnh",
    mp3: "Nhạc",
    weather: "Thời Tiết",
    location: "Tọa độ",
    translate: "Đọc Tệp",
    copy: "Sao chép",
    group: "nhóm",
    textDocument: "văn bản",
    commentChatBot:
      "Chào mừng bạn đã đến với Zecky! Hiện tại Website vẫn đang trong giai đoạn phát triển. Rất vui và hãy sử dụng một số tiện ích có sẵn được xây dựng bởi ChatGPT phiên bản Plus hoàn toàn miễn phí tại chúng tôi. </br> Cảm ơn bạn đã sử dụng!",
    infomationNotEnough: "Vui lòng cung cấp thêm thông tin ?",
    severError:
      "Hiện tại máy chủ  quá tải hoặc đang bị lỗi! Bạn vui lòng liên hệ Admin Zecky nha!",
    keyword: "từ khóa",
    syntax: "Cú pháp",
    plsWating: "Vui lòng chờ đợi trong ít giây bạn nhé!",
    temperature: "Nhiệt độ",
    windspeed: "Tốc độ giá",
    createCall: "đã tạo cuộc gọi",
    humidity: "Độ ẩm",
    pressure: "Áp xuất",
    you: "Bạn",
    edit: "Chỉnh sửa",
    edited: "đã chỉnh sửa",
    joinNow: "Tham gia ngay!",
    createRoomCall: "đang tạo phòng họp mặt",
    dialogbox: "Thông tin hộp thoại",
    noHaveShareImage: "Chưa có nội dung ảnh được chia sẻ trong hội thoại này?",
    noHaveShareLink: "Chưa đường dẫn được chia sẻ trong hội thoại này?",
    noHaveShareDocument: "Chưa tài liệu được chia sẻ trong hội thoại này?",
    invited: "lời mời",
    isJoined: "đã tham gia",
    join: "tham gia",
    leave: "Rời",
    agree: "Đồng ý",
    refuse: "Từ chối",
    findSeachinListFriends: "Tìm kiếm trong danh sách bạn bè..",
  },
  en: {
    findSeachinListFriends: "Search in the list of friends",
    isJoined: "Joined",
    join: "join",
    invited: "lời mời",
    boss: "Boss",
    agree: "Accept",
    refuse: "Refuse",
    noHaveShareImage: "No  photo shared",
    noHaveShareLink: "No  Link shared",
    noHaveShareDocument: "No  document shared",
    dialogbox: "Dialog Info",
    createRoomCall: "creating room call",
    joinNow: "Join Now",
    you: "You",
    edit: "Edit",
    edited: "edited",
    createCall: "Created one call",
    temperature: "Temperature",
    windspeed: "Wind Speed",
    humidity: "Humidity",
    pressure: "Pressure",
    closeopenMore: "Thu hẹp",
    plsWating: "Please wait for a few seconds!",
    keyword: "keyword",
    syntax: "Sytax",
    document: "Documents",
    delete: "Delete",
    memberSupport: "Helper",
    listFriend: "Friends",
    listGroup: "Groups",
    listMember: "Members",
    group: "group",
    leave: "Leave",
    online: "Online",
    offline: "Offline",
    chatMessage: "Type Your Message...",
    textcall: "Call",
    see: "View",
    size: "Size",
    translateLng: "Chose Language translation",
    typeLocation: "Type your Localtion or keypress endter",
    open: "Open",
    turnoff: "Turn Off",
    openMore: "Open More",
    mandates: "Mandates",
    mp3: "Mp3",
    weather: "weather",
    location: "location",
    translate: "translate",
    img: "Image",
    copy: "Copy",
    textDocument: "document",
    infomationNotEnough: "Can you please provide more information?",
    severError:
      "Currently the server is overload or  is down! Please contact Admin Zecky!",
    commentChatBot:
      "Welcome to Zecky! The website is still in development stage. Have fun and use some of the available utilities built by ChatGPT Plus version completely free at us.Thank you for using!",
  },
};
const worksSidebar = {
  vi: {
    chatbox: "Nhắn tin",
    profile: "Hồ sơ",
    chats: "Danh sách nhắn tin",
    contact: "Danh sách bạn theo chữ cái",
    call: "Lịch sử gọi",
    notice: "Thông báo",
    settings: "Cài đặt",
    yourprofile: "Hồ sơ của bạn",
    name: "Tên",
    logout: "Đăng xuất",
    change: "thay đổi",
    info: "thông tin",
    history: "Lịch sử",

    donthavenotice: "Hiện tại vẫn chưa có thông báo nào",
    update: "Cập nhập",
    avatar: "ảnh đại diện",
    backgroundAvatar: "ảnh bìa",
    themes: "Chủ đề",
    theme: "chủ đề",
    image: "ảnh",
    chose: "Chọn",
    language: "Ngôn ngữ",
    dontfriend: "Bạn chưa có bạn bè",
    weatherNow: "Thời tiết hôm nay của bạn",
  },
  en: {
    chatbox: "ChatBox",
    profile: "Profile",
    chats: "Chats",
    contact: "Contact",
    call: "Call history",
    notice: "Notice",
    settings: "Settings",
    yourprofile: "Your Profie",
    name: "Name",
    logout: "Logout",
    change: "Change",
    info: "infomation",

    history: "Lịch sử",
    donthavenotice: "You currently have no notifications",
    update: "Update",
    avatar: "Avatar",
    backgroundAvatar: "cover image",
    themes: "Themes",
    image: "image",
    chose: "Chose",
    language: "languages",
    dontfriend: "You don't have friends",
    theme: "theme ",
    weatherNow: "Your Weather Now",
  },
};
const resources = {
  vi: {
    translation: {
      ...personWorkChat.vi,
      ...worksChat.vi,
      ...worksSidebar.vi,
      searchFriends: "Tìm kiếm bạn bè tại đây...",
      member: "thành viên",
      search: "Tìm kiếm",
      resultSearch: "Kết quả tìm kiếm",
      createRoom: "Tạo phòng",
      seeAll: "Xem tất cả",
      recently: "Gần đây",
      close: "Đóng thẻ",
      login: "Đăng nhập",
      register: "Đăng ký",
      friend: "bạn bè",
      follower: "người theo dõi",
      roommate: "Bạn chung",
      waitingAccept: "Chờ xác nhận",
      addfriend: "Thêm bạn bè",
      makeFriend: "Kết bạn",
      chat: "Nhắn tin",
      fullname: "Họ và tên",
      des: "Mô tả ",
      phone: "số điện thoại",
      attention: "Chý ý",
      home: "Trang chủ",
      acceptMyTerm: "Chấp nhận chính sách của tôi",
      severError: "Máy chủ đang bị lỗi",
      welcomeToMywebsite: "Chào bạn đã đến với",
      letChatWithFriends: "Cùng trò chuyện với bạn bè nào",
      account: "Tài khoản",
      username: "Tài khoản",
      password: "Mật khẩu",
      type: "Nhập",
      content: "nội dung",
      show: "Hiện",
      hidden: "Ẩn",
      dontAccount: "Bạn chưa có tài khoản",
      haveAccount: "Bạn đã có tài khoản",
      have: "có",
      now: "ngay",
      current: "hiện tại",
      created: "được tạo bởi",
      cantUse: "Có thể sử dụng với",
      inputRequired: "không được để trống",
      inputExceed: "không vượt quá",
      character: "ký tự",
      only: "chỉ",
      and: "và",

      minis: "Ít nhất là",
      includes: "bao gồm",
      nothave: "không có",
      alphabet: "chữ cái",
      space: "khoảng cách",
      number: "chữ số",
      registerDes: "Tạo tài khoản miễn phí của bạn ngay đây thôi.",
      success: "thành công",
      error: "thất bại",
      not: "không",
      formatIs: "định dạng là",
      format: "định dang",
      address: "Địa chỉ",
      add: "Thêm",
      kick: "Kích",
      room: "Phòng",
      createNameRoom: "Vui lòng đặt tên phòng!",
    },
  },
  en: {
    translation: {
      ...personWorkChat.en,
      ...worksChat.en,
      ...worksSidebar.en,
      add: "Add",
      searchFriends: "Search your friends here...",
      search: "Search keywords",
      resultSearch: "Result search",
      createRoom: "Create Room",
      createNameRoom: "Please Put your room's name!",
      seeAll: "See all",
      makeFriend: "Add friend",
      kick: "Kick",
      recently: "Recently",
      close: "Close Tag",
      login: "Login",
      member: "member",
      current: "current",
      register: "Register",
      friend: "friend",
      waitingAccept: "Waiting for confirmation",
      roommate: "Ally ",
      room: "Room",
      follower: "followers",
      addfriend: "Add Friend",
      chat: "Chat Now",
      fullname: "Full Name",
      des: "Description about",
      phone: "Phone Number",
      attention: "Attention",
      severError: "Sever Error",
      welcomeToMywebsite: "Wellcome To",
      home: "Home",
      letChatWithFriends: "Let's chat with your friends",
      account: "Account",
      username: "UserName",
      password: "Password",
      type: "Enter Your",
      content: "Content",
      show: "Show",
      hidden: "Hide",
      now: "now",
      dontAccount: "You don't have account",
      haveAccount: "You had account",
      created: "Created by",
      cantUse: "You can use with",
      inputRequired: "must have value",
      inputExceed: "cant exceed",
      character: "characters",
      only: "only",
      minis: "at least of",
      includes: "includes",
      nothave: "dont have",
      and: "and",
      alphabet: "alphabet",
      space: "space",
      have: "have",
      number: "number",
      registerDes: "Let's created your account right now.",
      acceptMyTerm: "Please accept my term",
      success: "success",
      error: "error",
      not: "not",
      formatIs: "format is",
      format: "format",
      address: "Address",
    },
  },
};
i18n.use(initReactI18next).init({
  resources,
  lng: "vi",
  fallbackLng: "vi",
  interpolation: {
    escapeValue: false,
  },
});
export const YourTranstionPlace = "text";
