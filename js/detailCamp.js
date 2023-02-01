const data = JSON.parse(localStorage.getItem("detailCamp"));

const container = document.querySelector(".wrap");
const btnTurn = document.querySelector(".close");
container.innerHTML = `
<div class="container">
<div class="thumb" style="background-image: url(${data.firstImageUrl});"></img></div>
<div class="title"><h1>${data.facltNm}</h1></div>
<div class="modiData">승인 날짜 : ${data.modifiedtime}</div>
<div class="phone">전화번호 : ${data.tel}</div>
<div class="address">주소 : ${data.addr1}</div>
<div class="address">(${data.zipcode})</div>
<div class="info"><a href="${data.homepage}" target="_black">홈페이지</a></div>
<div class="service">${data.glampInnerFclty}</div>
<div class="prog">활동 프로그램 : ${data.exprnProgram}</div>
<div class="divNm">운영 주체 : ${data.facltDivNm}</div>
<div class="divNm">야영장 구분 : ${data.induty}</div>
<div class="info">${data.intro}</div>
<div class="intro">${data.intro}</div>

<button class="close"><a href="./index.html">돌아가기</a></button>
</div>

`;
