import { FirebaseStorageRepositoryIf } from "@/repositories/fsrepository";
import { WasTalkDefine } from "@/formats/games/was/talk";
import { WasSkillDefine } from "@/formats/games/was/skill";
import { WasBattleDefine } from "@/formats/games/was/battle";
import { WasEventTriggerDefine } from "@/formats/games/was/event";

export interface WasTalkRepositoryIf
  extends FirebaseStorageRepositoryIf<WasTalkDefine> {}

export interface WasSkillRepositoryIf
  extends FirebaseStorageRepositoryIf<WasSkillDefine> {}

export interface WasBattleRepositoryIf
  extends FirebaseStorageRepositoryIf<WasBattleDefine> {}

export interface WasEventRepositoryIf
  extends FirebaseStorageRepositoryIf<WasEventTriggerDefine> {}
