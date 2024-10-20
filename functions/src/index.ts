import * as functions from "firebase-functions";
import * as admin from "firebase-admin";
import * as express from "express";
import { JsonUtils } from "./utils/json";
import { isWasTalkDefine } from "./formats/games/was/talk";
import { initLocalStorage } from "./local";

admin.initializeApp();

const app = express();
const bucket = admin.storage().bucket();

// TODO: ローカル起動の場合のみ実行するように修正する
initLocalStorage(bucket);

app.get("/edits/games/was/talk", async (req, res) => {
  try {
    const filePath = "gameofus/games/was";
    const fileName = "talk.json";
    const fileRef = bucket.file(`${filePath}/${fileName}`);
    const [exists] = await fileRef.exists();

    if (!exists) {
      throw new Error("File is not exist.");
    }

    const [fileContents] = await fileRef.download();
    const json = JSON.parse(fileContents.toString());
    if (!JsonUtils.isKeyValue(json)) {
      throw new Error("File is broken. There was not key-value format.");
    }
    if (!Object.keys(json).every((key) => isWasTalkDefine(json[key]))) {
      throw new Error("File is broken. It has not talk define format.");
    }

    res.status(200).send(JSON.parse(fileContents.toString()));
  } catch (error) {
    console.error(error);
    res.status(500).send("Unexpected Error");
  }
});

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

    // 既存のファイルと結合して保存
    await fileRef.save(JSON.stringify(putData));
    res.status(200).send("Success");
  } catch (error) {
    console.error(error);
    res.status(500).send("Unexpected Error");
  }
});

export const api = functions.https.onRequest(app);
