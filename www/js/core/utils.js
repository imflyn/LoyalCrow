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