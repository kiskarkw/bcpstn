// This is a JavaScript file
function dateToYmdhms(date) {
    var date = new Date();
    var tempDate = date.getFullYear().toString()
        + ("00" + (date.getMonth() + 1)).slice(-2)
        + ("00" + date.getDate()).slice(-2)
        + ("00" + date.getHours()).slice(-2)
        + ("00" + date.getMinutes()).slice(-2)
        + ("00" + date.getSeconds()).slice(-2)
        + ("000" + date.getMilliseconds()).slice(-3)
    ;
    return tempDate;
}

function writeLog(logLevel, message, errorObject){
    try {        
        var logLevel = logLevel;
        var message = message;
        if (errorObject) { 
            var errorObject = errorObject;
        }
        var date = dateToYmdhms();
        
        if (typeof message !== "string") {
            alert("writeLog function aborted from Parameter Error.");
            return;
        } else {
            var logAry = new Array();
            logAry[0] = date;
            logAry[1] = logLevel;
            logAry[2] = message;
            if (typeof errorObject === "object") {
                logAry[3] = "[errorMessage]" + errorObject.message;
                logAry[4] = "[errorStack]" + errorObject.stack;
                flgCancel = false;
                flgRunning = false;
            }
            if (logLevel === "E") {
                flgCancel = false;
                flgRunning = false;
            }
            if (elemLog.innerHTML.length > maxLogChrCnt) {
                elemLog.innerHTML = elemLog.innerHTML.substring(0, elemLog.innerHTML.length - maxLogChrCnt);
            };
            elemLog.innerHTML = logAry.join(", ") + "<BR>" + elemLog.innerHTML;
        }
    } catch (e) {
        alert("writeLog function aborted from Internal Error. " + e.massage);
        flgCancel = false;
        flgRunning = false;
    }
}
