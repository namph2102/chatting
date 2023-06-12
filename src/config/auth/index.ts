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
  apiKey: "AIzaSyC4a_mnRcdaY-f7pavxK-M3uHKwGwdVrHk",
  authDomain: "zecky-389602.firebaseapp.com",
  projectId: "zecky-389602",
  storageBucket: "zecky-389602.appspot.com",
  messagingSenderId: "160928656569",
  appId: "1:160928656569:web:ce9ccd7722233b699f7f68",
  measurementId: "G-CZ1JZJJ6BG",
};
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
