import {
  signInWithPopup,
  signOut,
  GoogleAuthProvider,
  GithubAuthProvider,
  FacebookAuthProvider,
} from "firebase/auth";
import { getAuth } from "firebase/auth";
import { initializeApp, getApp, getApps } from "firebase/app";
import { getStorage } from "firebase/storage";
import { getFirestore } from "firebase/firestore";

import { ToastNotify } from "../../servies/utils";
// const firebaseConfig = {
//   apiKey: "AIzaSyAkuFJvNcT1PLvuSO1brsNSX1I8fvYbjj4",
//   authDomain: "zeckyonline.firebaseapp.com",
//   projectId: "zeckyonline",
//   storageBucket: "zeckyonline.appspot.com",
//   messagingSenderId: "505564513625",
//   appId: "1:505564513625:web:cf9c3d6a50fc63242db848",
//   measurementId: "G-CHZ3G6DPT3",
// };
const firebaseConfig = {
  apiKey: "AIzaSyCUuogh8hEj9O4OraQsYE3eanaMUxs3TDA",
  authDomain: "test-c887e.firebaseapp.com",
  projectId: "test-c887e",
  storageBucket: "test-c887e.appspot.com",
  messagingSenderId: "128310947725",
  appId: "1:128310947725:web:0c61fde9baf1011b65d7c4",
  measurementId: "G-G05WT46T62"
};

const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
export const dbFirebase = getFirestore();
export const storageFirebase = getStorage(app);
class Authentication {
  authenticationFirebase = getAuth(app);
  signFacebook(responsiveLoggin: (re: any) => void) {
    const provider = new FacebookAuthProvider();

    signInWithPopup(this.authenticationFirebase, provider)
      .then((account) => {
        responsiveLoggin(account);
      })
      .catch(() => {    
      });
  }
  signGoogle(responsiveLoggin: (re: any) => void) {
    const provider = new GoogleAuthProvider();
    signInWithPopup(this.authenticationFirebase, provider)
      .then((account) => {
        responsiveLoggin(account);
      })
      .catch(() => {
      });
  }
  signGithub(responsiveLoggin: (re: any) => void) {
    const provider = new GithubAuthProvider();
    signInWithPopup(this.authenticationFirebase, provider)
      .then((account) => {
        responsiveLoggin(account);
      })
      .catch(() => {
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
