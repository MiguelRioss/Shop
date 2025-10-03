// src/lib/uploadMedia.js
import { storage, db, auth } from "./firebase";
import { ref as sRef, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { ref as dbRef, push, set, serverTimestamp } from "firebase/database";

/**
 * Uploads file to storage (stories/...), then creates a DB entry under /data-base-images
 * new DB entry example:
 * { url: "...", approved: false, createdAt: 167..., storagePath: "...", uid: "anon-user-id" }
 */
export function uploadMedia(file, onProgress) {
  return new Promise((resolve, reject) => {
    const ext = file.name.split(".").pop() || "bin";
    const filename = `${Date.now()}_${crypto.randomUUID()}.${ext}`;
    const path = `stories/${filename}`;

    const storageRef = sRef(storage, path);
    const uploadTask = uploadBytesResumable(storageRef, file);

    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const pct = Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100);
        onProgress?.(pct);
      },
      (err) => reject(err),
      async () => {
        try {
          const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);

          // create DB record with push() (safe key)
          const newRef = push(dbRef(db, "/data-base-images"));
          const uid = auth.currentUser?.uid || null;

          // recommended: approved:false so an admin can review later
          await set(newRef, {
            url: downloadURL,
            approved: false,        // <<== recommended moderation default
            createdAt: serverTimestamp(),
            storagePath: path,
            uid,
          });

          resolve({ downloadURL, key: newRef.key });
        } catch (e) {
          reject(e);
        }
      }
    );
  });
}
