import { FirebaseStorageModel } from "@/formats/fsmodel";

export type WasTalkMessageDefine = {
  talker?: string;
  text: string;
  speed?: number;
  leftImage?: string;
  centerImage?: string;
  rightImage?: string;
  sound?: string;
};

export interface WasTalkDefine extends FirebaseStorageModel {
  id: string;
  description?: string;
  messages: WasTalkMessageDefine[];
  selectOptions?: {
    label: string;
    trigger_id: string;
  }[];
  next?: string;
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
    if (e.text !== "string") {
      return false;
    }
    // speedが設定されていて数値でなければ不正フォーマット
    if (e.speed !== undefined && typeof e.speed !== "number") {
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
    if (typeof option.trigger_id !== "string") {
      return false;
    }
  }
  // 次の会話が設定されている場合のフォーマットチェック
  if (value.next !== undefined && typeof value.next !== "string") {
    return false;
  }

  // 全てのフォーマットチェックを通れば正しいフォーマットとみなす
  return true;
}
