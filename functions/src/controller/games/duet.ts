import { Request, Response } from "express";
import * as admin from "firebase-admin";

export class DuetController {
  async get(req: Request, res: Response) {
    const type = req.params.type;
    const supportTypes = [
      "audios",
      "images",
      "entities",
      "events",
      "maps",
      "setting",
      "talks",
      "triggers",
    ];

    if (!supportTypes.includes(type)) {
      res.status(404).send(JSON.stringify({ result: "Not found" }));
      return;
    }

    const directryId = req.query.id as string;
    if (!directryId) {
      res
        .status(400)
        .send(JSON.stringify({ result: "'id' param is required." }));
      return;
    }

    const subDirectryId = req.query.part as string;
    const isNeedSubDirectry = this.isNeedSubDirectry(type);
    if (isNeedSubDirectry && !subDirectryId) {
      res
        .status(400)
        .send(JSON.stringify({ result: "'part' param is required." }));
      return;
    }

    try {
      const filePath = [
        `gameofus/games/duet/${directryId}`,
        isNeedSubDirectry ? subDirectryId : null,
        `${type}.json`,
      ]
        .filter((p) => p !== null)
        .join("/");
      const bucket = admin.storage().bucket();
      const fileRef = bucket.file(filePath);
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

  private isNeedSubDirectry(type: string): boolean {
    return ["events", "maps", "talks", "triggers"].includes(type);
  }
}
