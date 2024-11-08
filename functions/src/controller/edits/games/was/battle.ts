import { Request, Response } from "express";
import { isWasBattleDefine } from "@/formats/games/was/battle";
import { WasBattleRepositoryIf } from "@/repositories/edits/games/was";

export class EditWasBattleController {
  private repository: WasBattleRepositoryIf;

  constructor(repository: WasBattleRepositoryIf) {
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
      if (!isWasBattleDefine(json)) {
        res.status(400).send("Bad Request. The battle is not battle format.");
        return;
      }

      await this.repository.save(json);
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
