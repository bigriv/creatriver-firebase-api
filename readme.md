# creatriver-firebase-api

## 概要

* creatriver全般のREST APIプロジェクト
* プラットフォームをSupabaseに移管したため、本番(ネット環境)では利用しない
* ローカル(非ネット環境)での利用用途で開発を継続

## プロジェクト作成

`$ firebase init`

## ローカル起動

- `$ npm run serve`
- 起動時に ./functions/emurators/storage 配下のファイルがエミュレータのバケットにコピーされる


## デプロイ方法

$ firebase deploy --only function

## 技術スタック

- firebase-tools
- express
- TypeScript
