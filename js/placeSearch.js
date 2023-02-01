const ul = document.querySelector(".list");
const search = document.querySelector(".search-txt");
const btn_search = document.querySelector(".btn-search");
const searchTxt = null;
const wndMsg = document.querySelector(".wndMsg");
const ps = new kakao.maps.services.Places();
let markers = [];

ps.keywordSearch("선유로 130", placesSearchCB);

btn_search.addEventListener("click", function () {
  searchRun();
});
search.addEventListener("keyup", function (e, searchTxt = search.value) {
  if (e.key == "Enter") {
    ps.keywordSearch(searchTxt, placesSearchCB);
    //searchRun(searchTxt);
  }
});

function reset() {
  const searchContent = document.querySelectorAll(".list li");
  searchContent.forEach((ele) => {
    ul.removeChild(ele);
  });
}

function searchRun(txt = search.value) {
  geocoder.addressSearch(txt, function (result, status) {
    // 정상적으로 검색이 완료됐으면);
    if (status === kakao.maps.services.Status.OK) {
      resetMark();
      let building = result[0].address_name;
      console.log(result[0]);
      if (result[0].road_address !== null && result[0].road_address.building_name !== "") {
        building = result[0].road_address.building_name;
      }
      const coords = new kakao.maps.LatLng(result[0].y, result[0].x);
      // 결과값으로 받은 위치를 마커로 표시합니다
      const marker = new kakao.maps.Marker({
        position: coords,
        image: markerImage,
      });
      console.log(marker);
      markers.push(marker);
      marker.setMap(map);

      infowindow.setContent(
        '<div style="width:150px;text-align:center;padding:6px 0;">' + building + "</div>"
      );
      infowindow.open(map, marker);

      // 지도의 중심을 결과값으로 받은 위치로 이동시킵니다
      map.setCenter(coords);
      console.log(coords);
    } else if (status === kakao.maps.services.Status.ZERO_RESULT) {
      alert("검색 결과가 없습니다.");
    }
  });
}

function placesSearchCB(data, status, pagination) {
  if (status === kakao.maps.services.Status.OK) {
    // 검색된 장소 위치를 기준으로 지도 범위를 재설정하기위해
    // LatLngBounds 객체에 좌표를 추가합니다
    console.log(data);
    resetMark();
    var bounds = new kakao.maps.LatLngBounds();

    for (var i = 0; i < data.length; i++) {
      displayMarker(data[i]);
      bounds.extend(new kakao.maps.LatLng(data[i].y, data[i].x));
    }
    // displayPlaces(data);
    // 검색된 장소 위치를 기준으로 지도 범위를 재설정합니다
    map.setBounds(bounds);
  }
  if (status === kakao.maps.services.Status.ZERO_RESULT) {
    alert("검색 결과가 없습니다.");
  }
  if (status === kakao.maps.services.Status.ERROR) {
    alert("ERROR");
  }
}

// 검색 결과 목록과 마커를 표출하는 함수입니다
function displayPlaces(places) {
  var listEl = document.getElementById("placesList"),
    menuEl = document.getElementById("menu_wrap"),
    fragment = document.createDocumentFragment(),
    bounds = new kakao.maps.LatLngBounds(),
    listStr = "";

  // 검색 결과 목록에 추가된 항목들을 제거합니다
  removeAllChildNods(listEl);

  // 지도에 표시되고 있는 마커를 제거합니다
  resetMark();

  for (var i = 0; i < places.length; i++) {
    // 마커를 생성하고 지도에 표시합니다
    displayMarker(places[i]);
    var placePosition = new kakao.maps.LatLng(places[i].y, places[i].x);
    var marker = addMarker(placePosition, i);
    var itemEl = getListItem(i, places[i]); // 검색 결과 항목 Element를 생성합니다

    // 검색된 장소 위치를 기준으로 지도 범위를 재설정하기위해
    // LatLngBounds 객체에 좌표를 추가합니다
    bounds.extend(placePosition);

    // 마커와 검색결과 항목에 mouseover 했을때
    // 해당 장소에 인포윈도우에 장소명을 표시합니다
    // mouseout 했을 때는 인포윈도우를 닫습니다
    (function (marker, title) {
      kakao.maps.event.addListener(marker, "mouseover", function () {
        displayInfowindow(marker, title);
      });

      kakao.maps.event.addListener(marker, "mouseout", function () {
        infowindow.close();
      });

      itemEl.onmouseover = function () {
        displayInfowindow(marker, title);
      };

      itemEl.onmouseout = function () {
        infowindow.close();
      };
    })(marker, places[i].place_name);

    fragment.appendChild(itemEl);
  }

  // 검색결과 항목들을 검색결과 목록 Element에 추가합니다
  listEl.appendChild(fragment);
  menuEl.scrollTop = 0;

  // 검색된 장소 위치를 기준으로 지도 범위를 재설정합니다
  map.setBounds(bounds);
}
// 검색결과 항목을 Element로 반환하는 함수입니다
function getListItem(index, places) {
  var el = document.createElement("li"),
    itemStr =
      '<span class="markerbg marker_' +
      (index + 1) +
      '"></span>' +
      '<div class="info">' +
      "   <h5>" +
      places.place_name +
      "</h5>";

  if (places.road_address_name) {
    itemStr +=
      "    <span>" +
      places.road_address_name +
      "</span>" +
      '   <span class="jibun gray">' +
      places.address_name +
      "</span>";
  } else {
    itemStr += "    <span>" + places.address_name + "</span>";
  }

  itemStr += '  <span class="tel">' + places.phone + "</span>" + "</div>";

  el.innerHTML = itemStr;
  el.className = "item";

  return el;
}
// 검색결과 목록 하단에 페이지번호를 표시는 함수입니다
function displayPagination(pagination) {
  var paginationEl = document.getElementById("pagination"),
    fragment = document.createDocumentFragment(),
    i;

  // 기존에 추가된 페이지번호를 삭제합니다
  while (paginationEl.hasChildNodes()) {
    paginationEl.removeChild(paginationEl.lastChild);
  }

  for (i = 1; i <= pagination.last; i++) {
    var el = document.createElement("a");
    el.href = "#";
    el.innerHTML = i;

    if (i === pagination.current) {
      el.className = "on";
    } else {
      el.onclick = (function (i) {
        return function () {
          pagination.gotoPage(i);
        };
      })(i);
    }

    fragment.appendChild(el);
  }
  paginationEl.appendChild(fragment);
}

// 검색결과 목록 또는 마커를 클릭했을 때 호출되는 함수입니다
// 인포윈도우에 장소명을 표시합니다
function displayInfowindow(marker, title) {
  var content = '<div style="padding:5px;z-index:1;">' + title + "</div>";

  infowindow.setContent(content);
  infowindow.open(map, marker);
}

// 검색결과 목록의 자식 Element를 제거하는 함수입니다
function removeAllChildNods(el) {
  while (el.hasChildNodes()) {
    el.removeChild(el.lastChild);
  }
}
function addMarker(position, idx, title) {
  var imageSrc = "https://t1.daumcdn.net/localimg/localimages/07/mapapidoc/marker_number_blue.png", // 마커 이미지 url, 스프라이트 이미지를 씁니다
    imageSize = new kakao.maps.Size(36, 37), // 마커 이미지의 크기
    imgOptions = {
      spriteSize: new kakao.maps.Size(36, 691), // 스프라이트 이미지의 크기
      spriteOrigin: new kakao.maps.Point(0, idx * 46 + 10), // 스프라이트 이미지 중 사용할 영역의 좌상단 좌표
      offset: new kakao.maps.Point(13, 37), // 마커 좌표에 일치시킬 이미지 내에서의 좌표
    },
    markerImage = new kakao.maps.MarkerImage(imageSrc, imageSize, imgOptions),
    marker = new kakao.maps.Marker({
      position: position, // 마커의 위치
      image: markerImage,
    });

  marker.setMap(map); // 지도 위에 마커를 표출합니다
  markers.push(marker); // 배열에 생성된 마커를 추가합니다

  return marker;
}

// 지도에 마커를 표시하는 함수입니다
function displayMarker(place) {
  // 마커를 생성하고 지도에 표시합니다
  var marker = new kakao.maps.Marker({
    map: map,
    position: new kakao.maps.LatLng(place.y, place.x),
    image: markerImage,
  });
  markers.push(marker);

  // 마커에 클릭이벤트를 등록합니다
  kakao.maps.event.addListener(marker, "click", function () {
    // 마커를 클릭하면 장소명이 인포윈도우에 표출됩니다
    // infowindow.setContent(
    //   '<div style="width:150px;text-align:center;padding:6px 0;">' + place.place_name + "</div>"
    // );
    // infowindow.open(map, marker);

    customOverlay.setContent(
      `
      <div class="contents-box">
      <div class="title">${place.place_name}</div>
      <div class="phone">${place.phone}</div>
      <div class="address">${place.road_address_name}</div>
      <div class="info"><a href="${place.place_url}" target="_black">매장정보</a></div>
      <button class="close" onclick="close()"><span class="material-icons">close</span></button>
      </div>
      `
    );
    customOverlay.setMap(map);
    customOverlay.setPosition(marker.getPosition());

    const moveLatLon = new window.kakao.maps.LatLng(place.y, place.x);
    map.panTo(moveLatLon);
  });
}

function searchFail() {
  wndMsg.classList.add("alert");
  setTimeout(function () {
    wndMsg.classList.add("off");
  }, 3000);
  setTimeout(function () {
    wndMsg.classList.remove("alert");
    wndMsg.classList.remove("off");
  }, 5000);
}
function resetMark() {
  markers.forEach((ele) => {
    ele.setMap(null);
  });
  markers = [];
}
