import { Request, Response } from "express";
import { isWasSkillDefine } from "@/formats/games/was/skill";
import { WasSkillRepositoryIf } from "@/repositories/edits/games/was";

export class EditWasSkillController {
  private repository: WasSkillRepositoryIf;

  constructor(repository: WasSkillRepositoryIf) {
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
      if (!isWasSkillDefine(json)) {
        res.status(400).send("Bad Request. The skill is not skill format.");
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
