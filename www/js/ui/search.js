window.addEventListener('load', function () {
    document.addEventListener('deviceready', onDeviceReady, false);
});
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
    document.getElementById('btn_search_text_clear').style.visibility = 'visible'
}
function onSearchBlured() {
    document.getElementById('img_search_black').style.visibility = "hidden";
    document.getElementById('img_search_white').style.visibility = "visible";
    document.getElementById('btn_search_text_clear').style.visibility = 'hidden'
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

}
function search_text_clear() {
    document.getElementById('btn_search_text_clear').style.visibility = 'hidden'
}