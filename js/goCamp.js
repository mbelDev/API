const myfetch = fetch(
  `https://apis.data.go.kr/B551011/GoCamping/basedList?MobileOS=ETC&MobileApp=TIS&serviceKey=HXT9VD7f9VpAM6OvaIDBo7WLipiGAw43XcFqqoX0QyV%2FHGxjOkKcb7IqH7uP9%2FIq2v10qQO5LnSJYQZ6c8Zyww%3D%3D&_type=json&numOfRows=300`
);

myfetch
  .then(function (res) {
    console.log(res);
    return res.json();
  })
  .then(function (result) {
    console.log(result);
    console.log("result");
    getCamp(result);
    lastCamp();
  })
  .catch(function (error) {
    console.log("error");
  })
  .finally(function () {
    console.log("fin");
  });

function getCamp(data) {
  const listCamp = data.response.body.items.item;
  const clusterData = [];
  console.log(listCamp);
  listCamp.forEach((ele, idx) => {
    posCamp = new kakao.maps.LatLng(listCamp[idx].mapY, listCamp[idx].mapX);
    // console.log(posCamp);

    const marker = displayMarker(ele, posCamp);
    clusterData.push(marker);
    // console.log(marker);

    // displayMarker(ele, posCamp);
    // const bounds = new kakao.maps.LatLngBounds();
    // bounds.extend(posCamp);
    // map.setBounds(bounds);
  });
  clusterer.addMarkers(clusterData);
  //   if (localStorage.getItem("lastPos") !== null) {
  //     const lastPos = JSON.parse(localStorage.getItem("lastPos"));
  //     const goPos = new kakao.maps.LatLng(lastPos.Ma, lastPos.La);
  //     map.panTo(goPos);
  //   }
}

function displayMarker(data, pos) {
  const marker = new kakao.maps.Marker({
    map: map,
    position: pos,
    image: markerImage,
  });

  kakao.maps.event.addListener(marker, "click", function () {
    console.log("click");
    localStorage.setItem("lastPos", JSON.stringify(pos));
    localStorage.setItem("detailCamp", JSON.stringify(data));
    customOverlay.setContent(
      `
        <div class="contents-box">
        <div class="thumb"><img src="${data.firstImageUrl}"></img></div>
        <div class="title">${data.facltNm}</div>
        <div class="phone">${data.tel}</div>
        <div class="address">${data.addr1}</div>
        <div class="info"><a href="./info.html" target="_black">매장정보</a></div>
        <div class="service">${data.glampInnerFclty}</div>
        <button class="close" onclick="close()"><span class="material-icons">close</span></button>
        </div>
        `
    );
    customOverlay.setMap(map);
    customOverlay.setPosition(marker.getPosition());

    const moveLatLon = pos;
    // console.log(pos);
    map.panTo(moveLatLon);
  });
  return marker;
}

function lastCamp() {
  console.log("Wah");
  if (localStorage.getItem("lastPos") !== null && localStorage.getItem("detailCamp") !== null) {
    const goTo = JSON.parse(localStorage.getItem("lastPos"));
    const goPos = new kakao.maps.LatLng(goTo.Ma, goTo.La);
    const goDetail = JSON.parse(localStorage.getItem("detailCamp"));
    map.panTo(goPos);
    customOverlay.setContent(
      `
          <div class="contents-box">
          <div class="thumb"><img src="${goDetail.firstImageUrl}"></img></div>
          <div class="title">${goDetail.facltNm}</div>
          <div class="phone">${goDetail.tel}</div>
          <div class="address">${goDetail.addr1}</div>
          <div class="info"><a href="./info.html" target="_black">매장정보</a></div>
          <div class="service">${goDetail.glampInnerFclty}</div>
          <button class="close" onclick="close()"><span class="material-icons">close</span></button>
          </div>
          `
    );
    customOverlay.setMap(map);
    customOverlay.setPosition(goPos);
  }
}
