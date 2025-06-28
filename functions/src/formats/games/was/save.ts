import { FormatUtils } from "@/utils/format";
import {
  WAS_AREA_STATE_TYPE,
  WAS_CHARACTER_STATE_TYPE,
} from "@/const/games/was/const";
import { isWasStatusDefine, WasStatusDefine } from "@/formats/games/was/status";

export type WasSaveData = {
  chapter: number;
  protagonist: {
    name: string;
    skills: string[];
    defaultStatus: WasStatusDefine;
    allys: {
      id: string;
      name: string;
      skills: string[];
    }[];
  };
  characters: {
    id: string;
    state:
      | WAS_CHARACTER_STATE_TYPE.NEUTRAL
      | WAS_CHARACTER_STATE_TYPE.FRIENDLY
      | WAS_CHARACTER_STATE_TYPE.ANGRY;
    dead: boolean;
  }[];
  areas: {
    id: string;
    state: WAS_AREA_STATE_TYPE;
    triggered: string[];
  }[];
};

export const isWasSaveData = (value: any): value is WasSaveData => {
  if (!FormatUtils.isObject(value)) {
    return false;
  }
  if (typeof value.chapter !== "number") {
    return false;
  }

  if (!FormatUtils.isObject(value.protagonist)) {
    return false;
  }
  if (typeof value.protagonist.name !== "string") {
    return false;
  }
  if (!Array.isArray(value.protagonist.skills)) {
    return false;
  }
  if (
    !value.protagonist.skills.every((skill: any) => typeof skill === "string")
  ) {
    return false;
  }

  if (!isWasStatusDefine(value.protagonist.defaultStatus)) {
    return false;
  }

  if (!Array.isArray(value.protagonist.allys)) {
    return false;
  }

  for (const ally of value.protagonist.allys) {
    if (typeof ally.id !== "string") {
      return false;
    }
    if (typeof ally.name !== "string") {
      return false;
    }
    if (!Array.isArray(ally.skills)) {
      return false;
    }
    if (!ally.skills.every((skill: any) => typeof skill === "string")) {
      return false;
    }
  }

  if (!Array.isArray(value.characters)) {
    return false;
  }

  for (const character of value.characters) {
    if (typeof character.id !== "string") {
      return false;
    }
    if (!Object.values(WAS_CHARACTER_STATE_TYPE).includes(character.state)) {
      return false;
    }
    if (typeof character.dead !== "boolean") {
      return false;
    }
  }
  if (!Array.isArray(value.areas)) {
    return false;
  }

  for (const area of value.areas) {
    if (typeof area.id !== "string") {
      return false;
    }

    if (!Object.values(WAS_AREA_STATE_TYPE).includes(area.state)) {
      return false;
    }

    if (!Array.isArray(area.triggered)) {
      return false;
    }
    if (!area.triggered.every((id: any) => typeof id === "string")) {
      return false;
    }
  }

  return true;
};
