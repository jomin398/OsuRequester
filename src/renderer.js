const Renderer = {
    errors: 0
}

function dofilter(n) {
    console.log(n);
    switch (n) {
        case -1:
            DB.user.search.data = DB.json.data;
            break;
        // case 0:
        //     DB.user.search.data = DB.json.data.filter(e => {
        //         return (e.Title.includes(DB.user.search.text) || e.Title.toLowerCase().includes(DB.user.search.text.toLowerCase()))
        //     });
        //     break;
        case 1:
            DB.user.search.data = DB.json.data.filter(e => {
                return (e.Title == DB.user.search.text || e.Title.toLowerCase() == DB.user.search.text.toLowerCase())
            })
            break;
        default:
            DB.user.search.data = DB.json.data;
    }
    rendering();
}

function addFilter() {
    let nList = ['BeatmapSearching_options-container', 'title', 'selects', 'title', 'selects'];
    const BNamefilters = ['Included Match', 'Equally Match'];
    const BstateText = DB.StateTextList;
    let boc = document.querySelector("." + nList[0]);
    if (boc) {
        boc.remove();
    }
    boc = document.createElement('div');
    boc.className = nList[0];
    for (i = 1; i < nList.length; i++) {
        let ele = document.createElement('p');
        ele.id = nList[i];
        if (i == 1) {
            ele.innerText = (isKor?(LocalTextDB[0].BmapSetup[6][0]):('Filtering by Search Name (' + DB.user.search.text + ')'));
            /*
            let inp = document.createElement('input');
            inp.type = 'checkbox';
            inp.onchange = (ev) => {
                console.log(inp.checked);
                if (inp.checked == true) {
                    //for includes
                    DB.user.search.data = DB.json.data.filter(e => {
                        return (e.Title.includes(DB.user.search.text) || e.Title.toLowerCase().includes(DB.user.search.text.toLowerCase()))
                    });

                    //for perfect match.
                    DB.user.search.data = DB.json.data.filter(e => {
                        return (e.Title == DB.user.search.text || e.Title.toLowerCase() == DB.user.search.text.toLowerCase())
                    })
                    rendering()
                    document.querySelector('#title > input[type=checkbox]').checked = true;
                }
                if (inp.checked == false) {
                    DB.user.search.data = DB.json.data;
                }
                
            }
            ele.append(inp);*/
        }
        if (i == 2) {
            for (j in BNamefilters) {
                let sel = document.createElement('a');
                sel.innerText = isKor?LocalTextDB[0].BmapSetup[6][1][j]:BNamefilters[j];
                sel.id = BNamefilters[j];

                sel.onclick = () => {
                    let n = 'clicked';
                    if (sel.classList.contains(n)) {
                        sel.classList.remove(n);
                    } else {
                        sel.parentElement.childNodes.forEach(e => {
                            if (e.classList.contains(n)) {
                                e.classList.remove(n)
                            }
                        })
                        console.log('setted Search Name Filter to', sel.id);
                        num = BNamefilters.indexOf(sel.id);
                        DB.user.search.filterNo = num;
                        // sel.classList.add(n);
                        dofilter(num);
                    }
                }
                if (j != BNamefilters.length) {
                    let spen = document.createElement('span');
                    spen.innerText = " | ";
                    if (j != 0) {
                        ele.appendChild(spen)
                    }

                }
                ele.appendChild(sel);
            }
        }
        if (i == 3) {
            ele.innerText = isKor?LocalTextDB[0].BmapSetup[6][2]:'Filtering by States';
        }
        if (i == 4) {
            for (j in BstateText) {
                let sel = document.createElement('a');
                sel.innerText = BstateText[j];
                sel.id = BstateText[j];
                sel.onclick = () => {
                    let n = 'clicked';
                    if (sel.classList.contains(n)) {
                        sel.classList.remove(n);
                    } else {
                        sel.parentElement.childNodes.forEach(e => {
                            if (e.classList.contains(n)) {
                                e.classList.remove(n)
                            }
                        })
                        console.log('setted Search Name Filter to', sel.id)
                        sel.classList.add(n);
                    }
                }
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
function appendSdp() {
    let sdp = document.getElementById('sdp');
    if (sdp) { sdp.remove() };

    sdp = document.createElement('audio');
    sdp.id = 'sdp';
    sdp.src = 'https://b.ppy.sh/preview/' + DB.user.SelectedBeatMapSetID + ".mp3";
    sdp.controls = true;
    sdp.autoplay = true;
    sdp.controlsList = "nodownload";
    document.getElementById('displayInfo').insertAdjacentElement('afterend', sdp);
}
function appendSdsBtn() {
    let sdsBtnw = document.getElementById('sdsBtnw');
    if (sdsBtnw) { sdsBtnw.remove() };
    sdsBtnw = document.createElement('div');
    sdsBtnw.id = 'sdsBtnw';

    let label = document.getElementById('sdsBtnlabel');
    label = document.createElement('label');
    label.id = "sdsBtnlabel";
    label.innerText = LocalTextDB[0].btnL;
    label.style.marginRight = '5px';
    let btn = document.getElementById('sdsBtn');

    btn = document.createElement('button');
    btn.id = 'sdsBtn';
    btn.innerText = LocalTextDB[0].btn[2];
    btn.onclick = () => {
        osuDL.init(DB.user.SelectedBeatMapSetID);
    }
    sdsBtnw.append(document.createElement('br'), label, btn);
    document.getElementById('sdp').insertAdjacentElement('afterend', sdsBtnw);
}
function makeUserIO() {
    let list = null;
    addFilter()
    //make await for jsonRenderer
    let timer = setInterval(() => {
        if (document.querySelector('#json-rendrer')) {
            list = document.querySelector('#json-rendrer > ol');
            if (list) {
                list = list.childNodes;
                // append Buttons on beside of BeatMap setIDs
                for (el of list) {
                    let bn = document.createElement('button');
                    bn.type = 'button';
                    bn.innerText = isKor ? LocalTextDB[0].btn[0] : "select This";
                    bn.onclick = () => {
                        DB.user.SelectedBeatMapSetID = bn.parentElement.getElementsByClassName('json-literal')[0].innerText;
                        displayInfo((isKor ? LocalTextDB[0].BmapSetup[2] : "Requester: Selected BeatMap's SetId : ") + DB.user.SelectedBeatMapSetID)
                        appendSdp();
                        appendSdsBtn();
                        console.log(DB.user.SelectedBeatMapSetID);
                    };
                    el.querySelector('.json-dict').firstChild.append(bn);
                }
                clearInterval(timer);
            } else {
                clearInterval(timer);
                Renderer.errors++;
                if (Renderer.errors != 1) {
                    displayInfo("Requester: Error: JSON Renderer");
                    displayInfo("Requester: ReRendering...");
                    dofilter(-1);
                } else {
                    displayInfo("Requester: ReLoad Page");
                    initSearch();
                    blink(document.querySelector('#search input[type=text]:required'), "Reloaded, Lasttime threw by error.");
                }
            }
        }
    }, 1000);
}
function setLocalText() {
    r = [];
    or = DB.user.search.data;
    or.forEach(o => {
        res = {};
        cl = [
            "식별 ID", "랭킹 상태 (숫자)", "등록 일",
            "최종 수정", "최종 확인", "아티스트", "곡명", "제작자",
            "소스/출처", "영상유무", "장르", "언어",
            "하트 수 (좋아요 수)", "비공개 상태", "랭킹 상태"];
        for (j in Object.keys(o)) {
            res[cl[j]] = o[Object.keys(o)[j]];
        }
        r.push(res)
    })
    return r
}
function rendering() {
    //DB.json.data = DB.json.data.filter(e => (e.Title DB.user.search.text || e.Title.toLowerCase() == DB.user.search.text.toLowerCase()))
    displayInfo(isKor ? LocalTextDB[0].BmapSetup[1] : "Requester: Choose a Song at JSON View!");
    if (!DB.user.search.data) {
        DB.user.search.data = DB.json.data;
    }
    DB.user.search.data = setLocalText();
    displayJSON(DB.user.search.data);
    makeUserIO();
    let selnum = DB.user.search.filterNo || 0;
    selnum = selnum % 2 === 0 ? selnum : selnum + 1;
    document.querySelector('#selects').childNodes[selnum].classList.add('clicked');
}
function menuFOS() {
    DB.StateTextList = isKor ? LocalTextDB[0].BmapSetup[3] : [
        "Graveyard", "WIP", "Ranked", "Approved", "Qualified", "Loved", "Pending"
    ];
    DB.user = {};
    DB.user.search = {};
    DB.user.search.text = document.querySelector('#search input').value.trim();
    console.log(DB.user.search.text);
    if (DB.user.search.text) {
        const params = new URLSearchParams();
        params.append('query', DB.user.search.text);
        params.append('amount', 20);
        //params.append('status', 0); // ranked;
        params.append('offset', 0);
        document.querySelector('#search').remove();
        displayInfo("Requester: "+(isKor?LocalTextDB[0].BmapSetup[5][0]:"Requesting from osu! site..."))
        if (!DB.json || DB.json.code == 106) {
            loadXhr("https://api.chimu.moe/v1/search?" + params.toString(), function (res) {
                DB.json = JSON.parse(res);
                if (DB.json.code == 0) {
                    // delete ChildrenBeatmaps Obj
                    DB.json.data.forEach((e) => {
                        delete e.ChildrenBeatmaps;
                        delete e.Tags;
                        if (e.Source.includes('?')) {
                            e.Source = "";
                        }
                        e.RankedStatusText = DB.StateTextList[e.RankedStatus + 2];
                        e.Title.trim();
                    });
                    DB.user.search.filterNo = 0;
                    dofilter(-1);
                } else {
                    displayInfo("Requester: " + DB.json.message + " (" + DB.json.code + ")")
                    //document.getElementById('jsonWrapper').remove();
                    initSearch();
                    blink(document.querySelector('#search input[type=text]:required'), DB.json.message);
                }
            });
        } else {
            rendering();
        }
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
    let bmpSearchop = document.getElementsByClassName('BeatmapSearching_options-container')[0];
    if (bmpSearchop) {
        bmpSearchop.remove();
    }
    let jsonWrapper = document.getElementById('jsonWrapper');
    if (jsonWrapper) {
        jsonWrapper.remove();
    }
    let searchContiner = document.getElementById('search');
    if (searchContiner) {
        searchContiner.remove();
    }
    searchContiner = document.createElement('div');
    searchContiner.id = "search";
    searchContiner.className = 'search-container';
    let input = document.createElement('input');
    input.type = 'text';
    input.placeholder = isKor?LocalTextDB[0].search:"Search SongName..";
    input.name = "search";
    input.required = true;
    let btn = document.createElement("button");
    btn.onclick = menuFOS;
    let icon = document.createElement('i');
    icon.className = 'fa fa-search';
    btn.append(icon);
    searchContiner.append(input, btn);
    document.getElementById('title').insertAdjacentElement('afterend', searchContiner);
}