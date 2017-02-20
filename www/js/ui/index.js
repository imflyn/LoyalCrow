setTimeout(function () {
    window.location.href = 'areas/main.html';
}, 3000);
window.addEventListener('load', function () {
    document.addEventListener('deviceready', function () {
        StatusBar.hide();
    }, false);
});