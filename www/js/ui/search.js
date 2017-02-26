window.addEventListener('load', function () {
    document.addEventListener('deviceready', onDeviceReady, false);
});
document.getElementById('input_search').style.width = (screen.width - 88) + "px";
var browse_list = [];
load_data();
//=============================================================================================================================================
//=============================================================================================================================================
function onDeviceReady() {
    document.addEventListener('backbutton', onBackKeyDown, false);
    document.addEventListener('searchbutton', onSearchButtonDown, false);
    StatusBar.backgroundColorByHexString(theme_color_accent);
}
function onBackKeyDown() {
    history.go(-1);
}
function onSearchButtonDown() {
    search();
}
function onSearchFocused() {
    document.getElementById('img_search_black').style.visibility = "visible";
    document.getElementById('img_search_white').style.visibility = "hidden";
    document.getElementById('img_clear_black').style.visibility = "visible";
    document.getElementById('img_clear_white').style.visibility = "hidden";
}
function onSearchBlured() {
    document.getElementById('img_search_black').style.visibility = "hidden";
    document.getElementById('img_search_white').style.visibility = "visible";
    document.getElementById('img_clear_black').style.visibility = "hidden";
    document.getElementById('img_clear_white').style.visibility = "hidden";
}
function load_data() {
    var text = document.getElementById('input_search').value;
    var browse_list_json = localStorage.getItem("browse_history");
    if (browse_list_json != null) {
        browse_list = JSON.parse(browse_list_json);
    }
    var storage_history_json = sessionStorage.getItem('search_result_list');
    if (text.length > 0 && storage_history_json != null && storage_history_json.length != 0) {
        document.getElementById('img_clear_black').style.visibility = "hidden";
        document.getElementById('img_clear_white').style.visibility = "visible";
        document.getElementById('search_result').style.visibility = 'visible';
        document.getElementById('browse_history').style.visibility = 'hidden';
        handleSearchData(storage_history_json)
    }
    else {
        handleHistoryData(browse_list);
    }
}
function search() {
    var text = document.getElementById('input_search').value;
    if (text.length == 0) {
        document.getElementById('img_clear_black').style.visibility = "hidden";
        document.getElementById('img_clear_white').style.visibility = "hidden";
        document.getElementById('search_result').style.visibility = 'hidden';
        document.getElementById('browse_history').style.visibility = 'visible';
        sessionStorage.setItem('search_result_list', '');
        handleHistoryData(JSON.parse(localStorage.getItem("browse_history")));
        return;
    }
    document.getElementById('img_clear_black').style.visibility = "visible";
    document.getElementById('img_clear_white').style.visibility = "hidden";
    document.getElementById('search_result').style.visibility = 'visible';
    document.getElementById('browse_history').style.visibility = 'hidden';
    show_loading_dialog();
    var url = HTTP_DOMAIN + "/search?keyword=" + text;
    var request = sendGetRequest(url, function () {
            hide_loading_dialog();
            if (request.readyState == 4 && request.status == 200) {
                sessionStorage.setItem('search_result_list', request.responseText);
                handleSearchData(request.responseText)
            } else {
                var myjson = "[{\"name\":\"522\",\"type\":\"0002\"},{\"name\":\"822\",\"type\":\"0002\"},{\"name\":\"922\",\"type\":\"0002\"},{\"name\":\"228\",\"type\":\"0002\"},{\"name\":\"322\",\"type\":\"0002\"},{\"name\":\"622\",\"type\":\"0002\"},{\"name\":\"华元路227省道西\",\"type\":\"0001\"},{\"name\":\"522\",\"type\":\"0002\"},{\"name\":\"822\",\"type\":\"0002\"},{\"name\":\"922\",\"type\":\"0002\"},{\"name\":\"228\",\"type\":\"0002\"},{\"name\":\"322\",\"type\":\"0002\"},{\"name\":\"622\",\"type\":\"0002\"},{\"name\":\"独墅苑\",\"type\":\"0001\"},{\"name\":\"522\",\"type\":\"0002\"},{\"name\":\"822\",\"type\":\"0002\"},{\"name\":\"922\",\"type\":\"0002\"},{\"name\":\"228\",\"type\":\"0002\"},{\"name\":\"322\",\"type\":\"0002\"},{\"name\":\"622\",\"type\":\"0002\"},{\"name\":\"华元路227省道西\",\"type\":\"0001\"},{\"name\":\"522\",\"type\":\"0002\"},{\"name\":\"822\",\"type\":\"0002\"},{\"name\":\"922\",\"type\":\"0002\"},{\"name\":\"228\",\"type\":\"0002\"},{\"name\":\"322\",\"type\":\"0002\"},{\"name\":\"622\",\"type\":\"0002\"},{\"name\":\"华元路227省道西\",\"type\":\"0001\"},{\"name\":\"522\",\"type\":\"0002\"},{\"name\":\"822\",\"type\":\"0002\"},{\"name\":\"922\",\"type\":\"0002\"},{\"name\":\"228\",\"type\":\"0002\"},{\"name\":\"322\",\"type\":\"0002\"},{\"name\":\"622\",\"type\":\"0002\"},{\"name\":\"华元路227省道西\",\"type\":\"0001\"},{\"name\":\"522\",\"type\":\"0002\"},{\"name\":\"822\",\"type\":\"0002\"},{\"name\":\"922\",\"type\":\"0002\"},{\"name\":\"228\",\"type\":\"0002\"},{\"name\":\"322\",\"type\":\"0002\"},{\"name\":\"622\",\"type\":\"0002\"},{\"name\":\"华元路227省道西\",\"type\":\"0001\"},{\"name\":\"522\",\"type\":\"0002\"},{\"name\":\"822\",\"type\":\"0002\"},{\"name\":\"922\",\"type\":\"0002\"},{\"name\":\"228\",\"type\":\"0002\"},{\"name\":\"322\",\"type\":\"0002\"},{\"name\":\"622\",\"type\":\"0002\"},{\"name\":\"华元路227省道西\",\"type\":\"0001\"}]";
                sessionStorage.setItem('search_result_list', myjson);
                handleSearchData(myjson);
                // var parent = document.getElementById('ul_search_result');
                // parent.innerHTML = "";
            }
        }
    );
}
function handleSearchData(result_json) {
    var result_list = JSON.parse(result_json);
    var parent = document.getElementById('ul_search_result');
    parent.innerHTML = "";
    for (var i = 0; i < result_list.length; i++) {
        var li = document.createElement("li");
        li.setAttribute("class", "waves-effect collection-item browse_list_collection_item");
        (function (index) {
            li.onclick = function () {
                if (result_list[index].type == "0001") {
                    turnToStation(result_list[index].name)
                }
                else {
                    turnToRoute(result_list[index].name)
                }
            };
        })(i);
        var img = document.createElement("img");
        if (result_list[i].type == "0001") {
            img.setAttribute("src", "../img/ic_station.png");
        } else if (result_list[i].type == "0002") {
            img.setAttribute("src", "../img/ic_bus.png");
        }
        img.setAttribute("alt", "");
        img.setAttribute("class", "circle collection_icon");
        var span = document.createElement("span");
        span.setAttribute("class", "ext_color_primary");
        if (result_list[i].type == "0001") {
            span.innerHTML = result_list[i].name + "(公交站)";
        } else if (result_list[i].type == "0002") {
            span.innerHTML = result_list[i].name + "路";
        }
        li.appendChild(img);
        li.appendChild(span);
        parent.appendChild(li);
    }
}
function handleHistoryData(result_list) {
    var parent = document.getElementById('ul_history_result');
    parent.innerHTML = "";
    for (var i = 0; i < result_list.length; i++) {
        var li = document.createElement("li");
        li.setAttribute("class", "waves-effect collection-item browse_list_collection_item");
        (function (index) {
            li.onclick = function () {
                if (result_list[index].type == "0001") {
                    turnToStation(result_list[index].name)
                }
                else {
                    turnToRoute(result_list[index].name)
                }
            };
        })(i);
        var img = document.createElement("img");
        if (result_list[i].type == "0001") {
            img.setAttribute("src", "../img/ic_station.png");
        } else if (result_list[i].type == "0002") {
            img.setAttribute("src", "../img/ic_bus.png");
        }
        img.setAttribute("alt", "");
        img.setAttribute("class", "circle collection_icon");
        var span = document.createElement("span");
        span.setAttribute("class", "ext_color_primary");
        if (result_list[i].type == "0001") {
            span.innerHTML = result_list[i].name + "(公交站)";
        } else if (result_list[i].type == "0002") {
            span.innerHTML = result_list[i].name + "路";
        }
        li.appendChild(img);
        li.appendChild(span);
        parent.appendChild(li);
    }
}
function onTextClearClick() {
    document.getElementById('input_search').value = "";
    document.getElementById('img_clear_black').style.visibility = "hidden";
    document.getElementById('img_clear_white').style.visibility = "hidden";
    search();
}
function turnToStation(station) {
    for (var i = 0; i < browse_list.length; i++) {
        if (browse_list[i].name == station) {
            window.location.href = 'station.html?station=' + station;
            return;
        }
    }
    browse_list.unshift(new Object({
        name: station,
        type: "0001"
    }));
    if (browse_list.length > 10) {
        browse_list.pop();
    }
    localStorage.setItem('browse_history', JSON.stringify(browse_list));
    window.location.href = 'station.html?station=' + station;
}
function turnToRoute(route) {
    for (var i = 0; i < browse_list.length; i++) {
        if (browse_list[i].name == route) {
            window.location.href = 'route.html?route=' + route;
            return;
        }
    }
    browse_list.unshift(new Object({
        name: route,
        type: "0002"
    }));
    if (browse_list.length > 10) {
        browse_list.pop();
    }
    localStorage.setItem('browse_history', JSON.stringify(browse_list));
    window.location.href = 'route.html?route=' + route;
}