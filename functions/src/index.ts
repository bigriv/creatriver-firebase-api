import * as functions from "firebase-functions";
import * as admin from "firebase-admin";
import * as express from "express";

require("module-alias/register");

import { initLocalStorage } from "@/local";
import { FirebaseStorageRepositoryBuilder } from "@/repositories/fsrepository";
import { EditWasTalkController } from "@/controller/edits/games/was/talk";
import { EditWasBattleController } from "@/controller/edits/games/was/battle";
import { EditWasSkillController } from "@/controller/edits/games/was/skill";
import { EditWasEventController } from "@/controller/edits/games/was/event";
import { EditWasEventTriggerController } from "@/controller/edits/games/was/trigger";
import { EditWasAreaController } from "@/controller/edits/games/was/area";

const dotenv = require("dotenv");
dotenv.config({
  path: process.env.NODE_ENV === "production" ? ".env.prod" : ".env.local",
});

admin.initializeApp();

const app = express();
const bucket = admin.storage().bucket();

if (process.env.INIT_STORAGE) {
  // ローカル起動の場合のみfirebase storageを初期化する
  initLocalStorage(bucket);
}

/**
 * 指定されたパスに対してコントローラーを登録する, POST, DELETE のルートを設定する。
 *
 * @param {string} path ルーティングのベースパス
 * @param {new (...args: any[]) => any} ControllerClass - インスタンス化するコントローラークラス
 * @param {string} storageKey ストレージのキー（データの識別子）
 * @param {string} storagePath ストレージの保存パス
 * @param {string} backupPath バックアップデータの保存パス
 */
const registerController = (
  path: string,
  ControllerClass: any,
  storageKey: string,
  storagePath: string,
  backupPath: string
) => {
  const router = express.Router();
  const controller = new ControllerClass(
    FirebaseStorageRepositoryBuilder.build(
      bucket,
      storageKey,
      storagePath,
      backupPath
    )
  );

  router.get("/", (req, res) => controller.get(req, res));
  router.post("/", (req, res) => controller.post(req, res));
  router.delete("/:id", (req, res) => controller.delete(req, res));

  app.use(path, router);
};

registerController(
  "/edits/games/was/talk",
  EditWasTalkController,
  "talk",
  "gameofus/games/was",
  "gameofus/games/was/backups/talks"
);
registerController(
  "/edits/games/was/battle",
  EditWasBattleController,
  "battle",
  "gameofus/games/was",
  "gameofus/games/was/backups/battles"
);
registerController(
  "/edits/games/was/skill",
  EditWasSkillController,
  "skill",
  "gameofus/games/was",
  "gameofus/games/was/backups/skills"
);
registerController(
  "/edits/games/was/event",
  EditWasEventController,
  "event",
  "gameofus/games/was",
  "gameofus/games/was/backups/events"
);
registerController(
  "/edits/games/was/trigger",
  EditWasEventTriggerController,
  "trigger",
  "gameofus/games/was",
  "gameofus/games/was/backups/triggers"
);
registerController(
  "/edits/games/was/area",
  EditWasAreaController,
  "area",
  "gameofus/games/was",
  "gameofus/games/was/backups/areas"
);

export const api = functions.https.onRequest(app);
