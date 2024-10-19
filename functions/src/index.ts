import * as functions from "firebase-functions";
import * as admin from "firebase-admin";
import * as express from "express";
import { JsonUtils } from "./utils/json";
import { isWasTalkDefine } from "./formats/games/was/talk";

admin.initializeApp();
const app = express();
const bucket = admin.storage().bucket();

app.post("/edits/games/was/talk", async (req, res) => {
  try {
    const json = req.body;
    if (!json) {
      res.status(400).send("Bad Request");
      return;
    }
    if (!JsonUtils.isKeyValue(json)) {
      res
        .status(400)
        .send("Bad Request. Request body is not key-value format.");
      return;
    }
    if (!Object.keys(json).every((key) => isWasTalkDefine(json[key]))) {
      res.status(400).send("Bad Request. The talk is not talk format.");
      return;
    }
    const filePath = "gameofus/games/was";
    const fileName = "talk.json";
    const fileRef = bucket.file(`${filePath}/${fileName}`);
    const [exists] = await fileRef.exists();

    // ファイルが既に存在する場合はバックアップを作成する
    if (exists) {
      const backupFilePath = `${filePath}/backups/talks`;
      const backFileName = `talk-${Date.now()}.json`;
      const backupFileRef = bucket.file(`${backupFilePath}/${backFileName}`);

      await fileRef.copy(backupFileRef);
    }

    await fileRef.save(JSON.stringify(json));
    res.status(200).send("Success");
  } catch (error) {
    console.error(error);
    res.status(500).send("Unexpected Error");
  }
});

export const api = functions.https.onRequest(app);
