const { storage } = require("../config/firebase");
const { ref, uploadBytes, getDownloadURL } = require("firebase/storage");
const { v4: uuidv4 } = require("uuid");

const { createError } = require("./error");

const uploadAndGetURL = async (file, folder, next) => {
  try {
    const fileRef = ref(storage, `/${folder}/${file.originalname}-${uuidv4()}`);

    const metatype = {
      contentType: file.mimetype,
      name: file.originalname,
    };

    const snapshot = await uploadBytes(fileRef, file.buffer, metatype);

    const url = await getDownloadURL(snapshot.ref);

    return url;
  } catch (err) {
    return next(createError(500, "Error in uploading file."));
  }
};

module.exports = { uploadAndGetURL };
