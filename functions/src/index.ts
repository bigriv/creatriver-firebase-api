import * as functions from "firebase-functions";
import * as admin from "firebase-admin";
import * as express from "express";
import { initLocalStorage } from "@/local";
import { EditWasTalkController } from "@/controller/edits/games/was/talk";
import { WasTalkRepository } from "@/repositories/games/was/talk";

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

export const api = functions.https.onRequest(app);
