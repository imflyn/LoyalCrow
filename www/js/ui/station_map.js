window.addEventListener('load', function () {
    document.addEventListener('deviceready', onDeviceReady, false);
});
function onDeviceReady() {
    StatusBar.show();
    StatusBar.backgroundColorByHexString(theme_color_accent);
    document.addEventListener('backbutton', onBackKeyDown, false);
}
function onBackKeyDown() {
    history.go(-1);
}
var station = get_url_params()['station'];
document.getElementById('station_title').innerHTML = station + '(公交站)';
var map = new AMap.Map("container", {
    resizeEnable: true,
    zoom: 13 //地图显示的缩放级别
});
// document.getElementsByClassName("amap-logo")[0].style.visibility = "hidden";
// document.getElementsByClassName("amap-copyright")[0].style.visibility = "hidden";
stationSearch();
/*公交站点查询*/
function stationSearch() {
    //实例化公交站点查询类
    var stationSearch = new AMap.StationSearch({
        pageIndex: 1, //页码
        pageSize: 1, //单页显示结果条数
        city: '0512'   //确定搜索城市
    });
    stationSearch.search(station + "(公交站)", function (status, result) {
        if (status === 'complete' && result.info === 'OK') {
            stationSearch_CallBack(result);
        } else {
            alert(result);
        }
    });
}
/*公交站点查询返回数据解析*/
function stationSearch_CallBack(searchResult) {
    var stationArr = searchResult.stationInfo;
    var searchNum = stationArr.length;
    if (searchNum > 0) {
        for (var i = 0; i < searchNum; i++) {
            var marker = new AMap.Marker({
                position: stationArr[i].location,
                map: map,
                title: stationArr[i].name
            });
            marker.info = new AMap.InfoWindow({
                content: stationArr[i].name,
                offset: new AMap.Pixel(0, -30)
            });
            marker.on('click', function (e) {
                e.target.info.open(map, e.target.getPosition())
            })
        }
        map.setFitView();
    }
}
