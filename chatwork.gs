// github webhook API payload のjsonデータについては以下のサイト参照
// https://developer.github.com/v3/activity/events/types/#pullrequestevent

function doPost(request) {
    // チャットワークAPIトークン
    const TOKEN = "APIトークン";
    // ルームID
    const ROOM_ID = "ルームID";
    // アカウントID
    const ACCOUNT_ID = "アカウントID";
    try {
        var client = ChatWorkClient.factory({token: TOKEN});

        var jsonData = JSON.parse(request.postData.getDataAsString());
 
        // レビュワー指定プルリクエストのみ処理
        if (jsonData["action"] != "review_requested") {
            return;
        }
    
        // タイトル
        var title = jsonData["pull_request"]["title"];
        // プルリクエスト番号
        var requestNumber = jsonData["pull_request"]["number"];
        // URL
        var url = jsonData["pull_request"]["html_url"];
        // 作成者
        var sender = jsonData["pull_request"]["user"]["login"];
        // レビュワー
        var reviewers = jsonData["pull_request"]["requested_reviewers"];
        var reviewer = "";
        for (var i = 0; i < reviewers.length; i++) {
            reviewer += reviewers[i]["login"];
            if (i != reviewers.length - 1) {
                reviewer += ", ";
            }
        }
        // 説明
        var body = jsonData["pull_request"]["body"];
        
        var message = "[toall]" +
        "[info]" +
            "[title]" + "pull request by " + sender + "[/title]" +
            "#" + requestNumber + " " + title + "\n" +
                url + "\n\n" + 
                body + "\n\n" +
                    "please review " + reviewer + 
                "[/info]";
        // メッセージ送信
        client.sendMessage({room_id: ROOM_ID, body: message});
    }
    catch(e) {
        Logger.log(e.message);
        client.sendMessage({room_id: ROOM_ID, body: e.message});
    }
}