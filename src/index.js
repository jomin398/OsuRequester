const Lang = navigator.language;
const isKor = Lang == 'ko-KR';
var isMobile = false;

window.onload = () => {
  isMobile = document.body.clientWidth <= 510;
  DevDefender.on();
  console.log(isKor);
  initSearch();
  Localiztion();
}