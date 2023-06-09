import { Route, Routes } from "react-router-dom";
import Register from "../register";
import Home from "../../pages/home";

const Layout = () => {
  return (
    <>
      <Routes>
        <Route path="/*" Component={Home}></Route>
        <Route path="dang-ky" Component={Register}></Route>
      </Routes>
    </>
  );
};

export default Layout;
