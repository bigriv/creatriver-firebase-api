import { FirebaseStorageRepositoryIf } from "@/repositories/fsrepository";
import { WasTalkDefine } from "@/formats/games/was/talk";
import { WasSkillDefine } from "@/formats/games/was/skill";
import { WasBattleDefine } from "@/formats/games/was/battle";
import { WasEventDefine } from "@/formats/games/was/event";
import { WasEventTriggerDefine } from "@/formats/games/was/trigger";
import { WasAreaDefine } from "@/formats/games/was/area";

export interface WasTalkRepositoryIf
  extends FirebaseStorageRepositoryIf<WasTalkDefine> {}

export interface WasSkillRepositoryIf
  extends FirebaseStorageRepositoryIf<WasSkillDefine> {}

export interface WasBattleRepositoryIf
  extends FirebaseStorageRepositoryIf<WasBattleDefine> {}

export interface WasEventRepositoryIf
  extends FirebaseStorageRepositoryIf<WasEventDefine> {}

export interface WasEventTriggerRepositoryIf
  extends FirebaseStorageRepositoryIf<WasEventTriggerDefine> {}

export interface WasAreaRepositoryIf
  extends FirebaseStorageRepositoryIf<WasAreaDefine> {}
