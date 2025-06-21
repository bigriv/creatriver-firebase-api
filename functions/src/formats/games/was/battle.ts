import { FormatUtils } from "@/utils/format";
import { FirebaseStorageModel } from "@/formats/fsmodel";
import {
  isWasMovePatternDefine,
  WasMovePatternDefine,
} from "@/formats/games/was/move";
import { isWasStatusDefine, WasStatusDefine } from "@/formats/games/was/status";

export interface WasBattleDefine extends FirebaseStorageModel {
  id: string;
  description?: string;
  bgm?: string;
  player?: WasBattlerDefine;
  opponent: WasAutomaticBattlerDefine;
}

export function isWasBattleDefine(value: any): value is WasBattleDefine {
  if (!FormatUtils.isObject(value)) {
    return false;
  }

  if (typeof value.id !== "string") {
    return false;
  }
  if (!FormatUtils.isOptionalString(value.description)) {
    return false;
  }

  if (!FormatUtils.isOptionalString(value.bgm)) {
    return false;
  }

  if (value.player !== undefined && !isWasPlayableBattlerDefine(value.player)) {
    return false;
  }
  if (!isWasAutomaticBattlerDefine(value.opponent)) {
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
  status: WasStatusDefine;
};

export type WasPlayableBattlerDefine = WasBattlerDefine & {
  skills: string[];
};

export type WasAutomaticBattlerDefine = WasBattlerDefine & {
  visual: string;
  move_patterns: WasMovePatternDefine[];
};

export function isWasBattlerDefine(value: any): value is WasBattlerDefine {
  if (!FormatUtils.isObject(value)) {
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
    if (!FormatUtils.isObject(ally)) {
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

  if (!isWasStatusDefine(value.status)) {
    return false;
  }

  return true;
}

export function isWasPlayableBattlerDefine(
  value: any
): value is WasPlayableBattlerDefine {
  if (!FormatUtils.isObject(value)) {
    return false;
  }

  if (!Array.isArray(value.skills)) {
    return false;
  }
  if (value.skills.some((skill: any) => typeof skill !== "string")) {
    return false;
  }

  if (!isWasBattlerDefine(value)) {
    return false;
  }

  return true;
}

export function isWasAutomaticBattlerDefine(
  value: any
): value is WasAutomaticBattlerDefine {
  if (!FormatUtils.isObject(value)) {
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
