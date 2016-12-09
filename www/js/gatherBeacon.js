// This is a JavaScript file
function gatherBeacon(ptFlg) {
    try {
        
        if (flgRunning === true) {
            writeLog("D", "処理実行中のため、操作無効");
            return;
        } else {
            flgRunning = true;
            flgCancel = false;
            beaconAry = {};
        }

        var ptFlg = ptFlg;
        if (ptFlg === "p") {
            writeLog("D", "予測用BEACON電波収集開始");
        } else if (ptFlg === "t") {
            writeLog("D", "学習用BEACON電波収集開始");
        } else {
            throw new Error("BEACON電波収集パラメーターエラー");
            return;
        }

        var msecLimit = (elemCfgMsec.value) * 1000;
        var tempLat = elemCoordBoxLat.innerHTML;
        var tempLng = elemCoordBoxLng.innerHTML;
        var timeBgn = new Date();
        var totalGatheredCnt = 0;

        var beaconRegions = [];
        for (var i in beacons) {
            beaconRegions[beacons[i].identifier] =
                new cordova.plugins.locationManager.BeaconRegion(beacons[i].identifier, beacons[i].uuid);
        }

        var delegate = new cordova.plugins.locationManager.Delegate();

        delegate.didRangeBeaconsInRegion = function(pluginResult) {
            // beaconAryに成型格納
            var beaconAryCnt = Object.keys(beaconAry).length;
            var gatheredCnt = Object.keys(pluginResult["beacons"]).length
            totalGatheredCnt = totalGatheredCnt + gatheredCnt;
            for (var i = 1; i <= gatheredCnt; i++) {
                beaconAry[beaconAryCnt + i] = {};
                beaconAry[beaconAryCnt + i] = pluginResult["beacons"][i - 1];
                beaconAry[beaconAryCnt + i]["ptflg"] = ptFlg;
                beaconAry[beaconAryCnt + i]["ymdhms"] = dateToYmdhms();
                beaconAry[beaconAryCnt + i]["deviceid"] = deviceId;
                beaconAry[beaconAryCnt + i]["latitude"] = tempLat;
                beaconAry[beaconAryCnt + i]["longitude"] = tempLng;
                // []区切でログ出力。
                var line = '';
                for (var key in beaconAry[beaconAryCnt + i]) {
                    if (line !== '') { line += ''; }
                    line += '[' + beaconAry[beaconAryCnt + i][key] + ']';
                }
                writeLog("I", "BEACON検知 [" + line + "]");
            }
        };
        cordova.plugins.locationManager.setDelegate(delegate);
    } catch (e) {
        writeLog("E", "BEACON収集準備エラー", e);
        return;
    }

    // Beacon受信起動
    for (var i in beaconRegions) {
        cordova.plugins.locationManager.startRangingBeaconsInRegion(beaconRegions[i])
            .fail(function(e) {
                writeLog("E", "BEACON収集起動エラー", e);
                return;
            })
            .done();
    }

    // 規定時間経過後の停止処理
    var timer = setInterval(function() {
        if (flgCancel === true) {
            writeLog("I", "BEACON電波収集処理中止");
            killBeaconRegions(beaconRegions);
            flgRunning = false;
            clearInterval(timer);
        } else if (new Date() - timeBgn > msecLimit) {
            killBeaconRegions(beaconRegions);
            if (totalGatheredCnt > 0) {
                writeLog("D", "BEACON電波収集終了");
                clearInterval(timer);
                var tempResult = sendJson(ptFlg);
            } else {
                writeLog("W", "BEACON電波検知無し");
                flgRunning = false;
                clearInterval(timer);
            }
        }
    }, msecInterval);
}

// 規定時間経過後の停止処理のサブファンクション
function killBeaconRegions(beaconRegions) {
    for (var i in beaconRegions) {
        cordova.plugins.locationManager.stopRangingBeaconsInRegion(beaconRegions[i])
            .fail(function(e) {
                writeLog("E", "BEACON収集終了エラー", e);
                return;
            })
            .done();
    }
}
