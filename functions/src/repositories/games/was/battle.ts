import { Bucket } from "@google-cloud/storage";
import { JsonUtils, KeyValue } from "@/utils/json";
import { isWasBattleDefine, WasBattleDefine } from "@/formats/games/was/battle";
import { WasBattleRepositoryIf } from "@/controller/edits/games/was/battle";

export class WasBattleRepository implements WasBattleRepositoryIf {
  private static readonly FILE_PATH = "gameofus/games/was";
  private static readonly FILE_NAME = "battle.json";
  private bucket: Bucket;

  constructor(bucket: Bucket) {
    this.bucket = bucket;
  }

  /**
   * 戦闘定義をすべて取得する
   * @returns 戦闘定義の連想配列
   */
  async findAll(): Promise<KeyValue<WasBattleDefine>> {
    const fileRef = this.bucket.file(
      `${WasBattleRepository.FILE_PATH}/${WasBattleRepository.FILE_NAME}`
    );
    const [exists] = await fileRef.exists();

    if (!exists) {
      throw new Error("File is not exist.");
    }
    const [fileContents] = await fileRef.download();
    const json = JSON.parse(fileContents.toString());

    if (!JsonUtils.isKeyValue(json)) {
      throw new Error("File is broken. There was not key-value format.");
    }
    if (!Object.keys(json).every((key) => isWasBattleDefine(json[key]))) {
      throw new Error("File is broken. It has not battle define format.");
    }

    return json;
  }

  /**
   * 戦闘定義を保存する
   * @param battle 保存する戦闘定義
   */
  async save(battle: WasBattleDefine): Promise<void> {
    const fileRef = this.bucket.file(
      `${WasBattleRepository.FILE_PATH}/${WasBattleRepository.FILE_NAME}`
    );
    const [exists] = await fileRef.exists();

    let putData = JsonUtils.copy(battle);
    // ファイルが既に存在する場合はバックアップを作成する
    if (exists) {
      const backupFilePath = `${WasBattleRepository.FILE_PATH}/backups/battles`;
      const backFileName = `battle-${Date.now()}.json`;
      const backupFileRef = this.bucket.file(
        `${backupFilePath}/${backFileName}`
      );

      await fileRef.copy(backupFileRef);

      const [fileContents] = await fileRef.download();
      const storageData = JSON.parse(fileContents.toString());
      putData = Object.assign(storageData, { [putData.id]: putData });
    }

    // 既存のファイルと結合して保存
    await fileRef.save(JSON.stringify(putData));
  }

  /**
   * 指定したIDの戦闘定義を削除する
   * @param id 戦闘ID
   */
  async deleteById(id: string): Promise<void> {
    const fileRef = this.bucket.file(
      `${WasBattleRepository.FILE_PATH}/${WasBattleRepository.FILE_NAME}`
    );
    const [exists] = await fileRef.exists();

    // ファイルが存在しない場合はエラー
    if (!exists) {
      throw new Error("File is not exist.");
    }

    const backupFilePath = `${WasBattleRepository.FILE_PATH}/backups/battles`;
    const backFileName = `battle-${Date.now()}.json`;
    const backupFileRef = this.bucket.file(`${backupFilePath}/${backFileName}`);

    await fileRef.copy(backupFileRef);

    const [fileContents] = await fileRef.download();
    const storageData = JSON.parse(fileContents.toString());
    delete storageData[id];

    // 既存のファイルを上書きして保存
    await fileRef.save(JSON.stringify(storageData));
  }
}
