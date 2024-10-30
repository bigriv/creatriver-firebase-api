import { Bucket } from "@google-cloud/storage";
import { JsonUtils, KeyValue } from "@/utils/json";
import { isWasTalkDefine, WasTalkDefine } from "@/formats/games/was/talk";
import { WasTalkRepositoryIf } from "@/controller/edits/games/was/talk";

export class WasTalkRepository implements WasTalkRepositoryIf {
  private static readonly FILE_PATH = "gameofus/games/was";
  private static readonly FILE_NAME = "talk.json";
  private bucket: Bucket;

  constructor(bucket: Bucket) {
    this.bucket = bucket;
  }

  /**
   * 会話定義をすべて取得する
   * @returns 会話定義の連想配列
   */
  async findAll(): Promise<KeyValue<WasTalkDefine>> {
    const fileRef = this.bucket.file(
      `${WasTalkRepository.FILE_PATH}/${WasTalkRepository.FILE_NAME}`
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
    if (!Object.keys(json).every((key) => isWasTalkDefine(json[key]))) {
      throw new Error("File is broken. It has not talk define format.");
    }

    return json;
  }

  /**
   * 会話定義を保存する
   * @param talk 保存する会話定義
   */
  async save(talk: WasTalkDefine): Promise<void> {
    const fileRef = this.bucket.file(
      `${WasTalkRepository.FILE_PATH}/${WasTalkRepository.FILE_NAME}`
    );
    const [exists] = await fileRef.exists();

    let putData = JsonUtils.copy(talk);
    // ファイルが既に存在する場合はバックアップを作成する
    if (exists) {
      const backupFilePath = `${WasTalkRepository.FILE_PATH}/backups/talks`;
      const backFileName = `talk-${Date.now()}.json`;
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
   * 指定したIDの会話定義を削除する
   * @param id 会話ID
   */
  async deleteById(id: string): Promise<void> {
    const fileRef = this.bucket.file(
      `${WasTalkRepository.FILE_PATH}/${WasTalkRepository.FILE_NAME}`
    );
    const [exists] = await fileRef.exists();

    // ファイルが存在しない場合はエラー
    if (!exists) {
      throw new Error("File is not exist.");
    }

    const backupFilePath = `${WasTalkRepository.FILE_PATH}/backups/talks`;
    const backFileName = `talk-${Date.now()}.json`;
    const backupFileRef = this.bucket.file(`${backupFilePath}/${backFileName}`);

    await fileRef.copy(backupFileRef);

    const [fileContents] = await fileRef.download();
    const storageData = JSON.parse(fileContents.toString());
    delete storageData[id];

    // 既存のファイルを上書きして保存
    await fileRef.save(JSON.stringify(storageData));
  }
}
