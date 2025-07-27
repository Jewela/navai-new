import { seoFriendlyName } from "../../../../../utils/helpers/functions";

import { postRequest } from "../../../../../app/httpClient/axiosClient";
import { MEDIA } from "../../../../../app/config/endpoints";

const uploadImageFile = async (file) => {
  let fileName = seoFriendlyName(file.name);
  let contentType = file.type;

  return new Promise((resolve, reject) => {
    const _reader = new FileReader();
    _reader.readAsDataURL(file);

    _reader.onload = async () => {
      try {
        let encodedFormatFile = _reader.result;

        const imgPayload = {
          encodedFormatFile,
          fileName: fileName,
          contentType: contentType,
        };
        const res = await postRequest(MEDIA.UPLOAD_IMAGE, imgPayload);

        resolve(res.data.data.imageId);
      } catch (error) {
        reject(error);
      }
    };

    _reader.onerror = (error) => {
      reject(error);
    };
  });
};

export default uploadImageFile;
