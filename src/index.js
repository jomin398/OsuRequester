const Lang = navigator.language;
const isKor = Lang == 'ko-KR';
var isMobile = false;

window.onload = () => {
  isMobile = document.body.clientWidth <= 510;
    DevDefender.on();
    mConsole.log(isKor);
    initSearch();
    Localiztion();
}