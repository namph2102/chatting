import { Route, Routes } from "react-router-dom";
import RegisterPage from "../../pages/register";
import Home from "../../pages/home";
import LoginPage from "../../pages/login";
import PageNotFound from "../../pages/error/PageNotFound";
import CrawlWebsite from "../../pages/CrawlWebsite";
import SearchPage from "../../pages/SearchPage";
import JoinGroup from "../../pages/JoinGroup";
// import Profile from "../../pages/profile";

const Layout = () => {
  return (
    <>
      <Routes>
        <Route path="/*" Component={Home}></Route>
        <Route path="dang-ky" Component={RegisterPage}></Route>
        <Route path="dang-nhap" Component={LoginPage}></Route>
        <Route path="blog" element={<CrawlWebsite />} />
        <Route path="trang-khong-ton-tai" element={<PageNotFound />} />
        <Route path="tim-kiem" element={<SearchPage />} />
        <Route path="g/*" element={<PageNotFound />} />
        <Route path="g/:nameGroup" element={<JoinGroup />} />
        {/* <Route path="thong-tin/:slug" element={<Profile />} />
        <Route path="thong-tin" element={<Profile />} /> */}
        <Route path="tim-kiem/sai-cu-phap" element={<PageNotFound />} />
      </Routes>
    </>
  );
};

export default Layout;
