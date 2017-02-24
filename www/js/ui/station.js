window.addEventListener('load', function () {
    document.addEventListener('deviceready', onDeviceReady, false);
});
document.getElementById('station_title').innerHTML = get_url_params()['station'] + '路(公交车)';
//=============================================================================================================================================
//=============================================================================================================================================
function onDeviceReady() {
    document.addEventListener('backbutton', onBackKeyDown, false);
    document.addEventListener('searchbutton', onSearchButtonDown, false);
    StatusBar.backgroundColorByHexString(theme_color_accent);
}
function onBackKeyDown() {
    history.go(-1);
}