// This is a JavaScript file
function drawMap() {
    try {
        writeLog("D", "地図描画開始");
        var tempLat = elemCoordBoxLat.innerHTML;
        var tempLng = elemCoordBoxLng.innerHTML;
        var latLng = new google.maps.LatLng(tempLat, tempLng);
        
        var map = new google.maps.Map(document.getElementById("elemMapCanvas"), {
            center: latLng,
            streetViewControl: false,
            mapTypeControl: false,
            disableDoubleClickZoom: false,
            zoom: 18
        });
        
        var prdMarker = new google.maps.Marker({
            position: latLng,
            draggable:false
        });
        
        var corMarker = new google.maps.Marker({
            position: latLng,
            draggable:true,
            label:"C"
        });
        
        prdMarker.setMap(map);
        corMarker.setMap(map);
        
        google.maps.event.addListener(corMarker, "drag", function(moveMarker) {
            elemCoordBoxLat.innerHTML = Math.round(moveMarker.latLng.lat() * roundPow) / roundPow;
            elemCoordBoxLng.innerHTML = Math.round(moveMarker.latLng.lng() * roundPow) / roundPow;
        });
        
        writeLog("D", "地図描画終了");
    } catch (e) {
        writeLog("E", "地図描画内部エラー", e);
        return;
    }
}