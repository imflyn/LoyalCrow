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
var route = get_url_params()['route'];
document.getElementById('route_title').innerHTML = route + '路';
var map = new AMap.Map("container", {
    resizeEnable: true,
    zoom: 13 //地图显示的缩放级别
});
/*公交线路查询*/
function lineSearch() {
    //实例化公交线路查询类，只取回一条路线
    var linesearch = new AMap.LineSearch({
        pageIndex: 1,
        city: '苏州',
        pageSize: 1,
        extensions: 'all'
    });
    //搜索“536”相关公交线路
    linesearch.search(route + '路', function (status, result) {
        if (status === 'complete' && result.info === 'OK') {
            lineSearch_Callback(result);
        } else {
            alert(result);
        }
    });
}
/*公交路线查询服务返回数据解析概况*/
function lineSearch_Callback(data) {
    var lineArr = data.lineInfo;
    var lineNum = data.lineInfo.length;
    if (lineNum == 0) {
    } else {
        for (var i = 0; i < lineNum; i++) {
            var pathArr = lineArr[i].path;
            var stops = lineArr[i].via_stops;
            var startPot = stops[0].location;
            var endPot = stops[stops.length - 1].location;
            if (i == 0) {
                drawbusLine(startPot, endPot, pathArr);
            }
        }
    }
}
/*绘制路线*/
function drawbusLine(startPot, endPot, BusArr) {
    //绘制起点，终点
    new AMap.Marker({
        map: map,
        position: [startPot.lng, startPot.lat], //基点位置
        icon: "http://webapi.amap.com/theme/v1.3/markers/n/start.png",
        zIndex: 10
    });
    new AMap.Marker({
        map: map,
        position: [endPot.lng, endPot.lat], //基点位置
        icon: "http://webapi.amap.com/theme/v1.3/markers/n/end.png",
        zIndex: 10
    });
    //绘制乘车的路线
    busPolyline = new AMap.Polyline({
        map: map,
        path: BusArr,
        strokeColor: "#09f",//线颜色
        strokeOpacity: 0.8,//线透明度
        strokeWeight: 6//线宽
    });
    map.setFitView();
}
lineSearch();