# github-chatwork-webhook

githubとchatworkの連携記事が思ったより少なかったので特に必要そうなものだけをまとめたもの  
github設定はGooleAppsScriptの設定が終わらないと完了出来ないため一番最後になります  
必ずreadmeの手順に従って設定すること  

## chatwork 設定

chatworkにチャットで発言させるアカウントでログイン  
「API設定」>「API Token」より発行したAPIトークンを保存  
通知するチャットのルームID(チャットURLの「#!rid」より右の数字)を保存  
発言に対するTOを指定したい場合は指定アカウントの  
「動作設定」>「アカウント情報」アカウントIDを保存  

## Google Apps Script 設定

### chatwork.gsを編集

#### ※webhookからのリクエストはdoPostの第一引数に入ってコールされるので書き換えないこと

```
const TOKEN = "APIトークン";
```

にAPIトークンを指定  

```
const ROOM_ID = "ルームID";
```

にルームIDを指定  

TOを指定する場合は  

```
const ACCOUNT_ID = "アカウントID";
```

にアカウントIDを指定  

```
var message = "[toall]" +
```

を  

```
var message = "[to:" + ACCOUNT_ID + "]" +
```

に修正  

### Google Apps Script 作成

GoogleアカウントでGoogleにログインして  
「Googleアプリ」>「ドライブ」>「新規」>「Google Apps Script」  
よりGASを作成(項目がなければその他からアプリを追加)  
「リソース」>「ライブラリ」のライブラリキー入力欄に  
`M6TcEyniCs1xb3sdXFF_FhI-MNonZQ_sT`  
と入力してChatWorkClientライブラリを追加する(もしプロジェクトを保存していなければプロジェクト名をつけて保存する必要があるので適当な名前で保存しておく)  
バージョンから最新のものを(2019/08/23時点で18)のものを選んで保存  
ChatWorkClientについては参考サイト参照  

コード.gcにchatwork.gsを貼り付けて保存  

### 公開設定

「公開」>「ウェブアプリケーションとして導入」  
プロジェクトバージョンに1を入力  
次のユーザーとしてアプリケーションを実行に自分を指定  
アプリケーションにアクセスできるユーザーに全員(匿名ユーザーを含む)を指定して導入  
アプリケーションのURLが表示されるので保存しておく  

### 初回実行時設定

初回実行時のみ承認が必要なのでアプリの承認をする  
アカウント選択画面が出たらアプリを実行するアカウント(公開設定の自分と同じ)を選択  
「このアプリは確認されていません」の画面が出たら詳細をクリックしてアプリのページに移動  
外部サービスへの接続許可を聞かれるのでそのまま許可する  

## github 設定  

プルリクエストの通知をしたいリポジトリに管理者権限を持つアカウントでログイン  
「Settings」>「Webhooks」>「Add webhook」  
Payload URLにGASで作成したアプリケーションのURLを入力  
Content typeをapplication/jsonに指定  
Secretはそのまま空欄  
Which events would you like to trigger this webhook?の項目は  
Let me select individual events.を選択して  
Pull requestsにチェックをつける。他の項目にチェックがついていたら外す  
Add webhookをクリックして完了webhookを追加出来たら完了  

githubからレビュワーを入れたプルリクエストを追加してchatworkに通知が来たらOKです  

## 参考サイト

[Google Apps ScriptでGitHubのプルリクエスト作成時に自動的にレビュアーをアサインする](https://qiita.com/n_sekiya/items/ef2f6242bf1293acd548)  
[ChatWorkClient](https://github.com/cw-shibuya/chatwork-client-gas)  
