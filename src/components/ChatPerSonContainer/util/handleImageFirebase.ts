import {
  ref,
  uploadBytes,
  deleteObject,
  listAll,
  getMetadata,
  getDownloadURL,
} from "firebase/storage";
import { storageFirebase } from "../../../config/auth";
import { nanoid } from "@reduxjs/toolkit";
class HandleImageFireBase {
  uploadimage(name = "chats", file: File) {
    const imageUrl = `${name}/${nanoid()}`;
    const fileName = file.name;

    const uploadTask = ref(storageFirebase, imageUrl);
    return uploadBytes(uploadTask, file)
      .then(async (res) => {
        const urlLink = await this.getUlrDownload(res.metadata.fullPath);

        return {
          url: urlLink,
          fileName,
          path: res.metadata.fullPath,
          size: res.metadata.size,
        };
      })
      .catch((err) => {
        console.log(err);
      });
  }
  deleteImage(path: string) {
    const desertRef = ref(storageFirebase, path);
    return deleteObject(desertRef)
      .then(() => {
        console.log("Xóa thành công");
      })
      .catch((error) => {
        console.log(error);
      });
  }
  getImage(path: string) {
    const forestRef = ref(storageFirebase, path);
    return getMetadata(forestRef).then((metadata) => {
      console.log(metadata.generation);
    });
  }
  getUlrDownload(path: string) {
    const imageRef = ref(storageFirebase, path);
    return getDownloadURL(imageRef).then((url) => url);
  }
  deleteForder(nameForder: string) {
    const listImageRef = ref(storageFirebase, nameForder + "/");
    listAll(listImageRef).then((response) => {
      response.items.forEach((itemRef) => {
        this.deleteImage(itemRef.fullPath);
      });
    });
  }
}
export default new HandleImageFireBase();
