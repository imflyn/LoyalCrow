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

if (isPC) {
  var search_bar = document.getElementById('search_bar');
  search_bar.style.width = 200;
}

window.addEventListener('load', function () {
  document.addEventListener('deviceready', onDeviceReady, false);
});
function onDeviceReady() {
  //清除之前的页面记录
  navigator.app.clearHistory();
  // function onBackKeyDown() {
  //     console.log(navigator.appName);
  // }

  // document.addEventListener('backbutton', onBackKeyDown, false);
}

//加载高德地图
var map = new AMap.Map('container', {
  resizeEnable: true,
  zoom: 12
});

// map.plugin(["AMap.ToolBar"], function () {
//     //隐藏工具条
//     var toolBar = new AMap.ToolBar();
//     map.addControl(toolBar);
//     toolBar.hide();
// });

setTimeout(function () {
  var my_location = [120.6711999117, 31.2954502809];

  map.panTo(my_location);
  map.setZoom(16);
  var marker = new AMap.Marker({
    map: map,
    position: my_location
  });
}, 2500);
