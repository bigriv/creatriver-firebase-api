import * as functions from "firebase-functions";
import * as admin from "firebase-admin";
import * as express from "express";

require("module-alias/register");

import { initLocalStorage } from "@/local";
import { FirebaseStorageRepositoryBuilder } from "@/repositories/fsrepository";
import { EditWasTalkController } from "@/controller/edits/games/was/talk";
import { EditWasBattleController } from "@/controller/edits/games/was/battle";
import { EditWasSkillController } from "@/controller/edits/games/was/skill";

admin.initializeApp();

const app = express();
const bucket = admin.storage().bucket();

// TODO: ローカル起動の場合のみ実行するように修正する
initLocalStorage(bucket);

const editWasTalkController = new EditWasTalkController(
  FirebaseStorageRepositoryBuilder.build(
    bucket,
    "talk",
    "gameofus/games/was",
    "gameofus/games/was/backups/talks"
  )
);
app.get("/edits/games/was/talk", (req, res) =>
  editWasTalkController.get(req, res)
);
app.post("/edits/games/was/talk", (req, res) =>
  editWasTalkController.post(req, res)
);
app.delete("/edits/games/was/talk/:id", (req, res) =>
  editWasTalkController.delete(req, res)
);

const editWasBattleController = new EditWasBattleController(
  FirebaseStorageRepositoryBuilder.build(
    bucket,
    "battle",
    "gameofus/games/was",
    "gameofus/games/was/backups/battles"
  )
);
app.get("/edits/games/was/battle", (req, res) =>
  editWasBattleController.get(req, res)
);
app.post("/edits/games/was/battle", (req, res) =>
  editWasBattleController.post(req, res)
);
app.delete("/edits/games/was/battle/:id", (req, res) =>
  editWasBattleController.delete(req, res)
);

const editWasSkillController = new EditWasSkillController(
  FirebaseStorageRepositoryBuilder.build(
    bucket,
    "skill",
    "gameofus/games/was",
    "gameofus/games/was/backups/skills"
  )
);
app.get("/edits/games/was/skill", (req, res) =>
  editWasSkillController.get(req, res)
);
app.post("/edits/games/was/skill", (req, res) =>
  editWasSkillController.post(req, res)
);
app.delete("/edits/games/was/skill/:id", (req, res) =>
  editWasSkillController.delete(req, res)
);

export const api = functions.https.onRequest(app);
