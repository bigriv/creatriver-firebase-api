import { Bucket } from "@google-cloud/storage";
import fs = require("fs");
import path = require("path");

/**
 * ローカルのfirebase storageを初期化する
 * @param bucket バケット
 */
export async function initLocalStorage(bucket: Bucket) {
  const localDirPath = "./emurators/storage";
  const bucketDirPath = "";

  await uploadDirectory(bucket, localDirPath, bucketDirPath);
}

/**
 * ローカルディレクトリの内容をfirebase storageコピーする
 * @param bucket コピー先の対象のバケット
 * @param localDirPath コピー元となるローカルディレクトリ
 * @param bucketDirPath コピー先となるバケットのディレクトリ
 */
async function uploadDirectory(
  bucket: Bucket,
  localDirPath: string,
  bucketDirPath: string
) {
  const files = fs.readdirSync(localDirPath);

  for (const file of files) {
    const localFilePath = path.join(localDirPath, file);
    const destinationPath = path.join(bucketDirPath, file).replace(/\\/g, "/");

    if (fs.statSync(localFilePath).isDirectory()) {
      // ディレクトリの場合、再帰的にアップロード
      if (/.*\\backups$/.test(localFilePath)) {
        // バックアップディレクトリはアップロード対象外とする
        continue;
      }
      await uploadDirectory(bucket, localFilePath, destinationPath);
    } else {
      // ファイルをアップロード
      await bucket.upload(localFilePath, {
        destination: destinationPath,
      });
      console.log(`Uploaded ${localFilePath} to ${destinationPath}`);
    }
  }
}
