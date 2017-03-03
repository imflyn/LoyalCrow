window.addEventListener('load', function () {
    document.addEventListener('deviceready', onDeviceReady, false);
});
// var map = new AMap.Map('container', {
//     resizeEnable: true,
//     zoom: 10
// });
function onDeviceReady() {
    StatusBar.show();
    StatusBar.backgroundColorByHexString(theme_color_accent);
    document.addEventListener('backbutton', onBackKeyDown, false);
}
function onBackKeyDown() {
    history.go(-1);
}
function swap() {
    var input_from = document.getElementById('input_from').value;
    var input_to = document.getElementById('input_to').value;
    document.getElementById('input_from').value = input_to;
    document.getElementById('input_to').value = input_from;
}
function search() {
    var from = document.getElementById('input_from').value;
    var to = document.getElementById('input_to').value;
    var transOptions = {
        // map: map,
        city: '苏州市',
        panel: 'panel',
        policy: AMap.TransferPolicy.LEAST_TIME //乘车策略
    };
//构造公交换乘类
    var transfer = new AMap.Transfer(transOptions);
//根据起、终点名称查询公交换乘路线
    transfer.search([
        {keyword: from, city: '苏州'},
        //第一个元素city缺省时取transOptions的city属性
        {keyword: to, city: '苏州'}
        //第二个元素city缺省时取transOptions的cityd属性,
        //没有cityd属性时取city属性
    ], function (status, result) {
        setTimeout(function () {
            if (status = "complete") {
                (function () {
                    var amap_call_array = document.getElementsByClassName('amap-call');
                    for (var i = 0; i < amap_call_array.length; i++) {
                        amap_call_array[i].style.display = "none";
                    }
                })();
                (function () {
                    var clearfix = document.getElementsByClassName('clearfix');
                    for (var i = 0; i < clearfix.length; i++) {
                        clearfix[i].style.visibility = "hidden";
                        clearfix[i].style.height = "0px";
                        clearfix[i].innerHTML = "";
                    }
                })();
            }
        }, 300);
    });
}