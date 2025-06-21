import { FormatUtils } from "@/utils/format";
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
  bgm?: string;
  background?: string;
  messages: WasTalkMessageDefine[];
}

export function isWasTalkDefine(value: any): value is WasTalkDefine {
  if (!FormatUtils.isObject(value)) {
    return false;
  }
  if (typeof value.id !== "string") {
    return false;
  }
  if (!FormatUtils.isOptionalString(value.description)) {
    return false;
  }
  if (!FormatUtils.isOptionalString(value.bgm)) {
    return false;
  }
  if (!FormatUtils.isOptionalString(value.background)) {
    return false;
  }
  if (!Array.isArray(value.messages)) {
    return false;
  }
  for (const e of value.messages) {
    // 会話者が設定されていて文字列でなければ不正フォーマット
    if (!FormatUtils.isOptionalString(e.talker)) {
      return false;
    }
    // テキストが文字列でなければ不正フォーマット
    if (typeof e.text !== "string") {
      return false;
    }
    // speedが設定されていて数値でなければ不正フォーマット
    if (!FormatUtils.isOptionalNumber(e.speed)) {
      return false;
    }
    if (!FormatUtils.isOptionalString(e.leftImage)) {
      return false;
    }
    if (!FormatUtils.isOptionalString(e.centerImage)) {
      return false;
    }
    if (!FormatUtils.isOptionalString(e.rightImage)) {
      return false;
    }

    // soundが設定されていて文字列でなければ不正フォーマット
    if (!FormatUtils.isOptionalString(e.sound)) {
      return false;
    }
  }

  // 全てのフォーマットチェックを通れば正しいフォーマットとみなす
  return true;
}
