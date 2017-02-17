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

my_position = null;

//加载高德地图
var map = new AMap.Map('container', {
  resizeEnable: true,
  zoom: 10
});
function onDeviceReady() {
  //清除之前的页面记录
  navigator.app.clearHistory();
  // function onBackKeyDown() {
  //     console.log(navigator.appName);
  // }

  // document.addEventListener('backbutton', onBackKeyDown, false);

  get_my_position();
}

function get_my_position() {
  // //定位
  // navigator.geolocation.getCurrentPosition(function (position) {
  //       console.log('Latitude: ' + position.coords.latitude + '\n' +
  //           'Longitude: ' + position.coords.longitude + '\n' +
  //           'Altitude: ' + position.coords.altitude + '\n' +
  //           'Accuracy: ' + position.coords.accuracy + '\n' +
  //           'Altitude Accuracy: ' + position.coords.altitudeAccuracy + '\n' +
  //           'Heading: ' + position.coords.heading + '\n' +
  //           'Speed: ' + position.coords.speed + '\n' +
  //           'Timestamp: ' + position.timestamp + '\n');
  //
  //       //谷歌坐标转为高德坐标
  //       AMap.convertFrom([position.coords.longitude, position.coords.latitude], 'gps',
  //           function (status, result) {
  //             console.log("status:" + status);
  //             console.log("result:" + result);
  //
  //             if ('complete' == status) {
  //               //定位成功31.296033528646,120.665633409289
  //
  //               my_position = [result.locations[0].lng, result.locations[0].lat];
  //               map_move_to(my_position);
  //             }
  //           }
  //       );
  //     }, function (error) {
  //       console.log('code: ' + error.code + '\n' +
  //           'message: ' + error.message + '\n');
  //       switch (error.code) {
  //         case error.PERMISSION_DENIED:
  //           Materialize.toast('定位失败，请检查应用是否有定位权限', 5000);
  //           break;
  //         case error.POSITION_UNAVAILABLE:
  //           Materialize.toast('定位位置信息不可用', 5000);
  //           break;
  //         case error.TIMEOUT:
  //         case error.UNKNOWN_ERROR:
  //           Materialize.toast('定位失败，请检查网络是否稳定或定位权限是否开启', 5000);
  //           break;
  //       }
  //     },
  //     {timeout: 15000}
  // );

  //加载地图，调用浏览器定位服务
  map.plugin('AMap.Geolocation', function () {
    var geolocation = new AMap.Geolocation({
      enableHighAccuracy: true,//是否使用高精度定位，默认:true
      timeout: 15000,          //超过10秒后停止定位，默认：无穷大
      maximumAge: 60000,           //定位结果缓存0毫秒，默认：0
      convert: true,           //自动偏移坐标，偏移后的坐标为高德坐标，默认：true
      showButton: false,        //显示定位按钮，默认：true
      buttonPosition: 'LB',    //定位按钮停靠位置，默认：'LB'，左下角
      buttonOffset: new AMap.Pixel(10, 20),//定位按钮与设置的停靠位置的偏移量，默认：Pixel(10, 20)
      showMarker: true,        //定位成功后在定位到的位置显示点标记，默认：true
      showCircle: false,        //定位成功后用圆圈表示定位精度范围，默认：true
      panToLocation: false,     //定位成功后将定位到的位置作为地图中心点，默认：true
      zoomToAccuracy: false      //定位成功后调整地图视野范围使定位位置及精度范围视野内可见，默认：false
    });
    map.addControl(geolocation);
    geolocation.getCurrentPosition();
    AMap.event.addListener(geolocation, 'complete', onComplete);//返回定位信息
    AMap.event.addListener(geolocation, 'error', onError);      //返回定位出错信息
  });
  //解析定位结果
  function onComplete(data) {
    my_position = [data.position.getLng(), data.position.getLat()];
    map_move_to(my_position);
  }

  //解析定位错误信息
  function onError(data) {
    Materialize.toast('定位失败，请检查网络是否稳定或定位权限是否开启', 5000);
  }
}

//移动地图
function map_move_to(lngLat) {
  map.setZoom(16);
  map.panTo(lngLat);
}

function map_move_to_my_location() {
  get_my_position();
}

