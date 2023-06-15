import { Route, Routes } from "react-router-dom";
import { listMenu } from "../header/header.util";
import { useSelector } from "react-redux";
import { RootState } from "../../redux";
import { cn } from "../../servies/utils";
import Notice from "../Notice";

const LayoutSidebar = () => {
  const { theme } = useSelector((state: RootState) => state.userStore);
  return (
    <section
      id={theme.darkmode}
      className={cn(
        "lg:min-w-[300px] min-w-full  py-6 px-2 bg-aside ",
        theme.darkmode == "light-mode"
          ? "border-r-[#d5d5d5] border-r-[1px]"
          : ""
      )}
    >
      <Routes>
        {listMenu.map((menu) => {
          const Element = menu.component;
          return (
            <Route key={menu.title} path={menu.path} element={<Element />} />
          );
        })}
        <Route path="/thong-bao" element={<Notice />} />
      </Routes>
    </section>
  );
};

export default LayoutSidebar;
