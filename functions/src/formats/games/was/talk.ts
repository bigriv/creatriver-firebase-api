import { FirebaseStorageModel } from "@/formats/fsmodel";

export type WasTalkMessageDefine = {
  leftImage?: string;
  centerImage?: string;
  rightImage?: string;
  talker?: string;
  texts: string[];
  sound?: string;
  speed?: number;
};

export interface WasTalkDefine extends FirebaseStorageModel {
  id: string;
  description?: string;
  messages: WasTalkMessageDefine[];
  selectOptions?: {
    label: string;
    value: string;
    eventId: string;
  }[];
  afterEventId?: string;
}

export function isWasTalkDefine(value: any): value is WasTalkDefine {
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

  if (!Array.isArray(value.messages)) {
    return false;
  }
  for (const e of value.messages) {
    // 会話者が設定されていて文字列でなければ不正フォーマット
    if (e.talker !== undefined && typeof e.talker !== "string") {
      return false;
    }
    // テキストが文字列の配列でなければ不正フォーマット
    if (!Array.isArray(e.texts)) {
      return false;
    }
    if (!e.texts.every((text: any) => typeof text === "string")) {
      return false;
    }
    if (e.leftImage !== undefined && typeof e.leftImage !== "string") {
      return false;
    }
    if (e.centerImage !== undefined && typeof e.centerImage !== "string") {
      return false;
    }
    if (e.rightImage !== undefined && typeof e.rightImage !== "string") {
      return false;
    }

    // soundが設定されていて文字列でなければ不正フォーマット
    if (e.sound !== undefined && typeof e.sound !== "string") {
      return false;
    }
    // speedが設定されていて数値でなければ不正フォーマット
    if (e.speed !== undefined && typeof e.speed !== "number") {
      return false;
    }
  }

  if (
    value.selectOptions !== undefined &&
    !Array.isArray(value.selectOptions)
  ) {
    return false;
  }
  for (const option of value.selectOptions ?? []) {
    if (typeof option !== "object" || option === null) {
      return false;
    }
    if (typeof option.label !== "string") {
      return false;
    }
    if (typeof option.value !== "string") {
      return false;
    }
    if (typeof option.eventId !== "string") {
      return false;
    }
  }
  // 次のイベントが設定されている場合のフォーマットチェック
  if (
    value.afterEventId !== undefined &&
    typeof value.afterEventId !== "string"
  ) {
    return false;
  }

  // 全てのフォーマットチェックを通れば正しいフォーマットとみなす
  return true;
}
