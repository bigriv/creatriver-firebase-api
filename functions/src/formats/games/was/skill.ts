import { WAS_SKILL_TYPE, WAS_STATE_CONDITION } from "@/const/games/was/const";

export type WasSkillDefine = {
  id: string;
  name: string;
  description: string;
  se?: string;
  animation?: string;
  effects: WasSkillEffectDefine[];
};

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
  if (value.se !== undefined && typeof value.se !== "string") {
    return false;
  }
  if (value.animation !== undefined && typeof value.animation !== "string") {
    return false;
  }
  if (!Array.isArray(value.effects)) {
    return false;
  }
  if (!value.effects.every((effect: any) => isWasSkillEffectDefine(effect))) {
    return false;
  }
  return true;
}

type WasSKillAVDDamegeEffectDefine = {
  type: WAS_SKILL_TYPE.ATTACK_VS_DEFFECE_DAMAGE;
  power: number;
  hit_rate: number;
};

type WasSKillConstDamegeEffectDefine = {
  type: WAS_SKILL_TYPE.CONST_DAMAGE;
  amount: number;
  hit_rate: number;
};

type WasSkillConstHealEffectDefine = {
  type: WAS_SKILL_TYPE.CONST_HEAL;
  amount: number;
};

type WasSkillRateHealEffectDefine = {
  type: WAS_SKILL_TYPE.RATE_HEAL;
  rate: number;
};

type WasSkillGrantStateConditionEffectDefine = {
  type: WAS_SKILL_TYPE.GRANT_STATE_CONDITION;
  state_condition: WAS_STATE_CONDITION;
  hit_rate: number;
};

type WasSkillReleaseStateConditionEffectDefine = {
  type: WAS_SKILL_TYPE.RELEASE_STATE_CONDITION;
  state_conditions: WAS_STATE_CONDITION[];
  hit_rate: number;
};

export type WasSkillEffectDefine = (
  | WasSKillAVDDamegeEffectDefine
  | WasSKillConstDamegeEffectDefine
  | WasSkillConstHealEffectDefine
  | WasSkillRateHealEffectDefine
  | WasSkillGrantStateConditionEffectDefine
  | WasSkillReleaseStateConditionEffectDefine
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

  if (obj.type === WAS_SKILL_TYPE.ATTACK_VS_DEFFECE_DAMAGE) {
    if (typeof obj.power !== "number") {
      return false;
    }
    if (typeof obj.hit_rate !== "number") {
      return false;
    }
    return true;
  }

  if (obj.type === WAS_SKILL_TYPE.CONST_DAMAGE) {
    if (typeof obj.amount !== "number") {
      return false;
    }
    if (typeof obj.hit_rate !== "number") {
      return false;
    }
    return true;
  }

  if (obj.type === WAS_SKILL_TYPE.CONST_HEAL) {
    if (typeof obj.amount !== "number") {
      return false;
    }
    return true;
  }

  if (obj.type === WAS_SKILL_TYPE.RATE_HEAL) {
    if (typeof obj.rate !== "number") {
      return false;
    }
    return true;
  }

  if (obj.type === WAS_SKILL_TYPE.GRANT_STATE_CONDITION) {
    if (typeof obj.state_condition !== "number") {
      return false;
    }
    if (typeof obj.hit_rate !== "number") {
      return false;
    }
    return true;
  }

  if (obj.type === WAS_SKILL_TYPE.RELEASE_STATE_CONDITION) {
    if (!Array.isArray(obj.state_conditions)) {
      return false;
    }
    if (!obj.state_condition.every((c: any) => typeof c === "number")) {
      return false;
    }
    if (typeof obj.hit_rate !== "number") {
      return false;
    }
    return true;
  }

  return false;
}
