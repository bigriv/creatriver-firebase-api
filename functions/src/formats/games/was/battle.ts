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
  player?: WasPlayableMainBattlerDefine;
  opponent: WasAutomaticMainBattlerDefine;
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

  if (value.player !== undefined && !isWasPlayableMainBattlerDefine(value.player)) {
    return false;
  }
  if (!isWasAutomaticMainBattlerDefine(value.opponent)) {
    return false;
  }

  return true;
}

export type WasMainBattlerDefine<AllyType = { id: string; name: string }> = {
  id: string;
  name: string;
  status: WasStatusDefine;
  allys: AllyType[];
};

export type WasPlayableMainBattlerDefine = WasMainBattlerDefine<{
  id: string;
  name: string;
  skills: string[];
}> & {
  skills: string[];
};

export type WasAutomaticMainBattlerDefine = WasMainBattlerDefine<{
  id: string;
  name: string;
  move_patterns: WasMovePatternDefine[];
}> & {
  visual: string;
  move_patterns: WasMovePatternDefine[];
};

export function isWasMainBattlerDefine(
  value: any
): value is WasMainBattlerDefine {
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
  }

  if (!isWasStatusDefine(value.status)) {
    return false;
  }
  return true;
}

export function isWasPlayableMainBattlerDefine(
  value: any
): value is WasPlayableMainBattlerDefine {
  if (!FormatUtils.isObject(value)) {
    return false;
  }

  if (!Array.isArray(value.skills)) {
    return false;
  }
  if (value.skills.some((skill: any) => typeof skill !== "string")) {
    return false;
  }

  if (!Array.isArray(value.allys)) {
    return false;
  }
  for (const ally of value.allys) {
    if (!FormatUtils.isObject(ally)) {
      return false;
    }
    if (!Array.isArray(ally.skills)) {
      return false;
    }
    if (ally.skills.some((skill: any) => typeof skill !== "string")) {
      return false;
    }
  }

  if (!isWasMainBattlerDefine(value)) {
    return false;
  }

  return true;
}

export function isWasAutomaticMainBattlerDefine(
  value: any
): value is WasAutomaticMainBattlerDefine {
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

  if (!Array.isArray(value.allys)) {
    return false;
  }
  for (const ally of value.allys) {
    if (!FormatUtils.isObject(ally)) {
      return false;
    }
    if (!Array.isArray(ally.move_patterns)) {
      return false;
    }
    if (!ally.move_patterns.every((p: any) => isWasMovePatternDefine(p))) {
      return false;
    }
  }

  if (!isWasMainBattlerDefine(value)) {
    return false;
  }

  return true;
}
