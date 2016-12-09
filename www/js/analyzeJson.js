// This is a JavaScript file
function analyzeJson(jsonStr) {
    try {
        writeLog("D", "AZURE取得結果解析開始");
        if (flgCancel === true) {
            writeLog("I", "AZURE取得結果解析中止");
            flgCancel = false;
            flgRunning = false;
            return;
        }
        
        var jsonStr = jsonStr;
        var jsonObj = JSON.parse(jsonStr);
        var minLat = parseFloat(jsonObj["Results"]["area"][0]["minlatitude"]);
        var maxLat = parseFloat(jsonObj["Results"]["area"][0]["maxlatitude"]);
        var minLng = parseFloat(jsonObj["Results"]["area"][0]["minlongitude"]);
        var maxLng = parseFloat(jsonObj["Results"]["area"][0]["maxlongitude"]);
        
        var avgLat = (maxLat + minLat) / 2;
        var avgLng = (maxLng + minLng) / 2;
        writeLog("D", "AZURE取得結果 Latitude=[" + avgLat + "] Longitude=[" + avgLng + "]");
        elemCoordBoxLat.innerHTML = Math.round(avgLat * roundPow) / roundPow;
        elemCoordBoxLng.innerHTML = Math.round(avgLng * roundPow) / roundPow;
        writeLog("D", "AZURE取得結果解析終了");
        return;
    } catch (e) {
        writeLog("E", "AZURE取得結果解析内部エラー", e);
        return;
    }

}
    