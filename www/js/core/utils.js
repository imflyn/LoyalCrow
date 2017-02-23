function sendGetRequest(url, callback) {
    try {
        request = new ActivexObject("Msxml2.XMLHTTP");
    }
    catch (e1) {
        try {
            request = new ActivexObject("Microsoft.XMLHTTP");
        }
        catch (e2) {
            request = false;
        }
    }
    if (!request && typeof XMLHttpRequest != 'undefined') {
        request = new XMLHttpRequest();
    }
    //通过get方式发送request请求，true表示是异步请求
    request.open("GET", url, true);
    request.onreadystatechange = callback;
    request.send();
    return request;
}
function show_loading_dialog() {
    document.getElementById('loading_dialog').style.visibility = "visible";
    document.getElementById('loading_bg').style.visibility = "visible";
}
function hide_loading_dialog() {
    document.getElementById('loading_dialog').style.visibility = "hidden";
    document.getElementById('loading_bg').style.visibility = "hidden";
}