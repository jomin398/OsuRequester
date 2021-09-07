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
    }
    if (str) {
        ele.innerText = Array.isArray(str) ? str.join('\n') : typeof str == 'object' ? JSON.stringify(str) : str;
        mConsole.log(str)
    }
}
function blink(targetElem, showMsg) {
    targetElem.classList.add("blink");
    if (showMsg) {
        displayInfo(showMsg);
    }
    setTimeout(() => {
        targetElem.classList.remove('blink');
        if (document.getElementById('displayInfo')) {
            document.getElementById('displayInfo').remove();
        }
    }, 2000);
}
function addFilter() {
    let nList = ['BeatmapSearching_options-container', 'title', 'selects', 'title', 'selects'];
    const BstateText = ["Graveyard", "WIP", "Ranked", "Approved", "Qualified", "Loved", "Pending"];
    let boc = document.querySelector(nList[0]);
    if (boc) {
        boc.remove();
    }
    boc = document.createElement('div');
    boc.className = nList[0];
    for (i = 1; i < nList.length - 1; i++) {
        let ele = document.createElement('p');
        ele.id = nList[i];
        if (i == 1) {
            ele.innerText = 'Filtering by Name';
        }
        if(i==2){
            
        }
        if (i == 3) {
            ele.innerText = 'Filtering by States';
        }
        if (i == 4) {
            for (j in BstateText) {
                let sel = document.createElement('a');
                sel.innerText = BstateText[j];
                sel.id = BstateText[j];
                if (j != BstateText.length) {
                    let spen = document.createElement('span');
                    spen.innerText = " | ";
                    if (j != 0) {
                        ele.appendChild(spen)
                    }

                }
                ele.appendChild(sel);
            }
        }
        boc.append(ele);
    }
    document.getElementById('jsonWrapper').insertAdjacentElement('beforebegin', boc)
}
function makeUserIO() {
    let list = null;
    DB.user = {};
    addFilter()
    //make await for jsonRenderer
    let timer = setInterval(() => {
        if (document.querySelector('#json-rendrer')) {
            list = document.querySelector('#json-rendrer > ol > li:nth-child(2) > ul > li:nth-child(3) > ol').childNodes;
            // append Buttons on beside of BeatMap setIDs
            for (el of list) {
                let bn = document.createElement('button');
                bn.type = 'button';
                bn.innerText = isKor ? LocalTextDB[0].btn[0] : "select This";
                bn.onclick = () => {
                    DB.user.SelectedBeatMapSetID = bn.parentElement.getElementsByClassName('json-literal')[0].innerText;
                    displayInfo((isKor ? LocalTextDB[0].BmapSetup[2] : "Requester: Selected BeatMap's SetId : ") + DB.user.SelectedBeatMapSetID)
                    mConsole.log(DB.user.SelectedBeatMapSetID);
                };
                el.querySelector('.json-dict').firstChild.append(bn);
            }
            clearInterval(timer);
        }
    }, 1000);
}
function menuFOS() {
    const BstateText = ["Graveyard", "WIP", "Ranked", "Approved", "Qualified", "Loved", "Pending"];
    DB.search = document.querySelector('#search input').value.trim();
    mConsole.log(DB.search);
    if (DB.search) {
        const params = new URLSearchParams();
        params.append('query', DB.search);
        params.append('amount', 20);
        //params.append('status', 0); // ranked;
        params.append('offset', 0);
        document.querySelector('#search').remove();
        displayInfo("Requester: Requesting from bloodCat...")
        loadXhr("https://api.chimu.moe/v1/search?" + params.toString(), function (res) {
            DB.json = JSON.parse(res);
            if (DB.json.code == 0) {
                DB.json.data.forEach((e) => {
                    delete e.ChildrenBeatmaps;
                    delete e.Tags;
                    e.RankedStatusText = BstateText[e.RankedStatus + 2];
                    e.Title.trim();
                }) // delete ChildrenBeatmaps Obj
                //DB.json.data = DB.json.data.filter(e => (e.Title == DB.search || e.Title.toLowerCase() == DB.search.toLowerCase()))
                displayInfo(isKor ? LocalTextDB[0].BmapSetup[1] : "Requester: Choose a Song at JSON View!")
                displayJSON([params.toString(), DB.json]);
                document.getElementById('title').removeEventListener('click', menuFOS);
                makeUserIO();
            } else {
                displayInfo("Requester: " + DB.json.message + " (" + DB.json.code + ")")
                //document.getElementById('jsonWrapper').remove();
                initSearch();
                blink(document.querySelector('#search input[type=text]:required'), DB.json.message);
            }

        });
    } else {
        blink(document.querySelector('#search input[type=text]:required'), (isKor ? LocalTextDB[0].BmapSetup[0] : "Requester: search Query Can Not be Null."));
    }
}
function initSearch() {
    /*
    <div class="search-container" id="search">
        <input type="text" placeholder="Search SongName.." name="search" required>
        <button><i class="fa fa-search"></i></button>
    </div>
    */
    let searchContiner = document.getElementById('search');
    if (searchContiner) {
        searchContiner.remove();
    }
    searchContiner = document.createElement('div');
    searchContiner.id = "search";
    searchContiner.className = 'search-container';
    let input = document.createElement('input');
    input.type = 'text';
    input.placeholder = "Search SongName..";
    if (isKor) {
        input.placeholder = LocalTextDB[0].search;
    }
    input.name = "search";
    input.required = true;
    let btn = document.createElement("button");
    btn.addEventListener("click", menuFOS);
    let icon = document.createElement('i');
    icon.className = 'fa fa-search';
    btn.append(icon);
    searchContiner.append(input, btn);
    document.getElementById('title').insertAdjacentElement('afterend', searchContiner);
}