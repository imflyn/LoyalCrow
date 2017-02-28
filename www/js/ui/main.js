window.addEventListener('load', function () {
    document.addEventListener('deviceready', onDeviceReady, false);
});
var my_position = null;
//加载高德地图
var map = new AMap.Map('container', {
    resizeEnable: true,
    zoom: 10
});
map.on('complete', function () {
    my_position = sessionStorage.getItem('my_position');
    var citycode = sessionStorage.getItem('citycode');
    if (my_position == null) {
        show_loading_dialog();
        init_my_position();
    }
    else {
        my_position = my_position.split(',');
        onGetCurrentPosition(my_position, citycode);
    }
});
map.on('moveend', function () {
    document.getElementsByClassName("amap-toolbar")[0].style.visibility = "hidden";
    draw_center_marker([map.getCenter().lng, map.getCenter().lat]);
    search_bus_station([map.getCenter().lng, map.getCenter().lat]);
});
document.getElementsByClassName("amap-logo")[0].style.visibility = "hidden";
document.getElementsByClassName("amap-copyright")[0].style.visibility = "hidden";
function onDeviceReady() {
    //清除之前的页面记录
    navigator.app.clearHistory();
    StatusBar.show();
    StatusBar.backgroundColorByHexString(theme_color_accent);
}
var geo_location = null;
var getting_location = false;
function init_my_position() {
    //加载地图，调用浏览器定位服务
    getting_location = true;
    map.plugin('AMap.Geolocation', function () {
        geo_location = new AMap.Geolocation({
            enableHighAccuracy: true,//是否使用高精度定位，默认:true
            timeout: 15000,          //超过10秒后停止定位，默认：无穷大
            maximumAge: 60000,           //定位结果缓存0毫秒，默认：0
            convert: true,           //自动偏移坐标，偏移后的坐标为高德坐标，默认：true
            showButton: false,        //显示定位按钮，默认：true
            // buttonPosition: 'LB',    //定位按钮停靠位置，默认：'LB'，左下角
            // buttonOffset: new AMap.Pixel(10, 20),//定位按钮与设置的停靠位置的偏移量，默认：Pixel(10, 20)
            showMarker: false,        //定位成功后在定位到的位置显示点标记，默认：true
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
        console.log("position:" + "(" + data.position.getLng() + "," + data.position.getLat() + ")");
        my_position = [data.position.getLng(), data.position.getLat()];
        sessionStorage.setItem('my_position', my_position);
        sessionStorage.setItem('citycode', data.addressComponent.citycode);
        hide_loading_dialog();
        onGetCurrentPosition(my_position, data.addressComponent.citycode);
    }

    //解析定位错误信息
    function onError() {
        getting_location = false;
        hide_loading_dialog();
        navigator.notification.alert(
            '网络不稳定或未开启定位权限!',
            null,
            '定位失败',
            '确定'
        );
    }
}
function onGetCurrentPosition(lngLat, citycode) {
    getting_location = false;
    map_move_to(lngLat);
    draw_circle(lngLat);
    draw_my_position_marker(lngLat);
    draw_center_marker(lngLat);
    search_bus_station(lngLat, citycode);
}
//移动地图
function map_move_to(lngLat) {
    map.setZoom(15);
    map.panTo(lngLat);
}
function map_move_to_my_location() {
    if (getting_location) {
        console.log('正在定位中...');
        return;
    }
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
        strokeColor: theme_color_accent, //线颜色
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
    marker.setLabel({//label默认蓝框白底左上角显示，样式className为：amap-marker-label
        offset: new AMap.Pixel((-5.2) * title.length, -32),//修改label相对于maker的位置
        content: title
    });
    marker.on('click', function () {
        if (title.indexOf('(公交站)') >= 0) {
            title = title.replace('(公交站)', '');
        }
        var browse_list = JSON.parse(localStorage.getItem('browse_history'));
        for (var i = 0; i < browse_list.length; i++) {
            if (browse_list[i].name == title) {
                window.location.href = 'station.html?station=' + title;
                return;
            }
        }
        browse_list.unshift(new Object({
            name: title,
            type: "0001"
        }));
        if (browse_list.length > 10) {
            browse_list.pop();
        }
        localStorage.setItem('browse_history', JSON.stringify(browse_list));
        window.location.href = 'station.html?station=' + title;
    });
    marker_list.push(marker);
}
var center_marker;
function draw_center_marker(lngLat) {
    if (null != center_marker) {
        center_marker.setMap(null);
    }
    center_marker = new AMap.Marker({
        map: map,
        position: [lngLat[0], lngLat[1]],
        content: '<div class=\"marker\"></div>'
    });
    if (lngLat[0] == my_position[0] && lngLat[1] == my_position[1]) {
        center_marker.setOffset(new AMap.Pixel(-16, -16));
    }
}
var my_position_marker;
function draw_my_position_marker(lngLat) {
    if (null != my_position_marker) {
        my_position_marker.setMap(null);
    }
    my_position_marker = new AMap.Marker({
        map: map,
        position: [lngLat[0], lngLat[1]],
        icon: new AMap.Icon({
            size: new AMap.Size(36, 36),  //图标大小
            image: "http://webapi.amap.com/theme/v1.3/markers/n/loc.png",
            imageOffset: new AMap.Pixel(-3, 14)
        })
    });
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
function search_bus_station(lngLat, citycode) {
    var url = "http://restapi.amap.com/v3/place/around?key=b72c9571b039d067f60280808d545520&location="
        + lngLat[0] + "," + lngLat[1] + "&output=json&radius=500&types=150700&city=" + citycode + "&extensions=all&offset=100";
    var request = sendGetRequest(url, function () {
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
    });
}
function go_to_search() {
    window.location.href = 'search.html';
}