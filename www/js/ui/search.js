window.addEventListener('load', function () {
    document.addEventListener('deviceready', onDeviceReady, false);
});
document.getElementById('input_search').style.width = (screen.width - 88) + "px";
load_history();
//=============================================================================================================================================
//=============================================================================================================================================
function onDeviceReady() {
    document.addEventListener('backbutton', onBackKeyDown, false);
    document.addEventListener('searchbutton', onSearchButtonDown, false);
    StatusBar.backgroundColorByHexString(theme_color_accent);
}
function onBackKeyDown() {
    history.go(-1);
    navigator.app.backHistory();
}
function onSearchButtonDown() {
    search();
}
function onSearchFocused() {
    document.getElementById('img_search_black').style.visibility = "visible";
    document.getElementById('img_search_white').style.visibility = "hidden";
    document.getElementById('img_clear').style.visibility = "visible";
}
function onSearchBlured() {
    document.getElementById('img_search_black').style.visibility = "hidden";
    document.getElementById('img_search_white').style.visibility = "visible";
    document.getElementById('img_clear').style.visibility = "hidden";
}
function load_history() {
    browse_list = localStorage.getItem("browse_history");
    if (browse_list == null) {
        browse_list = [];
    }
    else {
        browse_list = JSON.parse(browse_list);
    }
}
var myjson = "[{\"name\":\"522\",\"type\":\"0002\"},{\"name\":\"822\",\"type\":\"0002\"},{\"name\":\"922\",\"type\":\"0002\"},{\"name\":\"228\",\"type\":\"0002\"},{\"name\":\"322\",\"type\":\"0002\"},{\"name\":\"622\",\"type\":\"0002\"},{\"name\":\"华元路227省道西\",\"type\":\"0001\"},{\"name\":\"522\",\"type\":\"0002\"},{\"name\":\"822\",\"type\":\"0002\"},{\"name\":\"922\",\"type\":\"0002\"},{\"name\":\"228\",\"type\":\"0002\"},{\"name\":\"322\",\"type\":\"0002\"},{\"name\":\"622\",\"type\":\"0002\"},{\"name\":\"华元路227省道西\",\"type\":\"0001\"},{\"name\":\"522\",\"type\":\"0002\"},{\"name\":\"822\",\"type\":\"0002\"},{\"name\":\"922\",\"type\":\"0002\"},{\"name\":\"228\",\"type\":\"0002\"},{\"name\":\"322\",\"type\":\"0002\"},{\"name\":\"622\",\"type\":\"0002\"},{\"name\":\"华元路227省道西\",\"type\":\"0001\"},{\"name\":\"522\",\"type\":\"0002\"},{\"name\":\"822\",\"type\":\"0002\"},{\"name\":\"922\",\"type\":\"0002\"},{\"name\":\"228\",\"type\":\"0002\"},{\"name\":\"322\",\"type\":\"0002\"},{\"name\":\"622\",\"type\":\"0002\"},{\"name\":\"华元路227省道西\",\"type\":\"0001\"},{\"name\":\"522\",\"type\":\"0002\"},{\"name\":\"822\",\"type\":\"0002\"},{\"name\":\"922\",\"type\":\"0002\"},{\"name\":\"228\",\"type\":\"0002\"},{\"name\":\"322\",\"type\":\"0002\"},{\"name\":\"622\",\"type\":\"0002\"},{\"name\":\"华元路227省道西\",\"type\":\"0001\"},{\"name\":\"522\",\"type\":\"0002\"},{\"name\":\"822\",\"type\":\"0002\"},{\"name\":\"922\",\"type\":\"0002\"},{\"name\":\"228\",\"type\":\"0002\"},{\"name\":\"322\",\"type\":\"0002\"},{\"name\":\"622\",\"type\":\"0002\"},{\"name\":\"华元路227省道西\",\"type\":\"0001\"},{\"name\":\"522\",\"type\":\"0002\"},{\"name\":\"822\",\"type\":\"0002\"},{\"name\":\"922\",\"type\":\"0002\"},{\"name\":\"228\",\"type\":\"0002\"},{\"name\":\"322\",\"type\":\"0002\"},{\"name\":\"622\",\"type\":\"0002\"},{\"name\":\"华元路227省道西\",\"type\":\"0001\"}]";
function search() {
    var text = document.getElementById('input_search').value;
    if (text.length == 0) {
        document.getElementById('img_clear').style.visibility = "hidden";
        document.getElementById('search_result').style.visibility = 'hidden';
        document.getElementById('browse_history').style.visibility = 'visible';
        return;
    }
    document.getElementById('img_clear').style.visibility = "visible";
    document.getElementById('search_result').style.visibility = 'visible';
    document.getElementById('browse_history').style.visibility = 'hidden';
    show_loading_dialog();
    var url = "http://192.168.0.104:5000/search?keyword=" + text;
    var request = sendGetRequest(url, function () {
            hide_loading_dialog();
            if (request.readyState == 4 && request.status == 200) {
                var result_list = JSON.parse(request.responseText);
                var parent = document.getElementById('ul_search_result');
                parent.innerHTML = "";
                for (var i = 0; i < result_list.length; i++) {
                    var li = document.createElement("li");
                    li.setAttribute("class", "waves-effect collection-item browse_list_collection_item");
                    (function (index) {
                        li.onclick = function () {
                            alert(index)
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
            } else {
                var result_list = JSON.parse(myjson);
                var parent = document.getElementById('ul_search_result');
                parent.innerHTML = "";
                for (var j = 0; j < result_list.length; j++) {
                    var li = document.createElement("li");
                    li.setAttribute("class", "waves-effect collection-item browse_list_collection_item");
                    (function (index) {
                        li.onclick = function () {
                            if (result_list[index].type == "0001") {
                                turnToRoute(result_list[index].name)
                            }
                            else {
                                turnToStation(result_list[index].name)
                            }
                        };
                    })(j);
                    var img = document.createElement("img");
                    if (result_list[j].type == "0001") {
                        img.setAttribute("src", "../img/ic_station.png");
                    } else if (result_list[j].type == "0002") {
                        img.setAttribute("src", "../img/ic_bus.png");
                    }
                    img.setAttribute("alt", "");
                    img.setAttribute("class", "circle collection_icon");
                    var span = document.createElement("span");
                    span.setAttribute("class", "ext_color_primary");
                    if (result_list[j].type == "0001") {
                        span.innerHTML = result_list[j].name + "(公交站)";
                    } else if (result_list[j].type == "0002") {
                        span.innerHTML = result_list[j].name + "路";
                    }
                    li.appendChild(img);
                    li.appendChild(span);
                    parent.appendChild(li);
                }
            }
        }
    );
}
function onTextClearClick() {
    document.getElementById('input_search').value = "";
    document.getElementById('img_clear').style.visibility = "hidden";
}
function turnToStation(station) {
    window.location.href = 'station.html?station=' + station;
}
function turnToRoute(route) {
    window.location.href = 'route.html?route=' + route;
}