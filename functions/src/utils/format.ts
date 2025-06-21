export class FormatUtils {
  private constructor() {}

  /**
   * 渡されたオブジェクトが文字列をキーとする連想配列形式のオブジェクトかを判定する
   * @param {any} value 任意のオブジェクト
   * @returns {boolean} 連想配列オブジェクトならtrue、それ以外はfalse
   */
  static isObject(value: any): value is Record<string, any> {
    if (value === null) {
      return false;
    }
    if (Array.isArray(value)) {
      return false;
    }
    return typeof value === "object";
  }

  /**
   * 渡されたオブジェクトが文字列の配列かを判定する
   * @param {any} value 任意のオブジェクト
   * @returns {boolean} 値が文字列の配列ならtrue、それ以外はfalse
   */
  static isStringArray(value: any): value is string[] {
    if (!Array.isArray(value)) {
      return false;
    }
    return value.every((v: any) => typeof v === "string");
  }

  /**
   * 渡されたオブジェクトが数値の配列かを判定する
   * @param {any} value 任意のオブジェクト
   * @returns {boolean} 値が数値の配列ならtrue、それ以外はfalse
   */
  static isNumberArray(value: any): value is number[] {
    if (!Array.isArray(value)) {
      return false;
    }
    return value.every((v: any) => typeof v === "number");
  }

  /**
   * 渡されたオブジェクトがnullまたはundefinedかを判定する
   * @param {any} value 任意のオブジェクト
   * @returns {boolean} 値がnullまたはundefinedならtrue、それ以外はfalse
   */
  static isNoValue(value: any): value is null | undefined {
    return value === null || value === undefined;
  }

  /**
   * 渡されたオブジェクトがnullまたはundefinedまたは文字列かを判定する
   * @param {any} value 任意のオブジェクト
   * @returns {boolean} 値がnullまたはundefinedまたは文字列ならtrue、それ以外はfalse
   */
  static isOptionalString(value: any): value is string | undefined | null {
    return FormatUtils.isNoValue(value) || typeof value === "string";
  }

  /**
   * 渡されたオブジェクトがnullまたはundefinedまたは数値かを判定する
   * @param {any} value 任意のオブジェクト
   * @returns {boolean} 値がnullまたはundefinedまたは数値ならtrue、それ以外はfalse
   */
  static isOptionalNumber(value: any): value is number | undefined | null {
    return FormatUtils.isNoValue(value) || typeof value === "number";
  }

  /**
   * 渡されたオブジェクトがnullまたはundefinedまたは真偽値かを判定する
   * @param {any} value 任意のおジェクト
   * @returns {boolean} 値がnullまたはundefinedまたは真偽値ならtrue、それ以外はfalse
   */
  static isOptionalBoolean(value: any): value is boolean | undefined | null {
    return FormatUtils.isNoValue(value) || typeof value === "boolean";
  }
}
