import { Route, Routes } from "react-router-dom";
import { listMenu } from "../header/header.util";
import { useSelector } from "react-redux";
import { RootState } from "../../redux";

const LayoutSidebar = () => {
  const { theme } = useSelector((state: RootState) => state.userStore);
  return (
    <section
      id={theme.darkmode}
      className="lg:min-w-[300px] min-w-full  py-6 px-2 bg-aside"
    >
      <Routes>
        {listMenu.map((menu) => {
          const Element = menu.component;
          return (
            <Route
              key={menu.title}
              path={menu.path}
              element={<Element search={""} />}
            />
          );
        })}
      </Routes>
    </section>
  );
};

export default LayoutSidebar;
