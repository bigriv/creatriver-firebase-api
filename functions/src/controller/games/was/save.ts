import { Request, Response } from "express";
import * as admin from "firebase-admin";
import { isWasSaveData } from "@/formats/games/was/save";

export class WasSaveController {
  /**
   * GETメソッド
   * @param req リクエスト
   * @param res レスポンス
   */
  async get(req: Request, res: Response) {
    const fileId = req.query.id as string;

    if (!fileId) {
      res.status(200).send(null);
      return;
    }
    try {
      const bucket = admin.storage().bucket();
      const fileRef = bucket.file(`gameofus/games/was/save/${fileId}.json`);
      const [exists] = await fileRef.exists();

      if (!exists) {
        res.status(200).send(null);
        return;
      }

      const [fileContents] = await fileRef.download();
      const json = JSON.parse(fileContents.toString());
      if (!isWasSaveData(json)) {
        res.status(200).send(null);
        return;
      }
      res.status(200).send(json);
    } catch (error) {
      console.error("Error fetching file:", error);
      res.status(500).send({ error: "Failed to fetch file" });
    }
  }

  /**
   * POSTメソッド
   * @param req リクエスト
   * @param res レスポンス
   */
  async post(req: Request, res: Response) {
    const fileId = req.body.id as string;
    const data = req.body.data;

    if (!fileId || !data) {
      res
        .status(400)
        .send({ error: "Invalid request: 'id' and 'data' are required" });
      return;
    }

    if (!isWasSaveData(data)) {
      res.status(400).send({ error: "Invalid data format" });
      return;
    }

    try {
      const bucket = admin.storage().bucket();
      const fileRef = bucket.file(`gameofus/games/was/save/${fileId}.json`);
      await fileRef.save(JSON.stringify(data));

      res.status(200).send({ message: "File saved successfully" });
    } catch (error) {
      console.error("Error saving file:", error);
      res.status(500).send({ error: "Failed to save file" });
    }
  }
}
