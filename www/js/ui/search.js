window.addEventListener('load', function () {
    document.addEventListener('deviceready', onDeviceReady, false);
});
load_history();
//=============================================================================================================================================
//=============================================================================================================================================
function onDeviceReady() {
    document.addEventListener('backbutton', onBackKeyDown, false);
    StatusBar.backgroundColorByHexString("#4db6ac");
}
function onBackKeyDown() {
    history.go(-1);
    navigator.app.backHistory();
}
function onSearchFocused() {
    document.getElementById('img_search_black').style.visibility = "visible";
    document.getElementById('img_search_white').style.visibility = "hidden";
}
function onSearchBlured() {
    document.getElementById('img_search_black').style.visibility = "hidden";
    document.getElementById('img_search_white').style.visibility = "visible";
}
function load_history() {
    history_list = localStorage.getItem("search_history");
    if (history_list == null) {
        history_list = [];
    }
    else {
        history_list = JSON.parse(history_list);
    }
}