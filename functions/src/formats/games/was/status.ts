import { FormatUtils } from "@/utils/format";

export type WasStatusDefine = {
  life: number;
  attack: number;
  defense: number;
  speed: number;
};

export const isWasStatusDefine = (value: any): value is WasStatusDefine => {
  if (!FormatUtils.isObject(value)) {
    return false;
  }

  if (typeof value.life !== "number") {
    return false;
  }
  if (typeof value.attack !== "number") {
    return false;
  }
  if (typeof value.defense !== "number") {
    return false;
  }
  if (typeof value.speed !== "number") {
    return false;
  }

  return true;
};
