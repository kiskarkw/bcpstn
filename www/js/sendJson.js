// This is a JavaScript file
function sendJson(ptFlg) {
    var ptFlg = ptFlg;
    
    // 成型処理 BGN
    try {
        writeLog("D", "収集結果JSON化開始");
        if (flgCancel === true) {
            writeLog("I", "収集結果JSON化中止");
            flgCancel = false;
            flgRunning = false;
            return;
        }
        
        var requestJSON = {};
        requestJSON["Inputs"] = {};
        requestJSON["Inputs"]["input1"] = [];
        for (var i = 1; i <= Object.keys(beaconAry).length; i++) {
            requestJSON["Inputs"]["input1"].push(beaconAry[i]);
            delete requestJSON["Inputs"]["input1"][i - 1]["proximity"];
            delete requestJSON["Inputs"]["input1"][i - 1]["accuracy"];
        }
        requestJSON["GlobalParameters"] = {};
        beaconAry = {};
        writeLog("D", "収集結果JSON化終了");
    } catch (e) {
        writeLog("E", "収集結果JSON化内部エラー", e);
        return;
    }
    // 成型処理 END

    try {
        xhr = new XMLHttpRequest();
        var url = urlAzure;
        var apiKey = apikeyAzure;
        
        xhr.open("POST", url, true);
        xhr.setRequestHeader("Content-type", "application/json");
        xhr.setRequestHeader("Authorization", apiKey);
        
        xhr.timeout = xhrTimeout;
        xhr.ontimeout = function () {
            writeLog("E", "Azure通信タイムアウト");
            return;
        }; 
        
        // 後々、OnsenUIのダイアログに差し替え
        var confirmSend = confirm("Azureへのデータ通信準備が完了。データを送信?")
        if ( confirmSend === false ) {
            writeLog("D", "Azure通信中止");
            xhr.abort();
            flgCancel = false;
            flgRunning = false;
            return;
        } else {
            writeLog("D", "Azure通信開始");
            xhr.send(JSON.stringify(requestJSON));
        }
        
        xhr.onreadystatechange = function () {
            if (flgCancel === true) {
                writeLog("I", "Azure通信中止");
                this.readyState = 4;
                this.status = 403;
                flgCancel = false;
                flgRunning = false;
                return;
            }
            if (this.readyState == 4) {
                // this.status == 0は、Android版デバッガーを経由した場合に0が返るため。
                if (this.status == 200 || this.status == 0) {
                    writeLog("I", "Azure通信終了");
                    analyzeJson(this.responseText);
                    drawMap();
                    flgRunning = false;
                    return;
                } else {
                    // Azure側で一部の処理をSKIPするために、内部エラーを吐かせている。
                    // 下記レスポンスにおいて、
                    // [NOT ERROR]メッセージ[NOT ERROR]で囲んだものが該当。
                    var errorMessage = "";
                    if (this.response) {
                        var errorMessage = JSON.parse(this.response)["error"]["details"][0]["message"];
                        var errorMessage = errorMessage.split("[NOT ERROR]");
                        if  (errorMessage.length == 3 || ptFlg === "t") {
                            writeLog("I", "学習用データをDB登録、Azure通信終了");
                            flgRunning = false;
                            cancelFlg = false;
                            return;
                        }
                    }
                    writeLog("E", "Azure通信結果エラー responce=[" + this.response + "] httperror=[" + this.status + "]");
                    flgRunning = false;
                    cancelFlg = false;
                    return;
                }
            }
        }
    } catch (e) {
        writeLog("E", "Azure通信内部エラー", e);
        return;
    }
}