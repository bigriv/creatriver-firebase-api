import { Request, Response } from "express";
import * as admin from "firebase-admin";

export class BirthController {
  async get(req: Request, res: Response) {
    const type = req.params.type;
    const supportTypes = [
      "audios",
      "battlers",
      "images",
      "items",
      "map",
      "mapchips",
      "settings",
      "skills",
      "talks",
      "triggers",
    ];

    if (!supportTypes.includes(type)) {
      res.status(404).send(JSON.stringify({ result: "Not found" }));
      return;
    }

    const directryId = req.query.id as string;
    if (!directryId) {
      res.status(200).send(null);
      return;
    }
    try {
      const bucket = admin.storage().bucket();
      const fileRef = bucket.file(
        `gameofus/games/birth/${directryId}/${type}.json`
      );
      const [exists] = await fileRef.exists();

      if (!exists) {
        res.status(200).send(null);
        return;
      }

      const [fileContents] = await fileRef.download();
      const json = JSON.parse(fileContents.toString());
      res.status(200).send(json);
    } catch (error) {
      console.error("Error fetching file:", error);
      res.status(500).send({ error: "Failed to fetch file" });
    }
  }
}
