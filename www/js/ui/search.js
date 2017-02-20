window.addEventListener('load', function () {
    document.addEventListener('deviceready', onDeviceReady, false);
});
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

// document.getElementById("input_search").focus();