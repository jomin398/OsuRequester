const Lang = navigator.language;
const isKor = Lang == 'ko-KR';
const rootSetup = {
  disableId3: true
};

function displayInfo(str) {
  let ele = document.getElementById('displayInfo');
  if (!ele) {
    ele = document.createElement('div');
    ele.id = 'displayInfo';
    ele.innerText = '[to Show String Here]';
    document.body.appendChild(ele)
  }
  if (str) {
    ele.innerText = Array.isArray(str) ? str.join('\n') : typeof str == 'object' ? JSON.stringify(str) : str;
    console.log(str)
  }
}
const noti = function (t) {

  t.style.border = '2px solid red';
  t.style.animation = '1s linear infinite condemned_blink_effect';
  let timer = setTimeout(() => {
    clearTimeout(timer);
    t.style.border = null;
    t.style.animation = null;
  }, 3000);

}
var isMobile = false;

window.onload = () => {
  isMobile = document.body.clientWidth <= 510;
  DevDefender.on();
  console.log(isKor);
  initSearch();
  Localiztion();
}