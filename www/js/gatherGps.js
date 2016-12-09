// This is a JavaScript file
function gatherGps() {
    try {
        writeLog("D", "GPS測位開始");
        var options = {
            enableHighAccuracy: true,
            timeout: gpsTimeout,
            maximumAge: 0   
        };
        
        navigator.geolocation.getCurrentPosition(function(position) {
            elemCoordBoxLat.innerHTML = Math.round(position.coords.latitude * roundPow) / roundPow;
            elemCoordBoxLng.innerHTML = Math.round(position.coords.longitude * roundPow) / roundPow;
            elemCoordBoxFlr.innerHTML = position.coords.altitude;
            writeLog("D", "GPS測位終了");
            drawMap();
        }, function(e) {
            writeLog("E", "GPS測位エラー", e);
            return;
        }, options);
    } catch (e) {
        writeLog("E", "GPS測位内部エラー", e);
        return;
    }
}

