import { FormatUtils } from "@/utils/format";
import { FirebaseStorageModel } from "@/formats/fsmodel";

export interface WasAreaDefine extends FirebaseStorageModel {
  id: string;
  name: string;
  position: {
    x: number;
    y: number;
  };
  triggers: string[];
}

export function isWasAreaDefine(value: any): value is WasAreaDefine {
  if (!FormatUtils.isObject(value)) {
    return false;
  }
  if (typeof value.id !== "string") {
    return false;
  }

  if (typeof value.name !== "string") {
    return false;
  }
  if (!FormatUtils.isObject(value)) {
    return false;
  }
  if (typeof value.position.x !== "number") {
    return false;
  }
  if (typeof value.position.y !== "number") {
    return false;
  }
  if (!Array.isArray(value.triggers)) {
    return false;
  }
  if (!value.triggers.every((trigger: any) => typeof trigger === "string")) {
    return false;
  }
  return true;
}
