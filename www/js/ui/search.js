window.addEventListener('load', function () {
    document.addEventListener('deviceready', onDeviceReady, false);
});
function onDeviceReady() {
    document.addEventListener('backbutton', onBackKeyDown, false);
}
function onBackKeyDown() {
    history.go(-1);
    navigator.app.backHistory();
}
