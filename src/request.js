const Lang = navigator.language;
const isKor = Lang == 'ko-KR';
const DB = {};
//Localiztion
function loadLocalFile(p,cbf){
    let xhr = new XMLHttpRequest();
    if(!cbf){
        throw 'Call Back Function is Undefined';
    }
    xhr.open('GET',p,true);
    xhr.onload =()=> cbf(xhr.responseText);
    xhr.send();
}
function Localiztion(d){
    DB.json = JSON.parse(d);
    document.getElementById('title').innerText = DB.json[0].t;
}

function menuFOS(){
    let d = document.querySelector('#search input').value;
    console.log(d);
    if(d){
        document.querySelector('#search').remove();
    }else{
        document.querySelector('#search input[type=text]:required').classList.add("blink");
        setTimeout(() => {
            document.querySelector('#search input[type=text]:required').classList.remove('blink')
        }, 2000);
    }
}
window.onload = ()=>{
    console.log(isKor);
    loadLocalFile('./asset/local_ko.json',Localiztion);
    document.querySelector('#search button').addEventListener("click", menuFOS);
    /*document.body.onload = ()=> {
        //document.getElementById('title').innerText = 'akaka'
        console.log(isKor);
    }*/
}