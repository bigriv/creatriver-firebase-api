import { FormatUtils } from "@/utils/format";
import { FirebaseStorageModel } from "@/formats/fsmodel";
import {
  WAS_AREA_STATE_TYPE,
  WAS_CHARACTER_STATE_TYPE,
  WAS_EVENT_CONDITION_TYPE,
  WAS_OPERATOR,
} from "@/const/games/was/const";

export interface WasEventTriggerDefine extends FirebaseStorageModel {
  id: string;
  description?: string;
  events: string[];
  conditions: WasEventConditionDefine[];
  repeat?: boolean;
}

export function isWasEventTriggerDefine(
  value: any
): value is WasEventTriggerDefine {
  if (!FormatUtils.isObject(value)) {
    return false;
  }

  if (typeof value.id !== "string") {
    return false;
  }

  if (!FormatUtils.isOptionalString(value.description)) {
    return false;
  }

  if (!Array.isArray(value.events)) {
    return false;
  }
  if (!value.events.every((event: any) => typeof event === "string")) {
    return false;
  }

  if (!Array.isArray(value.conditions)) {
    return false;
  }
  if (
    !value.conditions.every((condition: any) =>
      isWasEventConditionDefine(condition)
    )
  ) {
    return false;
  }

  if (!FormatUtils.isOptionalBoolean(value.repeat)) {
    return false;
  }

  return true;
}

export type WasEventClearConditionDefine = {
  type: WAS_EVENT_CONDITION_TYPE.GAME_CLEAR;
  and?: WasEventConditionDefine;
};

export type WasEventChapterConditionDefine = {
  type: WAS_EVENT_CONDITION_TYPE.CHAPTER;
  chapter: number;
  operator: WAS_OPERATOR;
  and?: WasEventConditionDefine;
};

export type WasEventAreaConditionDefine = {
  type: WAS_EVENT_CONDITION_TYPE.AREA;
  area_id: string;
  value: WAS_AREA_STATE_TYPE;
  and?: WasEventConditionDefine;
};

export type WasEventCharacterConditionDefine = {
  type: WAS_EVENT_CONDITION_TYPE.CHARACTER;
  character_id: string;
  value: WAS_CHARACTER_STATE_TYPE;
  and?: WasEventConditionDefine;
};

export type WasEventAccompanyConditionDefine = {
  type: WAS_EVENT_CONDITION_TYPE.ACCOMPANY;
  character_id: string;
  value: boolean;
  and?: WasEventConditionDefine;
};

export type WasEventConditionDefine =
  | WasEventClearConditionDefine
  | WasEventChapterConditionDefine
  | WasEventAreaConditionDefine
  | WasEventCharacterConditionDefine
  | WasEventAccompanyConditionDefine;

export function isWasEventConditionDefine(
  value: any
): value is WasEventConditionDefine {
  if (!FormatUtils.isObject(value)) {
    return false;
  }

  if (value.type === WAS_EVENT_CONDITION_TYPE.GAME_CLEAR) {
    if (value.and !== undefined && !isWasEventConditionDefine(value.and)) {
      return false;
    }
    return true;
  }

  if (value.type === WAS_EVENT_CONDITION_TYPE.CHAPTER) {
    if (typeof value.chapter !== "number") {
      return false;
    }
    if (!Object.values(WAS_OPERATOR).includes(value.operator)) {
      return false;
    }
    if (value.and !== undefined && !isWasEventConditionDefine(value.and)) {
      return false;
    }
    return true;
  }

  if (value.type === WAS_EVENT_CONDITION_TYPE.AREA) {
    if (typeof value.area_id !== "string") {
      return false;
    }
    if (!Object.values(WAS_AREA_STATE_TYPE).includes(value.value)) {
      return false;
    }
    if (value.and !== undefined && !isWasEventConditionDefine(value.and)) {
      return false;
    }
    return true;
  }

  if (value.type === WAS_EVENT_CONDITION_TYPE.CHARACTER) {
    if (typeof value.character_id !== "string") {
      return false;
    }
    if (!Object.values(WAS_CHARACTER_STATE_TYPE).includes(value.value)) {
      return false;
    }
    if (value.and !== undefined && !isWasEventConditionDefine(value.and)) {
      return false;
    }
    return true;
  }

  if (value.type === WAS_EVENT_CONDITION_TYPE.ACCOMPANY) {
    if (typeof value.character_id !== "string") {
      return false;
    }
    if (typeof value.value !== "boolean") {
      return false;
    }
    if (value.and !== undefined && !isWasEventConditionDefine(value.and)) {
      return false;
    }
    return true;
  }

  return false;
}
