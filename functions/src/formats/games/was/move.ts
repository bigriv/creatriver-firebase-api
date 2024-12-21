import { WAS_OPERATOR } from "@/const/games/was/const";

export type WasMovePatternDefine = {
  condition: {
    left: string;
    operator: WAS_OPERATOR;
    right: string;
  };
  candidate: string[];
};

export const isWasMovePatternDefine = (
  value: any
): value is WasMovePatternDefine => {
  if (typeof value !== "object" || value === null) {
    return false;
  }
  if (typeof value.condition !== "object" || value.condition === null) {
    return false;
  }
  if (typeof value.condition.left !== "string") {
    return false;
  }
  if (!Object.values(WAS_OPERATOR).includes(value.condition.operator)) {
    return false;
  }
  if (typeof value.condition.right !== "string") {
    return false;
  }
  if (!Array.isArray(value.candidate)) {
    return false;
  }
  if (!value.candidate.every((c: any) => typeof c === "string")) {
    return false;
  }
  return true;
};
