import * as functions from "firebase-functions";
import * as admin from "firebase-admin";
import * as express from "express";
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
app.get("/edits/games/was/talk", editWasTalkController.get);
app.post("/edits/games/was/talk", editWasTalkController.post);
app.delete("/edits/games/was/talk/:id", editWasTalkController.delete);

const editWasBattleController = new EditWasBattleController(
  new WasBattleRepository(bucket)
);
app.get("/edits/games/was/battle", editWasBattleController.get);
app.post("/edits/games/was/battle", editWasBattleController.post);
app.delete("/edits/games/was/battle/:id", editWasBattleController.delete);

export const api = functions.https.onRequest(app);
