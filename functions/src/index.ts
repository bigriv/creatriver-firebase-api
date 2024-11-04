import * as functions from "firebase-functions";
import * as admin from "firebase-admin";
import * as express from "express";

require("module-alias/register");

import { initLocalStorage } from "@/local";
import { EditWasTalkController } from "@/controller/edits/games/was/talk";
import { EditWasBattleController } from "@/controller/edits/games/was/battle";
import { WasTalkRepository } from "@/repositories/games/was/talk";
import { WasBattleRepository } from "@/repositories/games/was/battle";

admin.initializeApp();

const app = express();
const bucket = admin.storage().bucket();

// TODO: ローカル起動の場合のみ実行するように修正する
initLocalStorage(bucket);

const editWasTalkController = new EditWasTalkController(
  new WasTalkRepository(bucket)
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
  new WasBattleRepository(bucket)
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

export const api = functions.https.onRequest(app);
