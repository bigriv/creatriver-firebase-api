export type JsonPrimitive = string | number | boolean | null | undefined;

export type JsonArray = JsonPrimitive[] | JsonObject[];

export type JsonObject = {
  [key: string]: JsonPrimitive | JsonObject | JsonArray;
};

export type Json = JsonObject;

export class JsonUtils {
  private constructor() {}

  /**
   * 文字列をキーとしたオブジェクトかを判定する
   * @param value 任意のインスタンス
   * @returns 文字列をキーとしたオブジェクトならtrue、それ以外はfalse
   */
  static isKeyValue(value: any): value is { [key: string]: any } {
    if (typeof value !== "object" || value === null) {
      return false;
    }
    if (Array.isArray(value)) {
      return false;
    }
    for (const key of Object.keys(value)) {
      if (typeof key !== "string") {
        return false;
      }
    }
    return true;
  }

  /**
   * key: value形式のJSONオブジェクトを配列に変換する
   * @param json 変換するJSONオブジェクト
   * @returns JSONオブジェクトを配列化したオブジェクト(項目としてkeyが追加される)
   */
  static convertKeyValueToArray<T extends Json>(json: {
    [key: string]: T;
  }): Array<{ key: string } & T> {
    return Object.keys(json).map((key) => {
      return { key: key, ...json[key] };
    });
  }
}
