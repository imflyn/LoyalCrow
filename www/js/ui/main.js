function isPC() {
    var userAgentInfo = navigator.userAgent;
    var Agents = ["Android", "iPhone",
        "SymbianOS", "Windows Phone",
        "iPad", "iPod"];
    var flag = true;
    for (var v = 0; v < Agents.length; v++) {
        if (userAgentInfo.indexOf(Agents[v]) > 0) {
            flag = false;
            break;
        }
    }
    return flag;
}
var search_bar = document.getElementById('search_bar');
if (isPC()) {
    search_bar.style.width = "360px";
    search_bar.style.right = "12px";
}
else {
    search_bar.style.width = screen.width + "px";
}
window.addEventListener('load', function () {
    document.addEventListener('deviceready', onDeviceReady, false);
});
var my_position = null;
//加载高德地图
var map = new AMap.Map('container', {
    resizeEnable: true,
    zoom: 10
});
document.getElementsByClassName("amap-logo")[0].style.visibility = "hidden";
document.getElementsByClassName("amap-copyright")[0].style.visibility = "hidden";
function onDeviceReady() {
    //清除之前的页面记录
    navigator.app.clearHistory();
    // function onBackKeyDown() {
    //     console.log(navigator.appName);
    // }
    // document.addEventListener('backbutton', onBackKeyDown, false);
    init_my_position();
}
var geo_location = null;
function init_my_position() {
    //加载地图，调用浏览器定位服务
    map.plugin('AMap.Geolocation', function () {
        geo_location = new AMap.Geolocation({
            enableHighAccuracy: true,//是否使用高精度定位，默认:true
            timeout: 15000,          //超过10秒后停止定位，默认：无穷大
            maximumAge: 60000,           //定位结果缓存0毫秒，默认：0
            convert: true,           //自动偏移坐标，偏移后的坐标为高德坐标，默认：true
            showButton: false,        //显示定位按钮，默认：true
            // buttonPosition: 'LB',    //定位按钮停靠位置，默认：'LB'，左下角
            // buttonOffset: new AMap.Pixel(10, 20),//定位按钮与设置的停靠位置的偏移量，默认：Pixel(10, 20)
            showMarker: true,        //定位成功后在定位到的位置显示点标记，默认：true
            showCircle: false,        //定位成功后用圆圈表示定位精度范围，默认：true
            panToLocation: false,     //定位成功后将定位到的位置作为地图中心点，默认：true
            zoomToAccuracy: false      //定位成功后调整地图视野范围使定位位置及精度范围视野内可见，默认：false
        });
        map.addControl(geo_location);
        geo_location.getCurrentPosition();
        AMap.event.addListener(geo_location, 'complete', onComplete);//返回定位信息
        AMap.event.addListener(geo_location, 'error', onError);      //返回定位出错信息
    });
    //解析定位结果
    function onComplete(data) {
        hide_loading_dialog();
        console.log("position:" + "(" + data.position.getLng() + "," + data.position.getLat() + ")");
        my_position = [data.position.getLng(), data.position.getLat()];
        map_move_to(my_position);
        draw_circle(my_position);
        search_bus_station(my_position);
    }

    //解析定位错误信息
    function onError() {
        hide_loading_dialog();
        navigator.notification.alert(
            '网络不稳定或未开启定位权限!',
            null,
            '定位失败',
            '确定'
        );
    }
}
function show_loading_dialog() {
    document.getElementById('loading_dialog').style.visibility = "visible";
    document.getElementById('loading_bg').style.visibility = "visible";
}
function hide_loading_dialog() {
    document.getElementById('loading_dialog').style.visibility = "hidden";
    document.getElementById('loading_bg').style.visibility = "hidden";
}
//移动地图
function map_move_to(lngLat) {
    map.setZoom(15);
    map.panTo(lngLat);
}
function map_move_to_my_location() {
    show_loading_dialog();
    if (geo_location == null) {
        init_my_position();
    }
    else {
        geo_location.getCurrentPosition();
    }
}
function draw_circle(lngLat) {
    var circle = new AMap.Circle({
        center: new AMap.LngLat(lngLat[0], lngLat[1]),// 圆心位置
        radius: 500, //半径
        strokeColor: "#4db6ac", //线颜色
        strokeOpacity: 0.7, //线透明度
        strokeWeight: 0.7, //线粗细度
        fillOpacity: 0,//填充透明度
        strokeStyle: "solid"
    });
    circle.setMap(map);
}
var marker_list = [];
function draw_marker(lngLat, title) {
    var marker = new AMap.Marker({
        map: map,
        position: [lngLat[0], lngLat[1]],
        clickable: true
    });
    // marker.getIcon().setSize(1);
    marker.setLabel({//label默认蓝框白底左上角显示，样式className为：amap-marker-label
        offset: new AMap.Pixel((-5.2) * title.length, -32),//修改label相对于maker的位置
        content: title
    });
    marker.on('click', function () {
    });
    marker_list.push(marker);
}
var visibility = true;
function toggle_markers_visibility() {
    visibility = !visibility;
    for (var i = 0; i < marker_list.length; i++) {
        if (visibility) {
            marker_list[i].show();
        } else {
            marker_list[i].hide();
        }
    }
}
var request = false;
function createXMLRequest() {
    try {
        request = new ActivexObject("Msxml2.XMLHTTP");
    }
    catch (e1) {
        try {
            request = new ActivexObject("Microsoft.XMLHTTP");
        }
        catch (e2) {
            request = false;
        }
    }
    if (!request && typeof XMLHttpRequest != 'undefined') {
        request = new XMLHttpRequest();
    }
}
function search_bus_station(lngLat) {
    url = "http://restapi.amap.com/v3/place/around?key=b72c9571b039d067f60280808d545520&location="
        + lngLat[0] + "," + lngLat[1] + "&output=json&radius=500&types=150700&city=0512&extensions=all&offset=100";
    //实现对时间的调用
    createXMLRequest();
    //通过get方式发送request请求，true表示是异步请求
    request.open("GET", url, true);
    request.onreadystatechange = on_get_stations;
    request.send();
}
function on_get_stations() {
    if (request.readyState == 4 && request.status == 200) {
        map.remove(marker_list);
        var nearby_stations = JSON.parse(request.responseText);
        if (nearby_stations.status == "1") {
            marker_list = [];
            visibility = true;
            for (var i = 0; i < nearby_stations.pois.length; i++) {
                var location = nearby_stations.pois[i].location.split(',');
                draw_marker([location[0], location[1]], nearby_stations.pois[i].name);
            }
        }
    }
}