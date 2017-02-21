window.addEventListener('load', function () {
    document.addEventListener('deviceready', onDeviceReady, false);
});
document.getElementById('input_search').style.width = (screen.width - 70) + "px";
load_history();
//=============================================================================================================================================
//=============================================================================================================================================
function onDeviceReady() {
    document.addEventListener('backbutton', onBackKeyDown, false);
    StatusBar.backgroundColorByHexString(theme_color_accent);
}
function onBackKeyDown() {
    history.go(-1);
    navigator.app.backHistory();
}
function onSearchFocused() {
    document.getElementById('img_search_black').style.visibility = "visible";
    document.getElementById('img_search_white').style.visibility = "hidden";
    document.getElementById('btn_search_text_clear').style.visibility = 'visible';
}
function onSearchBlured() {
    document.getElementById('img_search_black').style.visibility = "hidden";
    document.getElementById('img_search_white').style.visibility = "visible";
    document.getElementById('btn_search_text_clear').style.visibility = 'hidden';
}
function load_history() {
    browse_list = localStorage.getItem("browse_history");
    if (browse_list == null) {
        browse_list = [];
    }
    else {
        browse_list = JSON.parse(browse_list);
    }
}
function search() {
    var text = document.getElementById('input_search').value;
    var city = sessionStorage.getItem('city');
    var url = "http://restapi.amap.com/v3/assistant/inputtips?key=b72c9571b039d067f60280808d545520&keywords=" +
        text + "&city=" + city + "&citylimit=true&datatype=all&output=JSON";
    var request = sendGetRequest(url, function () {
        if (request.readyState == 4 && request.status == 200) {

        }
    });
}
function search_text_clear() {
    document.getElementById('btn_search_text_clear').style.visibility = 'hidden'
}