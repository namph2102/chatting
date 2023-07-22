import { ref, listAll, getMetadata, getDownloadURL } from "firebase/storage";
import { storageFirebase } from "../../../config/auth";
import instance, { domainserver } from "../../../config";

// import { nanoid } from "@reduxjs/toolkit";
// class HandleImageFireBase {
//   uploadimage(name = "chats", file: File) {
//     const imageUrl = `${name}/${nanoid()}`;
//     const fileName = file.name;
//     console.log(file);
//     const uploadTask = ref(storageFirebase, imageUrl);
//     return uploadBytes(uploadTask, file)
//       .then(async (res) => {
//         const urlLink = await this.getUlrDownload(res.metadata.fullPath);

//         return {
//           url: urlLink,
//           fileName,
//           path: res.metadata.fullPath,
//           size: res.metadata.size,
//         };
//       })
//       .catch((err) => {
//         console.log(err);
//       });
//   }
//   deleteImage(path: string) {
//     const desertRef = ref(storageFirebase, path);
//     return deleteObject(desertRef)
//       .then(() => {
//         console.log("Xóa thành công");
//       })
//       .catch((error) => {
//         console.log(error);
//       });
//   }
//   getImage(path: string) {
//     const forestRef = ref(storageFirebase, path);
//     return getMetadata(forestRef).then((metadata) => {
//       console.log(metadata.generation);
//     });
//   }
//   getUlrDownload(path: string) {
//     const imageRef = ref(storageFirebase, path);
//     return getDownloadURL(imageRef).then((url) => url);
//   }
//   deleteForder(nameForder: string) {
//     const listImageRef = ref(storageFirebase, nameForder + "/");
//     listAll(listImageRef).then((response) => {
//       response.items.forEach((itemRef) => {
//         this.deleteImage(itemRef.fullPath);
//       });
//     });
//   }
// }

class HandleImageFireBase {
  uploadimage(name = "chats", file: File) {
    console.log(name);
    const formdata = new FormData();
    formdata.append("file", file);

    return fetch(domainserver + "upload", {
      body: formdata,
      method: "POST",
    })
      .then((res) => res.json())
      .then(async (res) => {
        const fileData = res.fileInform;
        return fileData;
      })
      .catch(() => {
        return "Thất bại";
      });
  }
  deleteImage(path: string) {
    return instance
      .post("upload/delete", {
        data: path,
      })
      .then(() => {
        return "Xóa ảnh cũ thành công";
      })
      .catch(() => {
        return "Xóa ảnh cũ thất bại";
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
