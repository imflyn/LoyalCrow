window.addEventListener('load', function () {
    document.addEventListener('deviceready', onDeviceReady, false);
});
var station = get_url_params()['station'];
document.getElementById('station_title').innerHTML = station + '(公交站)';
// load_data();
//=============================================================================================================================================
//=============================================================================================================================================
function onDeviceReady() {
    document.addEventListener('backbutton', onBackKeyDown, false);
    StatusBar.backgroundColorByHexString(theme_color_accent);
}
function onBackKeyDown() {
    history.go(-1);
}
function load_data() {
    show_loading_dialog();
    var url = HTTP_DOMAIN + "/station?name=" + station;
    var request = sendGetRequest(url, function () {
            hide_loading_dialog();
            if (request.readyState == 4 && request.status == 200) {
                handle_data(JSON.parse(request.responseText))
            }
        }
    );
}
function handle_data(station_data) {
    if (station_data == null || station_data.length == 0) {
        return;
    }
    if (station_data.length > 1) {
    } else {
    }
}