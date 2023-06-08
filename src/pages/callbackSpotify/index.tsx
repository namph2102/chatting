import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import { AppDispatch } from "../../redux";
import { updateAccesTokenSpotify } from "../../redux/Slice/AccountSlice";
import { LoaddingOverLay } from "../../components/loading";
import { ToastNotify } from "../../servies/utils";
import { setClientToken } from "../../components/chatContainer/component/spotify/spotify.contant";

const CallbackSoptify = () => {
  const location = useLocation();

  const navigate = useNavigate();
  const dispatch: AppDispatch = useDispatch();

  useEffect(() => {
    if (!location.hash) {
      return;
    }
    const hash = location.hash.split("&");
    const _token = hash[0].split("=")[1];

    ToastNotify("Kết nối thành công với Spotify").success();
    setClientToken(_token);

    dispatch(updateAccesTokenSpotify(_token));

    const idTimeout = setTimeout(() => {
      navigate("/");
    }, 1000);
    return () => {
      clearTimeout(idTimeout);
    };
  }, [dispatch, location.hash, navigate]);
  if (!location.hash) return <></>;

  return (
    <div>
      <LoaddingOverLay />
    </div>
  );
};

export default CallbackSoptify;
