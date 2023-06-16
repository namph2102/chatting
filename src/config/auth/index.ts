import {
  signInWithPopup,
  signOut,
  GoogleAuthProvider,
  GithubAuthProvider,
  FacebookAuthProvider,
} from "firebase/auth";
import { getAuth } from "firebase/auth";
import { initializeApp } from "firebase/app";
import { ToastNotify } from "../../servies/utils";
const firebaseConfig = {
  apiKey: "AIzaSyAkuFJvNcT1PLvuSO1brsNSX1I8fvYbjj4",
  authDomain: "zeckyonline.firebaseapp.com",
  projectId: "zeckyonline",
  storageBucket: "zeckyonline.appspot.com",
  messagingSenderId: "505564513625",
  appId: "1:505564513625:web:cf9c3d6a50fc63242db848",
  measurementId: "G-CHZ3G6DPT3",
};
// const firebaseConfig = {
//   apiKey: "AIzaSyAcwVF4GyIPIPc1FOvK6NvColZ6HsqcCeo",
//   authDomain: "deloyweb-390006.firebaseapp.com",
//   projectId: "deloyweb-390006",
//   storageBucket: "deloyweb-390006.appspot.com",
//   messagingSenderId: "626121753176",
//   appId: "1:626121753176:web:15ce8b2dc850344a30402d",
//   measurementId: "G-VT2WJZ8VC8",
// };

const app = initializeApp(firebaseConfig);
class Authentication {
  authenticationFirebase = getAuth(app);
  signFacebook(responsiveLoggin: (re: any) => void) {
    const provider = new FacebookAuthProvider();

    signInWithPopup(this.authenticationFirebase, provider)
      .then((account) => {
        responsiveLoggin(account);
      })
      .catch((err) => {
        console.log(err.message);
        ToastNotify("Không thể kết nối bên thứ ba!").info();
      });
  }
  signGoogle(responsiveLoggin: (re: any) => void) {
    const provider = new GoogleAuthProvider();
    signInWithPopup(this.authenticationFirebase, provider)
      .then((account) => {
        responsiveLoggin(account);
      })
      .catch((err) => {
        console.log(err.message);
        ToastNotify("Không thể kết nối bên thứ ba!").info();
      });
  }
  signGithub(responsiveLoggin: (re: any) => void) {
    const provider = new GithubAuthProvider();
    signInWithPopup(this.authenticationFirebase, provider)
      .then((account) => {
        console.log(account);
        responsiveLoggin(account);
      })
      .catch((err) => {
        console.log(err.message);
        ToastNotify("Không thể kết nối bên thứ ba!").info();
      });
  }
  handleLogout() {
    signOut(getAuth())
      .then(() => {
        ToastNotify("Bạn đăng xuất thành công").success();
        window.localStorage.removeItem("accessToken");
      })
      .catch((err) => {
        console.log(err.message);
        ToastNotify("Bạn chưa đăng nhập").info();
      });
  }
}

export default new Authentication();
