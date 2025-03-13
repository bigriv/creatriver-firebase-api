import { FirebaseStorageModel } from "@/formats/fsmodel";

export interface WasAreaDefine extends FirebaseStorageModel {
  id: string;
  name: string;
  position: {
    x: number;
    y: number;
  };
  width: number;
  height: number;
  outsideVisual: string;
  triggers: string[];
  characters: string[];
}

export function isWasAreaDefine(value: any): value is WasAreaDefine {
  if (typeof value !== "object" || value === null) {
    return false;
  }
  if (typeof value.id !== "string") {
    return false;
  }

  if (typeof value.name !== "string") {
    return false;
  }
  if (typeof value.position !== "object" || value.position === null) {
    return false;
  }
  if (typeof value.position.x !== "number") {
    return false;
  }
  if (typeof value.position.y !== "number") {
    return false;
  }
  if (typeof value.width !== "number") {
    return false;
  }
  if (typeof value.height !== "number") {
    return false;
  }
  if (typeof value.outsideVisual !== "string") {
    return false;
  }
  if (!Array.isArray(value.triggers)) {
    return false;
  }
  if (!value.triggers.every((trigger: any) => typeof trigger === "string")) {
    return false;
  }
  if (!Array.isArray(value.characters)) {
    return false;
  }
  if (
    !value.characters.every((character: any) => typeof character === "string")
  ) {
    return false;
  }
  return true;
}
