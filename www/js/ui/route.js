window.addEventListener('load', function () {
    document.addEventListener('deviceready', onDeviceReady, false);
    document.addEventListener('resume', onResume, false);
    document.addEventListener('pause', onPause, false);
});
var route = get_url_params()['route'];
document.getElementById('route_title').innerHTML = route + '路';
show_loading_dialog();
load_route_data();
start_timer();
//=============================================================================================================================================
//=============================================================================================================================================
function onDeviceReady() {
    document.addEventListener('backbutton', onBackKeyDown, false);
    StatusBar.show();
    StatusBar.backgroundColorByHexString(theme_color_accent);
}
function onBackKeyDown() {
    history.go(-1);
}
function onPause() {
    if (null != timer1) {
        window.clearInterval(timer1);
        timer1 = null;
    }
}
function onResume() {
    start_timer();
}
function load_route_data() {
    var url = HTTP_DOMAIN + "/route?name=" + route;
    var request = sendGetRequest(url, function () {
            if (request.readyState == 4 && request.status == 200) {
                handle_route_data(JSON.parse(request.responseText))
            }
        }
    );
}
function handle_route_data(route_data) {
    var route_time_1 = document.getElementById('route_time_1');
    var route_interval_1 = document.getElementById('route_interval_1');
    var route_time_2 = document.getElementById('route_time_2');
    var route_interval_2 = document.getElementById('route_interval_2');
    var div_tab_row = document.getElementById('div_tab_row');
    var single_tab = document.getElementById('single_tab');
    var data_list = document.getElementById('data_list');
    var ul_data_list_1 = document.getElementById('ul_data_list_1');
    var ul_data_list_2 = document.getElementById('ul_data_list_2');
    if (route_data == null || route_data.length == 0) {
        div_tab_row.style.display = "none";
        single_tab.style.display = "none";
        data_list.style.display = "none";
        return;
    }
    var route1 = route_data[0];
    if (route_data.length > 1) {
        div_tab_row.style.display = "block";
        single_tab.style.display = "none";
        data_list.style.display = "block";
        var tab1 = document.getElementById('tab1');
        var tab2 = document.getElementById('tab2');
        var tab = document.getElementById('tab');
        var route2 = route_data[1];
        tab1.innerHTML = ("开往") + route1.end_station;
        tab1.setAttribute("class", "active");
        tab2.innerHTML = ("开往") + route2.end_station;
        tab2.setAttribute("class", "active");
        route_time_1.innerHTML = "首班车：" + route1.start_time.substring(9, route1.start_time.length - 3) + "&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp末班车：" + route1.end_time.substring(9, route1.start_time.length - 2);
        route_interval_1.innerHTML = "高峰：" + route1.peak_departure_interval + "分钟/班&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp平峰：" + route1.low_departure_interval + "/班";
        route_time_2.innerHTML = "首班车：" + route2.start_time.substring(9, route2.start_time.length - 3) + "&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp末班车：" + route2.end_time.substring(9, route2.start_time.length - 2);
        route_interval_2.innerHTML = "高峰：" + route2.peak_departure_interval + "分钟/班&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp平峰：" + route2.low_departure_interval + "/班";
        load_real_time_route(0, route1.number, route1.GUID);
        load_real_time_route(1, route2.number, route2.GUID);
    } else {
        div_tab_row.style.display = "none";
        single_tab.style.display = "block";
        data_list.style.display = "block";
        var single_tab_text = document.getElementById('single_tab_text');
        single_tab_text.innerHTML = ("开往") + route1.end_station;
        route_time_1.innerHTML = "首班车：" + route1.start_time.substring(9, route1.start_time.length - 3) + "&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp末班车：" + route1.end_time.substring(9, route1.start_time.length - 3);
        route_interval_1.innerHTML = "高峰：" + route1.peak_departure_interval + "/班&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp平峰：" + route1.low_departure_interval + "/班";
        load_real_time_route(0, route1.number);
    }
}
function load_real_time_route(position, route_number, route_id) {
    var url = HTTP_DOMAIN + "/real_time_route?route=" + route_number + "&id=" + route_id;
    var request = sendGetRequest(url, function () {
            hide_loading_dialog();
            if (request.readyState == 4 && request.status == 200) {
                handle_real_time_data(position, JSON.parse(request.responseText));
            }
        }
    );
}
function handle_real_time_data(position, station_list) {
    var parent;
    if (position == 0) {
        parent = document.getElementsByClassName('collection data_list')[0];
        parent.innerHTML = "";
    }
    else {
        parent = document.getElementsByClassName('collection data_list')[1];
        parent.innerHTML = "";
    }
    if (station_list == null || station_list.length <= 0) {
        return;
    }
    for (var i = 0; i < station_list.length; i++) {
        var li = document.createElement("li");
        li.setAttribute("class", "waves-effect collection-item row data_list_item");
        //路线名称
        var div_round_icon = document.createElement("div");
        div_round_icon.setAttribute("class", "div_round_icon");
        var span_round_icon = document.createElement("span");
        span_round_icon.setAttribute("class", "round_icon_text");
        var station_name = station_list[i].station;
        span_round_icon.innerHTML = i + 1;
        div_round_icon.appendChild(span_round_icon);
        //站台名
        var span_direction = document.createElement("span");
        span_direction.setAttribute("class", "route_segment text_color_primary");
        span_direction.innerHTML = station_name;
        //牌照
        var div_route_license = document.createElement("div");
        div_route_license.setAttribute("class", "route_license");
        var span_route_license = document.createElement("span");
        span_route_license.setAttribute("class", "text_color_primary");
        var license = station_list[i].license;
        if (license != null && license.length > 0) {
            span_route_license.innerHTML = license;
        }
        div_route_license.appendChild(span_route_license);
        li.appendChild(div_round_icon);
        li.appendChild(span_direction);
        li.appendChild(div_route_license);
        (function (index, station_name) {
            li.onclick = function () {
                window.location.href = 'station.html?station=' + station_name;
            }
        })(i, station_name);
        parent.appendChild(li);
    }
}
var timer1;
function start_timer() {
    if (null != timer1) {
        window.clearInterval(timer1);
    }
    timer1 = window.setInterval(load_route_data, 60000);//1000为1秒钟
}
function turnToRouteMap() {
    window.location.href = 'route_map.html?route=' + station;
}