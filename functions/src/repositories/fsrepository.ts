import { Bucket } from "@google-cloud/storage";
import { JsonUtils, KeyValue } from "@/utils/json";
import { FirebaseStorageModel } from "@/formats/fsmodel";

export interface FirebaseStorageRepositoryIf<T extends FirebaseStorageModel> {
  findAll(): Promise<KeyValue<T>>;
  save(data: T): Promise<void>;
  saveAll(data: Record<string, T>): Promise<void>;
  deleteByKey(key: string): Promise<void>;
}

export class FirebaseStorageRepositoryBuilder {
  private constructor() {}

  /**
   * リポジトリクラスを生成する
   *
   * @param {Bucket} bucket Firebase StorageのBucket
   * @param {string} fileName 操作を行うファイルの名前(拡張子なし)
   * @param {string} filePath 操作を行うファイルが配置されるディレクトリのパス
   * @param {string} backupPath バックアップファイルを配するディレクトリのパス
   * @returns {FirebaseStorageRepositoryIf} Firebase StorageにアクセスするRepositoryクラス
   */
  static build<T extends FirebaseStorageModel>(
    bucket: Bucket,
    fileName: string,
    filePath: string,
    backupPath: string
  ): FirebaseStorageRepositoryIf<T> {
    return new Proxy(
      {} as FirebaseStorageRepositoryIf<T>,
      this.createProxyHandler<T>(bucket, fileName, filePath, backupPath)
    ) as FirebaseStorageRepositoryIf<T>;
  }

  /**
   * リポジトリクラスのプロキシハンドラを生成する
   *
   * @param {Bucket} bucket Firebase StorageのBucket
   * @param {string} fileName 操作を行うファイルの名前(拡張子なし)
   * @param {string} filePath 操作を行うファイルが配置されるディレクトリのパス
   * @param {string} backupPath バックアップファイルを配するディレクトリのパス
   * @returns {ProxyHandler} プロキシハンドラ
   */
  private static createProxyHandler<T extends FirebaseStorageModel>(
    bucket: Bucket,
    fileName: string,
    filePath: string,
    backupPath: string
  ): ProxyHandler<FirebaseStorageRepositoryIf<T>> {
    const methods = {
      findAll: () => this.findAll<T>(bucket, fileName, filePath),
      save: (data: T) =>
        this.save(bucket, fileName, filePath, backupPath, data),
      saveAll: (data: Record<string, T>) =>
        this.saveAll(bucket, fileName, filePath, backupPath, data),
      deleteByKey: (id: string) =>
        this.deleteByKey(bucket, fileName, filePath, backupPath, id),
    };

    return {
      get(_, propKey) {
        // 対応するメソッドがあればそれを返す
        return methods[propKey as keyof typeof methods];
      },
    };
  }

  /**
   * Firebase Storageからkey-value形式のデータを取得する
   *
   * @param {Bucket} bucket Firebase StorageのBucket
   * @param {string} fileName 操作を行うファイルの名前(拡張子なし)
   * @param {string} filePath 操作を行うファイルが配置されるディレクトリのパス
   * @returns {KeyValue} key-value形式のデータ
   */
  private static async findAll<T>(
    bucket: Bucket,
    fileName: string,
    filePath: string
  ): Promise<KeyValue<T>> {
    const fileRef = bucket.file(`${filePath}/${fileName}.json`);
    const [exists] = await fileRef.exists();

    if (!exists) {
      return {};
    }
    const [fileContents] = await fileRef.download();
    const json = JSON.parse(fileContents.toString());

    if (!JsonUtils.isKeyValue(json)) {
      throw new Error("File is broken. There was not key-value format.");
    }

    return json;
  }

  /**
   * ファイルにデータを追加・更新して保存する
   *
   * @param {Bucket} bucket Firebase StorageのBucket
   * @param {string} fileName 操作を行うファイルの名前(拡張子なし)
   * @param {string} filePath 操作を行うファイルが配置されるディレクトリのパス
   * @param {string} backupPath バックアップファイルを配するディレクトリのパス
   * @param {FirebaseStorageModel} data 追加するデータ
   */
  private static async saveAll<T extends FirebaseStorageModel>(
    bucket: Bucket,
    fileName: string,
    filePath: string,
    backupPath: string,
    data: Record<string, T>
  ): Promise<void> {
    const fileRef = bucket.file(`${filePath}/${fileName}.json`);
    const [exists] = await fileRef.exists();

    // ファイルが既に存在する場合はバックアップを作成する
    if (exists) {
      const backFileName = `${fileName}-${Date.now()}.json`;
      const backupFileRef = bucket.file(`${backupPath}/${backFileName}`);

      await fileRef.copy(backupFileRef);
    }

    // ファイルを保存
    await fileRef.save(JSON.stringify(data));
  }

  /**
   * ファイルを完全上書きで保存する
   *
   * @param {Bucket} bucket Firebase StorageのBucket
   * @param {string} fileName 操作を行うファイルの名前(拡張子なし)
   * @param {string} filePath 操作を行うファイルが配置されるディレクトリのパス
   * @param {string} backupPath バックアップファイルを配するディレクトリのパス
   * @param {FirebaseStorageModel} data 追加するデータ
   */
  private static async save<T extends FirebaseStorageModel>(
    bucket: Bucket,
    fileName: string,
    filePath: string,
    backupPath: string,
    data: T
  ): Promise<void> {
    const fileRef = bucket.file(`${filePath}/${fileName}.json`);
    const [exists] = await fileRef.exists();

    let putData = { [`${data.id}`]: JsonUtils.copy(data) };
    // ファイルが既に存在する場合はバックアップを作成する
    if (exists) {
      const backFileName = `${fileName}-${Date.now()}.json`;
      const backupFileRef = bucket.file(`${backupPath}/${backFileName}`);

      await fileRef.copy(backupFileRef);

      const [fileContents] = await fileRef.download();
      const storageData = JSON.parse(fileContents.toString());
      putData = Object.assign(storageData, putData);
    }

    // 既存のファイルと結合して保存
    await fileRef.save(JSON.stringify(putData));
  }

  /**
   * 指定したキーのデータを削除する
   *
   * @param {Bucket} bucket Firebase StorageのBucket
   * @param {string} fileName 操作を行うファイルの名前(拡張子なし)
   * @param {string} filePath 操作を行うファイルが配置されるディレクトリのパス
   * @param {string} backupPath バックアップファイルを配するディレクトリのパス
   * @param {string} key 削除するデータのキー
   */
  private static async deleteByKey(
    bucket: Bucket,
    fileName: string,
    filePath: string,
    backupPath: string,
    key: string
  ): Promise<void> {
    const fileRef = bucket.file(`${filePath}/${fileName}.json`);
    const [exists] = await fileRef.exists();

    // ファイルが存在しない場合は何もしない
    if (!exists) {
      return;
    }

    const backFileName = `${fileName}-${Date.now()}.json`;
    const backupFileRef = bucket.file(`${backupPath}/${backFileName}`);

    await fileRef.copy(backupFileRef);

    const [fileContents] = await fileRef.download();
    const storageData = JSON.parse(fileContents.toString());
    delete storageData[key];

    // 既存のファイルを上書きして保存
    await fileRef.save(JSON.stringify(storageData));
  }
}
