import {
  WAS_EVENT_CONDITION_TYPE,
  WAS_EVENT_STATE_TYPE,
  WAS_EVENT_TYPE,
} from "@/const/games/was/const";

export type WasTalkEventDefine = {
  type: WAS_EVENT_TYPE.TALK;
  talk_id: string;
  after_event?: string;
};

export type WasBattleEventDefine = {
  type: WAS_EVENT_TYPE.BATTLE;
  battle_id: string;
};

export type WasPlayAudioEventDefine = {
  type: WAS_EVENT_TYPE.PLAY_AUDIO;
  audio_id: string;
  asBgm?: boolean;
  after_event?: string;
};

export type WasUpdateStateEventDefine = {
  type: WAS_EVENT_TYPE.UPDATE_STATE;
  after_event?: string;
} & (
  | {
      target: WAS_EVENT_STATE_TYPE.GAME_CLEAR;
    }
  | {
      target: WAS_EVENT_STATE_TYPE.CHAPTER;
      chapter: number;
    }
  | {
      target:
        | WAS_EVENT_STATE_TYPE.AREA_INVADED
        | WAS_EVENT_STATE_TYPE.AREA_MANAGED;
      area_id: string;
      value: boolean;
    }
  | {
      target:
        | WAS_EVENT_STATE_TYPE.CHARACTER_FRIENDLY
        | WAS_EVENT_STATE_TYPE.CHARACTER_ALIVE;
      character_id: string;
      value: boolean;
    }
);

export type WasLearnSkillEventDefine = {
  type: WAS_EVENT_TYPE.LEARN_SKILL;
  skill_id: string;
  after_event?: string;
};

export type WasUpdateAllyEventDefine = {
  type: WAS_EVENT_TYPE.UPDATE_ALLY;
  character_id: string;
  value: boolean;
  after_event?: string;
};

export type WasChangePageEventDefine = {
  type: WAS_EVENT_TYPE.CHANGE_PAGE;
  page_id: "MAP" | "AREA" | "ENDING";
};

export type WasEventDefine =
  | WasTalkEventDefine
  | WasBattleEventDefine
  | WasPlayAudioEventDefine
  | WasUpdateStateEventDefine
  | WasLearnSkillEventDefine
  | WasUpdateAllyEventDefine
  | WasChangePageEventDefine;

export function isWasEventDefine(value: any): value is WasEventDefine {
  if (typeof value !== "object" || value === null) {
    return false;
  }

  if (value.type === WAS_EVENT_TYPE.TALK) {
    if (typeof value.talk_id !== "string") {
      return false;
    }
    if (
      value.after_event !== undefined &&
      typeof value.after_event !== "string"
    ) {
      return false;
    }
    return true;
  }

  if (value.type === WAS_EVENT_TYPE.BATTLE) {
    if (typeof value.battle_id !== "string") {
      return false;
    }
    return true;
  }

  if (value.type === WAS_EVENT_TYPE.PLAY_AUDIO) {
    if (typeof value.audio_id !== "string") {
      return false;
    }
    if (value.asBgm !== undefined && typeof value.asBgm !== "boolean") {
      return false;
    }
    if (
      value.after_event !== undefined &&
      typeof value.after_event !== "string"
    ) {
      return false;
    }
    return true;
  }

  if (value.type === WAS_EVENT_TYPE.LEARN_SKILL) {
    if (typeof value.skill_id !== "string") {
      return false;
    }
    if (
      value.after_event !== undefined &&
      typeof value.after_event !== "string"
    ) {
      return false;
    }
    return true;
  }

  if (value.type === WAS_EVENT_TYPE.UPDATE_ALLY) {
    if (typeof value.character_id !== "string") {
      return false;
    }
    if (typeof value.value !== "boolean") {
      return false;
    }
    if (
      value.after_event !== undefined &&
      typeof value.after_event !== "string"
    ) {
      return false;
    }
    return true;
  }

  if (value.type === WAS_EVENT_TYPE.UPDATE_STATE) {
    if (value.target === WAS_EVENT_STATE_TYPE.GAME_CLEAR) {
      return true;
    }
    if (value.target === WAS_EVENT_STATE_TYPE.CHAPTER) {
      if (typeof value.chapter !== "number") {
        return false;
      }
      return true;
    }

    if (
      value.target === WAS_EVENT_STATE_TYPE.AREA_INVADED ||
      value.target === WAS_EVENT_STATE_TYPE.AREA_MANAGED
    ) {
      if (typeof value.area_id !== "string") {
        return false;
      }
      if (typeof value.value !== "boolean") {
        return false;
      }
      return true;
    }
    if (
      value.target === WAS_EVENT_STATE_TYPE.CHARACTER_FRIENDLY ||
      value.target === WAS_EVENT_STATE_TYPE.CHARACTER_ALIVE
    ) {
      if (typeof value.character_id !== "string") {
        return false;
      }
      if (typeof value.value !== "boolean") {
        return false;
      }
      return true;
    }
    return false;
  }

  if (value.type === WAS_EVENT_TYPE.CHANGE_PAGE) {
    if (!["MAP", "AREA", "ENDING"].includes(value.page_id)) {
      return false;
    }
    return true;
  }

  return false;
}

export type WasEventAliveConditionDefine = {
  type: WAS_EVENT_CONDITION_TYPE.ALIVE;
  character_id: string;
  value: boolean;
  and?: WasEventConditionDefine;
};

export type WasEventFriendlyConditionDefine = {
  type: WAS_EVENT_CONDITION_TYPE.FRIENDLY;
  character_id: string;
  value: boolean;
  and?: WasEventConditionDefine;
};

export type WasEventInvadeConditionDefine = {
  type: WAS_EVENT_CONDITION_TYPE.INVADE;
  area_id: string;
  value: boolean;
  and?: WasEventConditionDefine;
};

export type WasEventManageConditionDefine = {
  type: WAS_EVENT_CONDITION_TYPE.MANAGE;
  area_id: string;
  value: boolean;
  and?: WasEventConditionDefine;
};

export type WasEventChapterConditionDefine = {
  type: WAS_EVENT_CONDITION_TYPE.CHAPTER;
  chapter: number;
  operator: "eq" | "ge" | "le" | "gt" | "lt";
  and?: WasEventConditionDefine;
};

export type WasEventConditionDefine =
  | WasEventAliveConditionDefine
  | WasEventInvadeConditionDefine
  | WasEventFriendlyConditionDefine
  | WasEventManageConditionDefine
  | WasEventChapterConditionDefine;

export function isWasEventConditionDefine(
  value: any
): value is WasEventConditionDefine {
  if (typeof value !== "object" || value === null) {
    return false;
  }

  if (value.type === WAS_EVENT_CONDITION_TYPE.ALIVE) {
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

  if (value.type === WAS_EVENT_CONDITION_TYPE.FRIENDLY) {
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

  if (value.type === WAS_EVENT_CONDITION_TYPE.INVADE) {
    if (typeof value.area_id !== "string") {
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

  if (value.type === WAS_EVENT_CONDITION_TYPE.MANAGE) {
    if (typeof value.area_id !== "string") {
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

  if (value.type === WAS_EVENT_CONDITION_TYPE.CHAPTER) {
    if (typeof value.chapter !== "number") {
      return false;
    }
    if (!["eq", "ge", "le", "gt", "lt"].includes(value.operator)) {
      return false;
    }
    if (value.and !== undefined && !isWasEventConditionDefine(value.and)) {
      return false;
    }
    return true;
  }
  return false;
}

export type WasEventTriggerDefine = {
  id: string;
  description?: string;
  event: WasEventDefine;
  conditions: WasEventConditionDefine[];
  repeat?: boolean;
};

export function isWasEventTriggerDefine(
  value: any
): value is WasEventTriggerDefine {
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

  if (!isWasEventDefine(value.event)) {
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

  if (value.repeat !== undefined && typeof value.repeat !== "boolean") {
    return false;
  }

  return true;
}
