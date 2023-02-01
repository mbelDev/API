const container = document.querySelector("#map");
const options = {
  //지도를 생성할 때 필요한 기본 옵션
  center: new kakao.maps.LatLng(37.5253785170391, 126.891376058936),
  level: 10, //지도의 레벨(확대, 축소 정도)
};

// 지도를 생성합니다
const map = new kakao.maps.Map(container, options);
const infowindow = new kakao.maps.InfoWindow({ zIndex: 1, removable: true });
const imageScr = "../images/map-pin.png",
  imageSize = new kakao.maps.Size(38, 42),
  imageOption = { offset: new kakao.maps.Point(19, 42) };
const markerImage = new kakao.maps.MarkerImage(imageScr, imageSize, imageOption);

const clusterer = new kakao.maps.MarkerClusterer({
  map: map, // 마커들을 클러스터로 관리하고 표시할 지도 객체
  averageCenter: true, // 클러스터에 포함된 마커들의 평균 위치를 클러스터 마커 위치로 설정
  minLevel: 10, // 클러스터 할 최소 지도 레벨
});

// 커스텀 오버레이가 표시될 위치입니다
var content =
  '<div class ="label"><span class="left"></span><span class="center">카카오!</span><span class="right"></span></div>';
var position = new kakao.maps.LatLng(33.450701, 126.570667);

// 커스텀 오버레이를 생성합니다
var customOverlay = new kakao.maps.CustomOverlay({
  position: position,
  content: content,
  zIndex: 3,
});
container.addEventListener("click", function (e) {
  // console.log(e.target);
  if (e.target.closest("button")) {
    customOverlay.setMap(null);
  }
});
