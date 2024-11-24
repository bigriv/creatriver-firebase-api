import { FirebaseStorageModel } from "@/formats/fsmodel";
import { WAS_OPERATOR } from "@/const/games/was/const";

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
  move_pattern: {
    condition: {
      left: string;
      operator: WAS_OPERATOR;
      right: string;
    };
    candidate: string[];
  }[];
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
  if (!Array.isArray(value.move_pattern)) {
    return false;
  }
  for (const p of value.move_pattern) {
    if (typeof p !== "object" || p === null) {
      return false;
    }
    if (typeof p.condition !== "object" || p.condition === null) {
      return false;
    }
    if (typeof p.condition.left !== "string") {
      return false;
    }
    if (!Object.values(WAS_OPERATOR).includes(p.condition.operator)) {
      return false;
    }
    if (typeof p.condition.right !== "string") {
      return false;
    }
    if (!Array.isArray(p.candidate)) {
      return false;
    }
    if (!p.candidate.every((c: any) => typeof c === "string")) {
      return false;
    }
  }

  if (!isWasBattlerDefine(value)) {
    return false;
  }

  return true;
}
