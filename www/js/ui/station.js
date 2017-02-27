window.addEventListener('load', function () {
    document.addEventListener('deviceready', onDeviceReady, false);
});
var station = get_url_params()['station'];
document.getElementById('station_title').innerHTML = station + '(公交站)';
load_station_data();
//=============================================================================================================================================
//=============================================================================================================================================
function onDeviceReady() {
    document.addEventListener('backbutton', onBackKeyDown, false);
    StatusBar.backgroundColorByHexString(theme_color_accent);
}
function onBackKeyDown() {
    history.go(-1);
}
function load_station_data() {
    show_loading_dialog();
    var url = HTTP_DOMAIN + "/station?name=" + station;
    var request = sendGetRequest(url, function () {
            if (request.readyState == 4 && request.status == 200) {
                handle_station_data(JSON.parse(request.responseText))
            }
        }
    );
}
function handle_station_data(station_data) {
    var div_tab_row = document.getElementById('div_tab_row');
    var single_tab = document.getElementById('single_tab');
    var data_list = document.getElementById('data_list');
    var ul_data_list_1 = document.getElementById('ul_data_list_1');
    var ul_data_list_2 = document.getElementById('ul_data_list_2');
    if (station_data == null || station_data.length == 0) {
        div_tab_row.style.display = "none";
        single_tab.style.display = "none";
        data_list.style.display = "none";
        return;
    }
    var station1 = station_data[0];
    if (station_data.length > 1) {
        div_tab_row.style.display = "block";
        single_tab.style.display = "none";
        data_list.style.display = "block";
        var tab1 = document.getElementById('tab1');
        var tab2 = document.getElementById('tab2');
        var tab = document.getElementById('tab');

        var station2 = station_data[1];
        tab1.innerHTML = station1.road + "(" + station1.road_direction + ")";
        tab2.innerHTML = station2.road + "(" + station2.road_direction + ")";

        load_real_time_route(0, station1.number);
        load_real_time_route(1, station2.number);
    } else {
        div_tab_row.style.display = "none";
        single_tab.style.display = "block";
        data_list.style.display = "block";

        var single_tab_text = document.getElementById('single_tab_text');
        single_tab_text.innerHTML = station1.road + "(" + station1.road_direction + ")";

        load_real_time_route(0, station1.number);
    }
}

function load_real_time_route(position, station_number) {
    var url = HTTP_DOMAIN + "/real_time_station?number=" + station_number;
    var request = sendGetRequest(url, function () {
            hide_loading_dialog();
            if (request.readyState == 4 && request.status == 200) {
                handle_real_time_data(position, JSON.parse(request.responseText));
            }
        }
    );
}

function handle_real_time_data(position, route_list) {
    var parent;
    if (position == 0) {
        parent = document.getElementById('ul_data_list_1');
        parent.innerHTML = "";
    }
    else {
        parent = document.getElementById('ul_data_list_2');
        parent.innerHTML = "";
    }
    if (route_list == null || route_list.length <= 0) {
        return;
    }
    for (var i = 0; i < route_list.length; i++) {
        var li = document.createElement("li");
        li.setAttribute("class", "waves-effect collection-item row data_list_item");

        //路线名称
        var div_round_icon = document.createElement("div");
        div_round_icon.setAttribute("class", "div_round_icon");
        var span_round_icon = document.createElement("span");
        span_round_icon.setAttribute("class", "round_icon_text");
        var route = route_list[i].route;
        if (route != null && route.indexOf('快线') >= 0) {
            route = route.replace('线', '');
            route = route.replace('号', '');
            span_round_icon.innerHTML = route;
        } else {
            span_round_icon.innerHTML = route;
        }
        div_round_icon.appendChild(span_round_icon);

        //方向
        var span_direction = document.createElement("span");
        span_direction.setAttribute("class", "station_segment text_color_primary");
        var route_direction = route_list[i].direction;
        if (route_direction != null && route_direction.indexOf('=>') < 0) {
            route_direction = '开往' + route_direction;
        }
        span_direction.innerHTML = route_direction;

        //牌照
        var div_station_license = document.createElement("div");
        div_station_license.setAttribute("class", "station_license");
        var span_station_license = document.createElement("span");
        span_station_license.setAttribute("class", "text_color_primary");
        var route_license = route_list[i].license;
        if (route_license == null || route_license.indexOf('无') >= 0) {
            span_station_license.innerHTML = '尚未开通';
        } else {
            span_station_license.innerHTML = route_license;
        }
        div_station_license.appendChild(span_station_license);

        //到站距离
        var div_station_distance = document.createElement("div");
        div_station_distance.setAttribute("class", "station_distance");
        var span_station_distance = document.createElement("span");
        span_station_distance.setAttribute("class", "text_color_primary");
        var route_distance = route_list[i].station_spacing;
        if (route_distance == null || route_distance.indexOf('无') >= 0) {
            span_station_distance.innerHTML = '';
        } else if (route_license.indexOf('进站') >= 0) {
            span_station_distance.innerHTML = '即将进站';
        } else {
            span_station_distance.innerHTML = '距离' + route_distance + '站';
        }
        div_station_distance.appendChild(span_station_distance);

        li.appendChild(div_round_icon);
        li.appendChild(span_direction);
        li.appendChild(div_station_license);
        li.appendChild(div_station_distance);

        (function (index) {
            li.onclick = function () {
                window.location.href = 'route.html?route=' + route_list[index].route;
            }
        })(i);
        parent.appendChild(li);
    }
}