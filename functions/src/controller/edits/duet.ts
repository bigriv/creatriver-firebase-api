import { FormatUtils } from "@/utils/format";
import { Request, Response } from "express";
import * as admin from "firebase-admin";

export class DuetEditController {
  async post(req: Request, res: Response) {
    const type = req.params.type;
    console.log("params", req.params);
    console.log("body", req.body);
    const supportTypes = [
      //   "audios",
      //   "images",
      "entities",
      "events",
      "maps",
      //   "setting",
      "talks",
      "triggers",
    ];

    if (!supportTypes.includes(type)) {
      res.status(404).send(
        JSON.stringify({
          result: "Not found",
          detail: `not support type: ${type}`,
        })
      );
      return;
    }

    const directryId = req.body.id as string;
    if (!directryId) {
      res
        .status(400)
        .send(JSON.stringify({ result: "'id' param is required." }));
      return;
    }

    const subDirectryId = req.body.part as string;
    const isNeedSubDirectry = this.isNeedSubDirectry(type);
    if (isNeedSubDirectry && !subDirectryId) {
      res
        .status(400)
        .send(JSON.stringify({ result: "'part' param is required." }));
      return;
    }

    const json = req.body.data as Object;
    if (!FormatUtils.isObject(json)) {
      res
        .status(400)
        .send(JSON.stringify({ result: "'data' param is invalid format." }));
      return;
    }

    try {
      const directryPath = [
        `gameofus/games/duet/${directryId}`,
        isNeedSubDirectry ? subDirectryId : null,
      ]
        .filter((p) => p !== null)
        .join("/");
      const bucket = admin.storage().bucket();
      const fileRef = bucket.file(`${directryPath}/${type}.json`);
      const [exists] = await fileRef.exists();

      // ファイルが既に存在する場合はバックアップを作成する
      if (exists) {
        const backFileName = `${type}-${Date.now()}.json`;
        const backupFileRef = bucket.file(
          `${directryPath}/backups/${backFileName}`
        );

        await fileRef.copy(backupFileRef);
      }

      // ファイルを保存
      await fileRef.save(JSON.stringify(json));
      res.status(200).send({ message: "File saved successfully" });
    } catch (error) {
      console.error("Error fetching file:", error);
      res.status(500).send({ error: "Failed to fetch file" });
    }
  }

  private isNeedSubDirectry(type: string): boolean {
    return ["events", "maps", "talks", "triggers"].includes(type);
  }
}
