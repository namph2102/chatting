const settingVideo = {
  isMic: true,
  isVolume: true,
  isCamera: false,
  isChatting: false,
  isHandle: false,
  isLeave: false,
  isShareDisplay: false,
  isZoom: false,
  isShowListUsers: false,
};
export type TSettings = typeof settingVideo;
export interface IactionSetting {
  payload: {
    type: keyof TSettings;
  };
}
export function openFullscreen(id: string, isOpen = true) {
  try {
    const elem: any = document.querySelector(id);
    if (!elem) return;
    if (!isOpen && elem.requestFullscreen && document) {
      document.exitFullscreen();
      return;
    }
    if (elem.requestFullscreen) {
      elem.requestFullscreen();
    } else if (elem.webkitRequestFullscreen) {
      /* Safari */
      elem.webkitRequestFullscreen();
    } else if (elem.msRequestFullscreen) {
      /* IE11 */
      elem.msRequestFullscreen();
    }
  } catch (err: { message: string } | any) {
    console.error(err.message);
  }
}
export { settingVideo };
