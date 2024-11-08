import { FirebaseStorageModel } from "@/formats/fsmodel";

export type WasTalkEventDefine = {
  type: "TALK";
  talk_id: string;
  after_event?:
    | {
        type: "ANYWAY";
        event_id: string;
      }
    | {
        type: "SELECT_IS";
        candidate: {
          label: string;
          value: string;
          event_id: string;
        }[];
      };
};

export type WasBattleEventDefine = {
  type: "BATTLE";
  battle_id: string;
};

export type WasPlayAudioEventDefine = {
  type: "PLAY_AUDIO";
  audio_id: string;
  asBgm?: boolean;
  after_event?: string;
};

export type WasUpdateStateEventDefine = {
  type: "UPDATE_STATE";
  after_event?: string;
} & (
  | {
      target: "GAME_CLEAR";
    }
  | {
      target: "CHAPTER";
      value: number;
    }
  | {
      target: "AREA_INVADED" | "AREA_MANAGED";
      area_id: string;
      value: boolean;
    }
  | {
      target: "CHARACTER_FRIENDLY";
      character_id: string;
      value: boolean;
    }
);

export type WasLearnSkillEventDefine = {
  type: "LEARN_SKILL";
  skill_id: string;
  after_event?: string;
};

export type WasUpdateAllyEventDefine = {
  type: "UPDATE_ALLY";
  character_id: string;
  value: boolean;
  after_event?: string;
};

export type WasChangePageEventDefine = {
  type: "CHANGE_PAGE";
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

  if (value.type === "TALK") {
    if (typeof value.talk_id !== "string") {
      return false;
    }
    if (value.after_event === undefined) {
      return true;
    }
    if (typeof value.after_event !== "object" || value.after_event === null) {
      return false;
    }
    if (value.after_event.type === "ANYWAY") {
      if (typeof value.after_event.event_id !== "string") {
        return false;
      }
      return true;
    }
    if (value.after_event.type === "SELECT_IS") {
      if (!Array.isArray(value.after_event.candidate)) {
        return false;
      }
      for (const next of value.after_event.candidate) {
        if (typeof next !== "object" || next === null) {
          return false;
        }
        if (typeof next.label !== "string") {
          return false;
        }
        if (typeof next.value !== "string") {
          return false;
        }
        if (typeof next.event_id !== "string") {
          return false;
        }
      }
      return true;
    }
    return false;
  }

  if (value.type === "BATTLE") {
    if (typeof value.battle_id !== "string") {
      return false;
    }
    return true;
  }

  if (value.type === "PLAY_AUDIO") {
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

  if (value.type === "LEARN_SKILL") {
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

  if (value.type === "UPDATE_ALLY") {
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

  if (value.type === "UPDATE_STATE") {
    if (value.target === "GAME_CLEAR") {
      return true;
    }
    if (value.target === "CHAPTER") {
      if (typeof value.value !== "number") {
        return false;
      }
      return true;
    }

    if (value.target === "AREA_INVADED" || value.target === "AREA_MANAGED") {
      if (typeof value.area_id !== "string") {
        return false;
      }
      if (typeof value.value !== "boolean") {
        return false;
      }
      return true;
    }
    if (value.target === "CHARACTER_FRIENDLY") {
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

  if (value.type === "CHANGE_PAGE") {
    if (!["MAP", "AREA", "ENDING"].includes(value.page_id)) {
      return false;
    }
    return true;
  }

  return false;
}

export type WasEventAliveConditionDefine = {
  type: "ALIVE";
  character_id: string;
  value: boolean;
  and?: WasEventConditionDefine;
};

export type WasEventFriendlyConditionDefine = {
  type: "FRIENDLY";
  character_id: string;
  value: boolean;
  and?: WasEventConditionDefine;
};

export type WasEventInvadeConditionDefine = {
  type: "INVADE";
  area_id: string;
  value: boolean;
  and?: WasEventConditionDefine;
};

export type WasEventManageConditionDefine = {
  type: "MANAGE";
  area_id: string;
  value: boolean;
  and?: WasEventConditionDefine;
};

export type WasEventChapterConditionDefine = {
  type: "CHAPTER";
  value: number;
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

  if (value.type === "ALIVE") {
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

  if (value.type === "FRIENDLY") {
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

  if (value.type === "INVADE") {
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

  if (value.type === "MANAGE") {
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

  if (value.type === "CHAPTER") {
    if (typeof value.value === "number") {
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

export interface WasEventTriggerDefine extends FirebaseStorageModel {
  id: string;
  description?: string;
  event: WasEventDefine;
  conditions: WasEventConditionDefine[];
  repeat?: boolean;
}

export function isWasEventTriggerDefine(
  value: any
): value is WasEventTriggerDefine {
  if (typeof value !== "object" || value === null) {
    return false;
  }

  if (typeof value.id !== "boolean") {
    return false;
  }

  if (
    value.description !== undefined &&
    typeof value.description !== "boolean"
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
