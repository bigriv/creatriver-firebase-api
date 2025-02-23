import { Request, Response } from "express";
import { JsonUtils } from "@/utils/json";
import { isWasTalkDefine, WasTalkDefine } from "@/formats/games/was/talk";
import { WasTalkRepositoryIf } from "@/repositories/edits/games/was";

export class EditWasTalkController {
  private repository: WasTalkRepositoryIf;

  constructor(repository: WasTalkRepositoryIf) {
    this.repository = repository;
  }

  /**
   * GETメソッド
   * @param _req リクエスト
   * @param res レスポンス
   */
  async get(_req: Request, res: Response) {
    try {
      const contents = await this.repository.findAll();
      res.status(200).send(contents);
    } catch (error) {
      console.error(error);
      res.status(500).send("Unexpected Error");
    }
  }

  /**
   * POSTメソッド
   * @param req リクエスト
   * @param res レスポンス
   */
  async post(req: Request, res: Response) {
    try {
      const json = req.body;
      if (!JsonUtils.isKeyValue(json)) {
        res.status(400).send("Bad Request. The talk is not key-value format.");
        return;
      }
      const values: Record<string, WasTalkDefine> = {};
      for (const key of Object.keys(json)) {
        if (!isWasTalkDefine(json[key])) {
          console.warn(
            `The key '${key}' is incorrect format. ${JSON.stringify(json[key])}`
          );
          continue;
        }
        values[key] = json[key];
      }

      await this.repository.saveAll(values);
      res.status(200).send("Success");
    } catch (error) {
      console.error(error);
      res.status(500).send("Unexpected Error");
    }
  }

  /**
   * DELETEメソッド
   * @param req リクエスト
   * @param res レスポンス
   */
  async delete(req: Request, res: Response) {
    await this.repository.deleteByKey(req.params.id);
    res.status(200).send("Success");
  }
}
