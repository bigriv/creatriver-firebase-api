import { FirebaseStorageModel } from "@/formats/fsmodel";
import {
  WAS_AREA_STATE_TYPE,
  WAS_CHARACTER_STATE_TYPE,
  WAS_EVENT_STATE_TYPE,
  WAS_EVENT_TYPE,
} from "@/const/games/was/const";

export type WasTalkEventDefine = {
  type: WAS_EVENT_TYPE.TALK;
  talk_id: string;
};

export type WasBattleEventDefine = {
  type: WAS_EVENT_TYPE.BATTLE;
  battle_id: string;
};

export type WasPlayAudioEventDefine = {
  type: WAS_EVENT_TYPE.PLAY_AUDIO;
  audio_id: string;
  asBgm?: boolean;
};

export type WasUpdateStateEventDefine = {
  type: WAS_EVENT_TYPE.UPDATE_STATE;
} & (
  | {
      target: WAS_EVENT_STATE_TYPE.GAME_CLEAR;
    }
  | {
      target: WAS_EVENT_STATE_TYPE.CHAPTER;
      chapter: number;
    }
  | {
      target: WAS_EVENT_STATE_TYPE.AREA;
      area_id: string;
      value: WAS_AREA_STATE_TYPE;
    }
  | {
      target: WAS_EVENT_STATE_TYPE.CHARACTER;
      character_id: string;
      value: WAS_CHARACTER_STATE_TYPE;
    }
);

export type WasLearnSkillEventDefine = {
  type: WAS_EVENT_TYPE.LEARN_SKILL;
  skill_id: string;
};

export type WasUpdateAllyEventDefine = {
  type: WAS_EVENT_TYPE.UPDATE_ALLY;
  character_id: string;
  value: boolean;
};

export type WasChangePageEventDefine = {
  type: WAS_EVENT_TYPE.CHANGE_PAGE;
  page_id: "MAP" | "AREA" | "ENDING";
};

export type WasEventDefine = {
  id: string;
  description?: string;
} & (
  | WasTalkEventDefine
  | WasBattleEventDefine
  | WasPlayAudioEventDefine
  | WasUpdateStateEventDefine
  | WasLearnSkillEventDefine
  | WasUpdateAllyEventDefine
  | WasChangePageEventDefine
) &
  FirebaseStorageModel;

export function isWasEventDefine(value: any): value is WasEventDefine {
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

  if (value.type === WAS_EVENT_TYPE.TALK) {
    if (typeof value.talk_id !== "string") {
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
    return true;
  }

  if (value.type === WAS_EVENT_TYPE.LEARN_SKILL) {
    if (typeof value.skill_id !== "string") {
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

    if (value.target === WAS_EVENT_STATE_TYPE.AREA) {
      if (typeof value.area_id !== "string") {
        return false;
      }
      if (!Object.values(WAS_AREA_STATE_TYPE).includes(value.value)) {
        return false;
      }
      return true;
    }
    if (value.target === WAS_EVENT_STATE_TYPE.CHARACTER) {
      if (typeof value.character_id !== "string") {
        return false;
      }
      if (!Object.values(WAS_CHARACTER_STATE_TYPE).includes(value.value)) {
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
