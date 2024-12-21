import { FirebaseStorageModel } from "@/formats/fsmodel";
import { isWasMovePatternDefine, WasMovePatternDefine } from "@/formats/games/was/move";

export interface WasBattleDefine extends FirebaseStorageModel {
  id: string;
  description?: string;
  bgm?: string;
  player?: WasBattlerDefine;
  opponent: WasAutomaticBattlerDefine;
  triggers: string[];
}

export function isWasBattleDefine(value: any): value is WasBattleDefine {
  if (typeof value !== "object" || value === null) {
    return false;
  }

  if (typeof value.id !== "string") {
    return false;
  }
  if (
    value.description !== undefined &&
    typeof value.description !== "string"
  ) {
    return false;
  }
  if (value.bgm !== undefined && typeof value.bgm !== "string") {
    return false;
  }

  if (value.player !== undefined && !isWasBattlerDefine(value.player)) {
    return false;
  }
  if (!isWasAutomaticBattlerDefine(value.opponent)) {
    return false;
  }

  if (!Array.isArray(value.triggers)) {
    return false;
  }
  if (!value.triggers.every((trigger: any) => typeof trigger === "string")) {
    return false;
  }

  return true;
}

export type WasBattlerDefine = {
  id: string;
  name: string;
  allys: {
    id: string;
    name: string;
    move_patterns: WasMovePatternDefine[];
  }[];
  skills: string[];
  status: {
    life: number;
    attack: number;
    defense: number;
    speed: number;
  };
};

export type WasAutomaticBattlerDefine = WasBattlerDefine & {
  visual: string;
  move_patterns: WasMovePatternDefine[];
};

export function isWasBattlerDefine(value: any): value is WasBattlerDefine {
  if (typeof value !== "object" || value === null) {
    return false;
  }
  if (typeof value.id !== "string") {
    return false;
  }
  if (typeof value.name !== "string") {
    return false;
  }

  if (!Array.isArray(value.allys)) {
    return false;
  }
  for (const ally of value.allys) {
    if (typeof ally !== "object" || ally === null) {
      return false;
    }
    if (typeof ally.id !== "string") {
      return false;
    }
    if (typeof ally.name !== "string") {
      return false;
    }
    if (!Array.isArray(ally.move_patterns)) {
      return false;
    }
    if (!ally.move_patterns.every((p: any) => isWasMovePatternDefine(p))) {
      return false;
    }
  }

  if (!Array.isArray(value.skills)) {
    return false;
  }
  if (!value.skills.every((skill: any) => typeof skill === "string")) {
    return false;
  }

  if (typeof value.status !== "object" || value.status === null) {
    return false;
  }
  if (typeof value.status.life !== "number") {
    return false;
  }
  if (typeof value.status.attack !== "number") {
    return false;
  }
  if (typeof value.status.defense !== "number") {
    return false;
  }
  if (typeof value.status.speed !== "number") {
    return false;
  }
  return true;
}

export function isWasAutomaticBattlerDefine(
  value: any
): value is WasAutomaticBattlerDefine {
  if (typeof value !== "object" || value === null) {
    return false;
  }

  if (typeof value.visual !== "string") {
    return false;
  }
  if (!Array.isArray(value.move_patterns)) {
    return false;
  }

  if (!value.move_patterns.every((p: any) => isWasMovePatternDefine(p))) {
    return false;
  }

  if (!isWasBattlerDefine(value)) {
    return false;
  }

  return true;
}
