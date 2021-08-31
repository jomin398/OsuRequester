const Lang = navigator.language;
const isKor = Lang == 'ko-KR';
window.onload = ()=>{
    console.log(isKor);
    /*document.body.onload = ()=> {
        //document.getElementById('title').innerText = 'akaka'
        console.log(isKor);
    }*/
}