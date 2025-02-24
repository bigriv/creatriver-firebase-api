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

console.log("init storage", process.env.INIT_STORAGE);
if (process.env.INIT_STORAGE) {
  // ローカル起動の場合のみfirebase storageを初期化する
  initLocalStorage(bucket);
}

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

const editWasEventController = new EditWasEventController(
  FirebaseStorageRepositoryBuilder.build(
    bucket,
    "event",
    "gameofus/games/was",
    "gameofus/games/was/backups/events"
  )
);
app.get("/edits/games/was/event", (req, res) =>
  editWasEventController.get(req, res)
);
app.post("/edits/games/was/event", (req, res) =>
  editWasEventController.post(req, res)
);
app.delete("/edits/games/was/event/:id", (req, res) =>
  editWasEventController.delete(req, res)
);

const editWasEventTriggerController = new EditWasEventTriggerController(
  FirebaseStorageRepositoryBuilder.build(
    bucket,
    "trigger",
    "gameofus/games/was",
    "gameofus/games/was/backups/triggers"
  )
);
app.get("/edits/games/was/trigger", (req, res) =>
  editWasEventTriggerController.get(req, res)
);
app.post("/edits/games/was/trigger", (req, res) =>
  editWasEventTriggerController.post(req, res)
);
app.delete("/edits/games/was/trigger/:id", (req, res) =>
  editWasEventTriggerController.delete(req, res)
);

const editWasAreaController = new EditWasAreaController(
  FirebaseStorageRepositoryBuilder.build(
    bucket,
    "area",
    "gameofus/games/was",
    "gameofus/games/was/backups/areas"
  )
);
app.get("/edits/games/was/area", (req, res) =>
  editWasAreaController.get(req, res)
);
app.post("/edits/games/was/area", (req, res) =>
  editWasAreaController.post(req, res)
);
app.delete("/edits/games/was/area/:id", (req, res) =>
  editWasAreaController.delete(req, res)
);

export const api = functions.https.onRequest(app);
