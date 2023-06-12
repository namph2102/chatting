import { Route, Routes } from "react-router-dom";
import RegisterPage from "../../pages/register";
import Home from "../../pages/home";
import LoginPage from "../../pages/login";
import PageNotFound from "../../pages/error/PageNotFound";

const Layout = () => {
  return (
    <>
      <Routes>
        <Route path="/*" Component={Home}></Route>
        <Route path="dang-ky" Component={RegisterPage}></Route>
        <Route path="dang-nhap" Component={LoginPage}></Route>
        <Route path="404" element={<PageNotFound />} />
      </Routes>
    </>
  );
};

export default Layout;
