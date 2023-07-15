import { useEffect, useState } from "react";
import {
  RiArrowDropDownLine,
  RiArrowDropUpLine,
  RiBubbleChartFill,
  RiCheckFill,
} from "react-icons/ri";
import { cn } from "../../servies/utils";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../../redux";
import { updateTheme } from "../../redux/Slice/AccountSlice";
export const themeColor = [
  "78 172 109",
  "80 165 241",
  "97 83 204",
  "232 62 140",
  "239 79 111",
  "121 124 170",
];
const themeBg = [1, 2, 3, 4, 5, 6, 7, 8, 9];
const ThemeSettings = () => {
  const dispatch: AppDispatch = useDispatch();

  const [isOpenMore, setIsOpenMore] = useState(false);
  const [currentIndexColor, setCurrentIndexColor] = useState<any>(
    localStorage.getItem("primary-color") || 0
  );
  const [currentIndexBg, setCurrentIndexBg] = useState<any>(
    localStorage.getItem("themebackground") || 4
  );
  useEffect(() => {
    document.documentElement.style.setProperty(
      "--primary-color",
      themeColor[currentIndexColor]
    );
  }, [currentIndexColor]);
  const handleChangeThemeColor = (index: number) => {
    localStorage.setItem("primary-color", index.toString());
    setCurrentIndexColor(index);
  };
  const handleSetTingBg = (index: number) => {
    localStorage.setItem("themebackground", index.toString());
    dispatch(updateTheme({ backgroundthem: `/theme/theme${index}.png` }));
    setCurrentIndexBg(index);
  };
  return (
    <>
      <li
        onClick={() => setIsOpenMore(!isOpenMore)}
        className="flex cursor-pointer justify-between border-t-[0.5px] border-[#666666]  p-2 "
      >
        <div className="flex gap-2 items-center ">
          <span>
            <RiBubbleChartFill />
          </span>
          <span>Chủ đề</span>
        </div>
        <button className="text-3xl">
          {!isOpenMore ? <RiArrowDropDownLine /> : <RiArrowDropUpLine />}
        </button>
      </li>
      <div
        className={cn(
          "pl-2 relative text-sm gap-2 flex flex-col",
          isOpenMore ? "h-auto" : "h-0 overflow-hidden"
        )}
      >
        <h3 className="opacity-80">Chọn chủ đề :</h3>
        <div className="flex gap-1">
          {themeColor.map((theme, index) => {
            if (index == currentIndexColor) {
              return (
                <button
                  key={theme}
                  onClick={() => handleChangeThemeColor(index)}
                  style={{ backgroundColor: `rgba(${theme})` }}
                  className="w-8 h-8 rounded-full  flex justify-center items-center"
                >
                  <RiCheckFill />
                </button>
              );
            }
            return (
              <button
                key={theme}
                onClick={() => handleChangeThemeColor(index)}
                style={{ backgroundColor: `rgba(${theme})` }}
                className="w-8 h-8 rounded-full"
              ></button>
            );
          })}
        </div>
        <h3 className="opacity-80">Chọn chủ đề hình ảnh :</h3>
        <div className="flex sm:gap-1 gap-2 flex-wrap">
          {themeBg &&
            themeBg.map((theme) => {
              if (currentIndexBg == theme) {
                return (
                  <button
                    key={theme}
                    onClick={() => handleSetTingBg(theme)}
                    style={{ backgroundImage: `url(/theme/theme${theme}.png)` }}
                    className={` bg-repeat bg-cover flex  w-8 h-8 rounded-full border-[0.5px] border-[#555555] bg-center`}
                  >
                    <span className="m-auto">
                      {" "}
                      <RiCheckFill />
                    </span>
                  </button>
                );
              }
              return (
                <button
                  key={theme}
                  onClick={() => handleSetTingBg(theme)}
                  style={{ backgroundImage: `url(/theme/theme${theme}.png)` }}
                  className={` bg-repeat bg-cover w-8 h-8 rounded-full border-[0.5px] border-[#555555] bg-center`}
                ></button>
              );
            })}
        </div>
      </div>
    </>
  );
};

export default ThemeSettings;
