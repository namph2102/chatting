import { IactionSetting, TSettings } from "./VideoContext.constant";

export const handleChangeSetting = (key: keyof TSettings): IactionSetting => {
  return {
    payload: {
      type: key,
    },
  };
};
