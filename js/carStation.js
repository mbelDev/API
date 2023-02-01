const ps = new kakao.maps.services.Places();
const geocoder = new kakao.maps.services.Geocoder();

const search = document.querySelector(".search-txt");
const btn_search = document.querySelector(".btn-search");
const searchTxt = null;
const markers = [];

btn_search.addEventListener("click", function () {
  searchRun();
});
search.addEventListener("keyup", function (e, searchTxt = search.value) {
  if (e.key == "Enter") {
    // ps.keywordSearch(searchTxt, placesSearchCB);
    searchRun(searchTxt);
  }
});

// let addr = "서울";

function searchRun(addr) {
  const myfetch = fetch(
    `https://api.odcloud.kr/api/EvInfoServiceV2/v1/getEvSearchList?page=1&perPage=100&returnType=json&cond[addr::LIKE]=${addr}&serviceKey=HXT9VD7f9VpAM6OvaIDBo7WLipiGAw43XcFqqoX0QyV%2FHGxjOkKcb7IqH7uP9%2FIq2v10qQO5LnSJYQZ6c8Zyww%3D%3D`
  );

  myfetch
    .then(function (res) {
      console.log(res);
      return res.json();
    })
    .then(function (result) {
      console.log(result.data);
      console.log(result.data.length);
      if (result.data.length > 0) {
        resetMark();
        getStation(result.data);
      } else {
        alert("검색 결과 없음");
      }
    })
    .catch(function (error) {
      console.log("error");
    })
    .finally(function () {
      console.log("fin");
    });
}

function getStation(data) {
  var bounds = new kakao.maps.LatLngBounds();
  data.forEach((ele) => {
    // console.log(ele);
    const clusterData = [];
    const marker = displayMarker(ele);
    markers.push(marker);
    clusterData.push(marker);
    clusterer.addMarkers(clusterData);
    bounds.extend(new kakao.maps.LatLng(ele.lat, ele.longi));
  });

  // 검색된 장소 위치를 기준으로 지도 범위를 재설정합니다
  map.setBounds(bounds);
}

function displayMarker(data) {
  const pos = new kakao.maps.LatLng(data.lat, data.longi);
  console.log(pos);
  const marker = new kakao.maps.Marker({
    map: map,
    position: pos,
    // image: markerImage,
  });

  kakao.maps.event.addListener(marker, "click", function () {
    console.log("click");
    customOverlay.setContent(
      `
          <div class="contents-box">
          <div class="csNm">${data.csNm}</div>
          <div class="cpId">충전기 ID : ${data.cpId} (${data.cpNm})</div>
          <div class="address">위치 : ${data.addr}</div>
          <div class="update">갱신일     : ${data.statUpdatetime}</div>
          <button class="close" onclick="close()"><span class="material-icons">close</span></button>
          </div>
          `
    );
    customOverlay.setMap(map);
    customOverlay.setPosition(marker.getPosition());
    map.panTo(pos);
  });
  return marker;
}

function displayList(data, idx) {
  const el = document.createElement("li");
  el.innerHTML = `<sapn class="markerbg marker_${index + 1}"></span>
    <div class="info">
        <h5>${data.csNm} ${data.addr}</h5>
    </div>
    `;
  el.className = "item";

  return el;
}

function resetMark() {
  markers.forEach((ele) => {
    ele.setMap(null);
  });
  clusterer.clear();
  customOverlay.setMap(null);
}
