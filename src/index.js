const Lang = navigator.language;
const isKor = Lang == 'ko-KR';
window.onload = () => {
    DevDeffender.on();
    mConsole.log(isKor);
    initSearch();
    Localiztion();
}