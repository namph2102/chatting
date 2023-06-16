import clsx, { ClassValue } from "clsx";
import { toast } from "react-toastify";
import { twMerge } from "tailwind-merge";
import moment from "moment";
export function cn(...classnames: ClassValue[]) {
  return twMerge(clsx(classnames));
}
export function ScroolToBottom(element: HTMLElement, time = 1000) {
  if (time == 0) {
    element.scrollTo(0, element.scrollHeight + 4);
    return;
  }
  const idTimeout = setTimeout(() => {
    element.scrollTo(0, element.scrollHeight + 4);

    clearTimeout(idTimeout);
  }, time);
}

export const ToastNotify = (message = "", icon?: string) => {
  const options: any = {
    position: "top-right",
    autoClose: 2000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
    theme: "dark",
  };
  if (icon) options.icon = icon;
  return {
    normal(suboptions?: Omit<typeof options, "theme">) {
      return toast(message, { ...options, ...suboptions });
    },
    success(suboptions?: Omit<typeof options, "theme">) {
      return toast.success(message, { ...options, ...suboptions });
    },
    error(suboptions?: Omit<typeof options, "theme">) {
      return toast.error(message, { ...options, ...suboptions });
    },
    warning(suboptions?: Omit<typeof options, "theme">) {
      return toast.warning(message, { ...options, ...suboptions });
    },
    info(suboptions?: Omit<typeof options, "theme">) {
      return toast.info(message, { ...options, ...suboptions });
    },
  };
};

export function handleStopPropagation<T extends React.MouseEvent>(
  e: T
): unknown {
  return e.stopPropagation();
}
export function Debounced(callback: () => void, delay: number) {
  delay = delay || 0;
  let timeId: number | undefined | any;
  console.log("time  next at", timeId);
  return () => {
    console.log("time  previos at", timeId);
    if (timeId) {
      clearTimeout(timeId);
      timeId = undefined;
    }
    timeId = setTimeout(() => {
      callback();

      clearTimeout(timeId);
    }, delay);
  };
}

export function historyChatting(nameLocal: string) {
  let prevValue = [];
  if (typeof window !== "undefined") {
    if (localStorage.getItem(nameLocal)) {
      prevValue = JSON.parse(localStorage.getItem(nameLocal) || "");
    }
  }
  const searchListSearch: any[] = prevValue || [];

  const save = () => {
    localStorage.setItem(nameLocal, JSON.stringify(searchListSearch));
  };
  const isExtended = (_id: string) => {
    return searchListSearch.findIndex((item) => item._id == _id) !== -1;
  };
  const store = {
    getAll: () => {
      return searchListSearch;
    },
    getFollow: (size: number) => {
      if (searchListSearch.length < size) {
        return searchListSearch;
      }

      return searchListSearch.slice(
        searchListSearch.length - size,
        searchListSearch.length
      );
    },
    getOne: (_id: string) => {
      return searchListSearch.find((item) => item._id == _id);
    },
    add: (account: any) => {
      if (isExtended(account._id)) return;
      searchListSearch.push(account);
      save();
    },

    delete: (_id: string) => {
      if (!isExtended(_id)) return false;
      const index = searchListSearch.findIndex((item) => item._id == _id);
      searchListSearch.splice(index, 1);
      save();
    },
  };
  return store;
}
export const customeValue = (str: string) => {
  return str.trim().replace(/\s{2}/g, " ").toLowerCase();
};

export const callbackResponse = (message: string, status: number) => {
  if (status === 404) {
    ToastNotify(message).error();
  } else {
    ToastNotify(message).success();
  }
};

export function CapitalizeString(str: string) {
  if (str.includes(" ")) {
    return str
      .split(" ")
      .map((text) => text[0].toUpperCase() + text.slice(1, text.length))
      .join(" ");
  } else return str.replace(/\b\w/g, (l) => l.toUpperCase());
}
export const deFaultIconSize = "1.5rem";

const timeSetTing: any = {
  months: "tháng",
  month: "tháng",
  years: "năm",
  year: "năm",
  minute: "phút",
  minutes: "phút",
  day: "ngày",
  days: "ngày",
  hours: "giờ",
  hour: "giờ",
  second: "giây",
  seconds: "giây",
};
export function HandleTimeDiff(timestamp: any) {
  let result: any = moment(timestamp).fromNow();
  if (result.includes("a few seconds ago")) return "vài giây trước";
  if (result[1] === "n") {
    result = result.replace("an", "1");
  } else if (result[0] === "a") {
    result = result.replace("a", "1");
  }

  result = result.replace("ago", "trước");
  result = result.split(" ");

  if (timeSetTing[result[1]]) {
    result[1] = timeSetTing[result[1]];
  }
  return result.join(" ");
}
