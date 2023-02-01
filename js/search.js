const ul = document.querySelector(".list");
const search = document.querySelector(".search-txt");
const btn_search = document.querySelector(".btn-search");
const searchTxt = null;
let markers = [];
btn_search.addEventListener("click", function () {
  searchRun();
});
search.addEventListener("keyup", function (e, searchTxt = search.value) {
  if (e.key == "Enter") {
    // ps.keywordSearch(searchTxt, placesSearchCB);
    searchRun(searchTxt);
  }
});

function searchRun(target) {}
