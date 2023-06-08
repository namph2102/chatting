import { Route, Routes } from "react-router-dom";
import Register from "../register";
import Home from "../../pages/home";
import CallbackSoptify from "../../pages/callbackSpotify";
const Layout = () => {
  return (
    <>
      <Routes>
        <Route path="callback/spotify" Component={CallbackSoptify}></Route>
        <Route path="/*" Component={Home}></Route>
        <Route path="dang-ky" Component={Register}></Route>
      </Routes>
    </>
  );
};

export default Layout;
