import { FormatUtils } from "@/utils/format";
import {
  WAS_AREA_STATE_TYPE,
  WAS_CHARACTER_STATE_TYPE,
} from "@/const/games/was/const";
import { isWasMovePatternDefine, WasMovePatternDefine } from "@/formats/games/was/move";
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
      move_patterns: WasMovePatternDefine[];
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
    console.warn("value is not an object", value);
    return false;
  }
  if (typeof value.chapter !== "number") {
    console.warn("chapter is not number", value.chapter);
    return false;
  }

  if (!FormatUtils.isObject(value.protagonist)) {
    console.warn("protagonist is not an object", value.protagonist);
    return false;
  }
  if (typeof value.protagonist.name !== "string") {
    console.warn("protagonist.name is not string", value.protagonist.name);
    return false;
  }
  if (!Array.isArray(value.protagonist.skills)) {
    console.warn(
      "protagonist.skills is not an array",
      value.protagonist.skills
    );
    return false;
  }
  if (
    !value.protagonist.skills.every((skill: any) => typeof skill === "string")
  ) {
    console.warn(
      "protagonist.skills contains non-string values",
      value.protagonist.skills
    );
    return false;
  }

  if (!isWasStatusDefine(value.protagonist.defaultStatus)) {
    console.warn(
      "protagonist.defaultStatus is not a valid WasStatusDefine",
      value.protagonist.defaultStatus
    );
    return false;
  }

  if (!Array.isArray(value.protagonist.allys)) {
    console.warn("protagonist.allys is not an array", value.protagonist.allys);
    return false;
  }

  for (const ally of value.protagonist.allys) {
    if (typeof ally.id !== "string") {
      console.warn("ally.id is not string", ally.id);
      return false;
    }
    if (typeof ally.name !== "string") {
      console.warn("ally.name is not string", ally.name);
      return false;
    }
    if (!Array.isArray(ally.move_patterns)) {
      console.warn("ally.move_patterns is not a Array", ally.move_patterns);
      return false;
    }
    if (!ally.move_patterns.every((p: any) => isWasMovePatternDefine(p))) {
      console.warn(
        "ally.move_patterns is not a valid WasMovePatternDefine",
        ally.move_patterns
      );
      return false;
    }
  }

  if (!Array.isArray(value.characters)) {
    console.warn("characters is not an array", value.characters);
    return false;
  }

  for (const character of value.characters) {
    if (typeof character.id !== "string") {
      console.warn("character.id is not string", character.id);
      return false;
    }
    if (!Object.values(WAS_CHARACTER_STATE_TYPE).includes(character.state)) {
      console.warn(
        "character.state is not a valid WAS_CHARACTER_STATE_TYPE",
        character.state
      );
      return false;
    }
    if (typeof character.dead !== "boolean") {
      console.warn("character.dead is not boolean", character.dead);
      return false;
    }
  }
  if (!Array.isArray(value.areas)) {
    console.warn("areas is not an array", value.areas);
    return false;
  }

  for (const area of value.areas) {
    if (typeof area.id !== "string") {
      console.warn("area.id is not string", area.id);
      return false;
    }

    if (!Object.values(WAS_AREA_STATE_TYPE).includes(area.state)) {
      console.warn("area.state is not a valid WAS_AREA_STATE_TYPE", area.state);
      return false;
    }

    if (!Array.isArray(area.triggered)) {
      console.warn("area.triggered is not an array", area.triggered);
      return false;
    }
    if (!area.triggered.every((id: any) => typeof id === "string")) {
      console.warn("area.triggered contains non-string values", area.triggered);
      return false;
    }
  }

  return true;
};
