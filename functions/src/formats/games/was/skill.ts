import { FirebaseStorageModel } from "@/formats/fsmodel";
import { WAS_SKILL_TYPE, WAS_STATE_CONDITION } from "@/const/games/was/const";

export interface WasSkillDefine extends FirebaseStorageModel {
  id: string;
  name: string;
  description: string;
  effects: WasSkillEffectDefine[];
}

export function isWasSkillDefine(value: any): value is WasSkillDefine {
  if (typeof value !== "object" || value === null) {
    return false;
  }
  if (typeof value.id !== "string") {
    return false;
  }
  if (typeof value.name !== "string") {
    return false;
  }
  if (typeof value.description !== "string") {
    return false;
  }
  if (!Array.isArray(value.effects)) {
    return false;
  }
  if (value.effects.some((effect: any) => !isWasSkillEffectDefine(effect))) {
    return false;
  }
  return true;
}

type WasSkillDamageEffectDefine = {
  type: WAS_SKILL_TYPE.DAMAGE;
  damage_formula: string;
  hit_rate_formula: string;
};
type WasSkillHealEffectDefine = {
  type: WAS_SKILL_TYPE.HEAL;
  heal_formula: string;
};
type WasSkillGrantStateConditionEffectDefine = {
  type: WAS_SKILL_TYPE.GRANT_STATE_CONDITION;
  state_condition: WAS_STATE_CONDITION;
  hit_rate_formula: string;
};

type WasSkillReleaseStateConditionEffectDefine = {
  type: WAS_SKILL_TYPE.RELEASE_STATE_CONDITION;
  state_conditions: WAS_STATE_CONDITION[];
  hit_rate_formula: string;
};

type WasSkillMessageEffectDefine = {
  type: WAS_SKILL_TYPE.MESSAGE;
  message: string;
};

export type WasSkillEffectDefine = (
  | WasSkillDamageEffectDefine
  | WasSkillHealEffectDefine
  | WasSkillGrantStateConditionEffectDefine
  | WasSkillReleaseStateConditionEffectDefine
  | WasSkillMessageEffectDefine
) & {
  target: "activest" | "opponent";
  se?: string;
  animation?: string;
};

export function isWasSkillEffectDefine(obj: any): obj is WasSkillEffectDefine {
  if (typeof obj !== "object" || obj === null) {
    return false;
  }

  if (obj.target !== "activest" && obj.target !== "opponent") {
    return false;
  }

  if (obj.se && typeof obj.se !== "string") {
    return false;
  }

  if (obj.animation && typeof obj.animation !== "string") {
    return false;
  }

  if (obj.type === WAS_SKILL_TYPE.DAMAGE) {
    if (typeof obj.damage_formula !== "string") {
      return false;
    }
    if (typeof obj.hit_rate_formula !== "string") {
      return false;
    }
    return true;
  }

  if (obj.type === WAS_SKILL_TYPE.HEAL) {
    if (typeof obj.heal_formula !== "string") {
      return false;
    }
    return true;
  }

  if (obj.type === WAS_SKILL_TYPE.GRANT_STATE_CONDITION) {
    if (typeof obj.state_condition !== "string") {
      return false;
    }
    if (typeof obj.hit_rate_formula !== "string") {
      return false;
    }
    return true;
  }

  if (obj.type === WAS_SKILL_TYPE.RELEASE_STATE_CONDITION) {
    if (!Array.isArray(obj.state_conditions)) {
      return false;
    }
    if (!obj.state_conditions.every((c: any) => typeof c === "string")) {
      return false;
    }
    if (typeof obj.hit_rate_formula !== "string") {
      return false;
    }
    return true;
  }

  if (obj.type === WAS_SKILL_TYPE.MESSAGE) {
    if (typeof obj.message !== "string") {
      return false;
    }
    return true;
  }

  return false;
}
