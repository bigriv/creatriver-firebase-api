import { Bucket } from "@google-cloud/storage";
import { JsonUtils, KeyValue } from "@/utils/json";
import { isWasSkillDefine, WasSkillDefine } from "@/formats/games/was/skill";
import { WasSkillRepositoryIf } from "@/controller/edits/games/was/skill";

export class WasSkillRepository implements WasSkillRepositoryIf {
  private static readonly FILE_PATH = "gameofus/games/was";
  private static readonly FILE_NAME = "skill.json";
  private bucket: Bucket;

  constructor(bucket: Bucket) {
    this.bucket = bucket;
  }

  /**
   * 戦闘定義をすべて取得する
   * @returns 戦闘定義の連想配列
   */
  async findAll(): Promise<KeyValue<WasSkillDefine>> {
    const fileRef = this.bucket.file(
      `${WasSkillRepository.FILE_PATH}/${WasSkillRepository.FILE_NAME}`
    );
    const [exists] = await fileRef.exists();

    if (!exists) {
      return {};
    }
    const [fileContents] = await fileRef.download();
    const json = JSON.parse(fileContents.toString());

    if (!JsonUtils.isKeyValue(json)) {
      throw new Error("File is broken. There was not key-value format.");
    }
    if (!Object.keys(json).every((key) => isWasSkillDefine(json[key]))) {
      throw new Error("File is broken. It has not skill define format.");
    }

    return json;
  }

  /**
   * 戦闘定義を保存する
   * @param skill 保存する戦闘定義
   */
  async save(skill: WasSkillDefine): Promise<void> {
    const fileRef = this.bucket.file(
      `${WasSkillRepository.FILE_PATH}/${WasSkillRepository.FILE_NAME}`
    );
    const [exists] = await fileRef.exists();

    let putData = { [`${skill.id}`]: JsonUtils.copy(skill) };
    // ファイルが既に存在する場合はバックアップを作成する
    if (exists) {
      const backupFilePath = `${WasSkillRepository.FILE_PATH}/backups/skills`;
      const backFileName = `skill-${Date.now()}.json`;
      const backupFileRef = this.bucket.file(
        `${backupFilePath}/${backFileName}`
      );

      await fileRef.copy(backupFileRef);

      const [fileContents] = await fileRef.download();
      const storageData = JSON.parse(fileContents.toString());
      putData = Object.assign(storageData, putData);
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
      `${WasSkillRepository.FILE_PATH}/${WasSkillRepository.FILE_NAME}`
    );
    const [exists] = await fileRef.exists();

    // ファイルが存在しない場合は何もしない
    if (!exists) {
      return;
    }

    const backupFilePath = `${WasSkillRepository.FILE_PATH}/backups/skills`;
    const backFileName = `skill-${Date.now()}.json`;
    const backupFileRef = this.bucket.file(`${backupFilePath}/${backFileName}`);

    await fileRef.copy(backupFileRef);

    const [fileContents] = await fileRef.download();
    const storageData = JSON.parse(fileContents.toString());
    delete storageData[id];

    // 既存のファイルを上書きして保存
    await fileRef.save(JSON.stringify(storageData));
  }
}
