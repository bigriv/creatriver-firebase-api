import * as functions from "firebase-functions";
import * as admin from "firebase-admin";
import * as express from "express";
import { isWasTalkDefine } from "./formats/games/was/talk";
import { initLocalStorage } from "./local";

admin.initializeApp();

const app = express();
const bucket = admin.storage().bucket();

// TODO: ローカル起動の場合のみ実行するように修正する
initLocalStorage(bucket);

app.post("/edits/games/was/talk", async (req, res) => {
  try {
    const json = req.body;
    if (!isWasTalkDefine(json)) {
      res.status(400).send("Bad Request. The talk is not talk format.");
      return;
    }
    const filePath = "gameofus/games/was";
    const fileName = "talk.json";
    const fileRef = bucket.file(`${filePath}/${fileName}`);
    const [exists] = await fileRef.exists();

    let putData = json;
    // ファイルが既に存在する場合はバックアップを作成する
    if (exists) {
      const backupFilePath = `${filePath}/backups/talks`;
      const backFileName = `talk-${Date.now()}.json`;
      const backupFileRef = bucket.file(`${backupFilePath}/${backFileName}`);

      await fileRef.copy(backupFileRef);

      const [fileContents] = await fileRef.download();
      const storageData = JSON.parse(fileContents.toString());
      putData = Object.assign(storageData, { [putData.id]: putData });
    }

    console.log("putData", putData)
    // 既存のファイルと結合して保存
    await fileRef.save(JSON.stringify(putData));
    res.status(200).send("Success");
  } catch (error) {
    console.error(error);
    res.status(500).send("Unexpected Error");
  }
});

export const api = functions.https.onRequest(app);
