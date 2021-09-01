const Lang = navigator.language;
const isKor = Lang == 'ko-KR';
const DB = {};
//Localiztion
function loadXhr(p, cbf, b) {
    let xhr = new XMLHttpRequest();
    if (!cbf) {
        throw 'Call Back Function is Undefined';
    }
    xhr.open('GET', p, true);
    xhr.onload = () => cbf(xhr.responseText);
    if (b) {
        xhr.send(b);
    } else {
        xhr.send();
    }

}
function Localiztion() {
    document.getElementById('title').innerText = LocalTextDB[0].t;
}

/**
 * @author jomin398
 * @name displayJSON
 * @param {object} obj to display json object 
 * @param {object} option to set options @see guide https://github.com/abodelot/jquery.json-viewer
 */
function displayJSON(obj, option) {
    let el1 = document.getElementById('json-rendrer');
    if (!el1) {
        jsonWrapper = document.createElement('div');
        jsonWrapper.id = 'jsonWrapper';
        el1 = document.createElement('label');
        el1.innerText = 'JSON viewer';
        el2 = document.createElement('a');
        el2.id = 'json-rendrer';
        el2.innerText = 'Init json...';
        jsonWrapper.append(el1, document.createElement('br'), el2);
        document.body.appendChild(jsonWrapper);
    }
    if (obj) {
        $(function () {
            $('#json-rendrer').jsonViewer(obj, option);
        });
    }

}
function displayInfo(str) {
    let ele = document.getElementById('displayInfo');
    if (!ele) {
        ele = document.createElement('div');
        ele.id = 'displayInfo';
        ele.innerText = '[to Show String Here]';
        document.body.appendChild(ele)
    } else {
        if (str) {
            ele.innerText = Array.isArray(str) ? str.join('\n') : typeof str == 'object' ? JSON.stringify(str) : str;
        }
    }
}
function menuFOS() {
    DB.search = document.querySelector('#search input').value.trim();
    console.log(DB.search);
    if (DB.search) {
        const params = new URLSearchParams();
        params.append('query', DB.search);
        params.append('amount', 20);
        params.append('status', 1); // ranked;
        params.append('offset', 0);
        document.querySelector('#search').remove();
        displayInfo("Requester: Requesting from bloodCat...")
        loadXhr("https://api.chimu.moe/v1/search?" + params.toString(), function (res) {
            DB.json = JSON.parse(res);
            DB.json.data.forEach((e) => {
                delete e.ChildrenBeatmaps;
                e.Title.trim();
            }) // delete ChildrenBeatmaps Obj
            //DB.json.data = DB.json.data.filter(e => (e.Title == DB.search || e.Title.toLowerCase() == DB.search.toLowerCase()))
            displayInfo("Requester: Look at JSON View!")
            displayJSON([params.toString(), DB.json])
        });
    } else {
        document.querySelector('#search input[type=text]:required').classList.add("blink");
        setTimeout(() => {
            document.querySelector('#search input[type=text]:required').classList.remove('blink')
        }, 2000);
    }
}
window.onload = () => {
    console.log(isKor);
    Localiztion();
    document.querySelector('#search button').addEventListener("click", menuFOS);
    /*document.body.onload = ()=> {
        //document.getElementById('title').innerText = 'akaka'
        console.log(isKor);
    }*/
}