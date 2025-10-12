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
import { WasSaveController } from "@/controller/games/was/save";
import { BirthController } from "./controller/games/birth";
import { DuetController } from "./controller/games/duet";
import { DuetEditController } from "./controller/edits/duet";
import { ResourceController } from "./controller/resource";

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
  "/games/was/talks",
  EditWasTalkController,
  "talks",
  "gameofus/games/was",
  "gameofus/games/was/backups/talks"
);
registerController(
  "/games/was/battles",
  EditWasBattleController,
  "battles",
  "gameofus/games/was",
  "gameofus/games/was/backups/battles"
);
registerController(
  "/games/was/skills",
  EditWasSkillController,
  "skills",
  "gameofus/games/was",
  "gameofus/games/was/backups/skills"
);
registerController(
  "/games/was/events",
  EditWasEventController,
  "events",
  "gameofus/games/was",
  "gameofus/games/was/backups/events"
);
registerController(
  "/games/was/triggers",
  EditWasEventTriggerController,
  "triggers",
  "gameofus/games/was",
  "gameofus/games/was/backups/triggers"
);
registerController(
  "/games/was/areas",
  EditWasAreaController,
  "areas",
  "gameofus/games/was",
  "gameofus/games/was/backups/areas"
);

const wasSaveController = new WasSaveController();
app.get("/saves/was", (req, res) => wasSaveController.get(req, res));
app.post("/saves/was", (req, res) => wasSaveController.post(req, res));

app.get("/games/birth/:type", (req, res) =>
  new BirthController().get(req, res)
);

app.get("/games/duet/:type", (req, res) => new DuetController().get(req, res));
app.post("/edits/duet/:type", (req, res) =>
  new DuetEditController().post(req, res)
);

app.get("/games/resource", (req, res) =>
  new ResourceController().get(req, res)
);

// functions.setGlobalOptions({ region: "asia-northeast1" });
export const api = functions.https.onRequest(app);
