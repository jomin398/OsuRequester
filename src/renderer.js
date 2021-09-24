const Renderer = {
    errors: 0
}

function dofilter(n, cfn) {
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
    rendering(cfn);
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
            ele.innerText = (isKor ? (LocalTextDB[0].BmapSetup[6][0]) : ('Filtering by Search Name')) + ' (' + DB.user.search.text + ')';
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
                sel.innerText = isKor ? LocalTextDB[0].BmapSetup[6][1][j] : BNamefilters[j];
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
            ele.innerText = isKor ? LocalTextDB[0].BmapSetup[6][2] : 'Filtering by States';
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
        osuDL.init(DB.user.SelectedBeatMapSetID, (u) => {
            if (!rootSetup.disableId3) {
                id3Renderer(u);
            }
        });
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
                        //autoscroll;                          
                        $(document).scrollTop(0);
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
function rendering(cfn) {
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

    let moreViewWrapper = document.getElementById('moreViewWrapper');
    if (moreViewWrapper) { moreViewWrapper.remove() };
    moreViewWrapper = document.createElement('div');
    moreViewWrapper.id = 'moreViewWrapper';
    let btn = document.createElement('button');
    btn.id = 'moreView';
    btn.innerText = isKor ? LocalTextDB[0].btn[3] : "more";
    btn.onclick = () => searchSend();
    moreViewWrapper.append(btn);
    document.querySelector('#jsonWrapper').insertAdjacentElement('beforebegin', moreViewWrapper);
    if (cfn) {
        cfn();
    }
}
function searchSend() {
    DB.StateTextList = isKor ? LocalTextDB[0].BmapSetup[3] : [
        "Graveyard", "WIP", "Ranked", "Approved", "Qualified", "Loved", "Pending"
    ];
    const params = new URLSearchParams();
    params.append('query', DB.user.search.text);
    params.append('amount', 20);
    if (DB.user.search.offset == undefined) {
        DB.user.search.pages = 0;
        params.append('offset', 0);
        DB.user.search.offset = 20;
        document.querySelector('#search').remove();
        displayInfo("Requester: " + (isKor ? LocalTextDB[0].BmapSetup[5][0] : "Requesting from osu! site..."));
    } else {
        params.append('offset', DB.user.search.offset);
        DB.user.search.offset += 20;
        DB.user.search.pages++;
        displayInfo("Requester: " + (isKor ? LocalTextDB[0].BmapSetup[5][1] : "More Requesting from osu! site..."));
    }

    loadXhr("https://api.chimu.moe/v1/search?" + params.toString(), function (res) {
        res = JSON.parse(res);
        if (!DB.json) {
            if (res.code == 0) {
                // delete ChildrenBeatmaps Obj
                res.data.forEach((e) => {
                    delete e.ChildrenBeatmaps;
                    delete e.Tags;
                    if (e.Source.includes('?')) {
                        e.Source = "";
                    }
                    e.RankedStatusText = DB.StateTextList[e.RankedStatus + 2];
                    e.Title.trim();
                });
                DB.json = res;
                DB.user.search.filterNo = 0;
                dofilter(-1);
            } else {
                displayInfo("Requester: " + res.message + " (" + res.code + ")")
                //document.getElementById('jsonWrapper').remove();
                initSearch();
                blink(document.querySelector('#search input[type=text]:required'), res.message);
            }
        } else {
            if (res.code == 0) {
                res.data.forEach((e) => {
                    delete e.ChildrenBeatmaps;
                    delete e.Tags;
                    if (e.Source.includes('?')) {
                        e.Source = "";
                    }
                    e.RankedStatusText = DB.StateTextList[e.RankedStatus + 2];
                    e.Title.trim();
                });
                DB.json.data = DB.json.data.concat(res.data);
                DB.user.search.filterNo = 0;
                dofilter(-1);
            } else {
                //document.getElementById('jsonWrapper').remove();
                dofilter(-1, () => {
                    let moreViewWrapper = document.getElementById('moreViewWrapper');
                    if (moreViewWrapper) { moreViewWrapper.remove() };
                    displayInfo("Requester: " + (isKor ? LocalTextDB[0].BmapSetup[5][2] : "No More!"));
                    noti(document.getElementById('displayInfo'));
                    let timerr = setTimeout(() => {
                        clearTimeout(timerr);
                        displayInfo(isKor ? LocalTextDB[0].BmapSetup[1] : "Requester: Choose a Song at JSON View!");
                    }, 3000);
                });
            }
        }
    });
}
function menuFOS() {
    DB.user = {};
    DB.user.search = {};
    DB.user.search.text = document.querySelector('#search input').value.trim();
    console.log(DB.user.search.text);
    if (DB.user.search.text) {
        searchSend();
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
    input.placeholder = isKor ? LocalTextDB[0].search : "Search SongName..";
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
function id3Renderer(soundUrl) {
    let id3Wrapper = document.querySelector('.Id3DisplaySplit');
    if (id3Wrapper) {
        id3Wrapper.remove();
    }
    new ID3Reader(soundUrl).onload = function (tag) {
        console.log("ID3Reader_worker Data :", tag);
        if (!tag) {
            console.log("Unable to read ID3 Tag of file");
            return false;
        }
        if (tag) {
            id3Wrapper = document.createElement('div');
            id3Wrapper.className = 'Id3DisplaySplit left';
            let readRes = document.createElement('div');
            readRes.className = 'centered';
            readRes.id = 'results';
            id3Wrapper.append(readRes)
            document.querySelector('#jsonWrapper').insertAdjacentElement('beforebegin', id3Wrapper);
            let tb = document.querySelector('.Id3DisplaySplit.left .centered#results');
            let table = document.createElement('table');
            for (i = 0; i < 8; i++) {
                let tr = document.createElement('tr');
                if (i == 0) {
                    let th = document.createElement('th');
                    th.innerText = 'ID3 Tag from original file.';
                    tr.appendChild(th);
                } else {
                    let l = [null, 'A (Beatmap) ------->', 'Artist', 'Title', 'Album', 'Year', 'Comment', 'Track'];
                    let tdt = document.createElement('td');
                    let listLowc = l[i].toLowerCase();
                    tdt.className = 'label';
                    let label = document.createElement('strong');
                    let tdb = document.createElement('td');
                    if (i == 1) {
                        label.innerText = l[i];
                        tdb.innerText = '<--- B (ID3 TAG)';
                    } else {
                        if (i == 4) {
                            label.innerText = l[i] + " (Source):";
                        } else {
                            label.innerText = l[i] + ":";
                        }

                        tdb.innerText = tag[listLowc];
                    };
                    tdt.appendChild(label);
                    tr.appendChild(tdt);
                    if (i != 5 & i != 6 & i != 7) {
                        if (osuDL.songInfo[listLowc] != tag[listLowc]) {
                            let btn = document.createElement('button');
                            btn.id = 'ID3change_' + listLowc;
                            btn.style.marginLeft = "5px";
                            btn.innerText = 'to A';
                            tdb.appendChild(btn);
                        }
                    }
                    tr.appendChild(tdb);
                }
                table.appendChild(tr);
            }
            tb.appendChild(table);
        }
    };

};
/**
 * @class fftDIsplay
 */
const fftDIsplay = {
    /**
     * @author jomin398
     * @param {number} szL soundSizeLv for set bar Height.
     * @description Audio FFT(spectrum) Visualizer init function for dom.
     */
    init: function (szL) {
        audioFftDisp = document.createElement('div');
        audioFftDisp.className = 'audioFftDisp';
        audioFftCanvas = document.createElement('canvas');
        audioFftCanvas.id = 'canvas';
        audioFftDisp.appendChild(audioFftCanvas);
        audioFftinfo = document.createElement('span');
        audioFftinfo.id = 'audioFftinfo';
        audioFftinfo.innerText = isKor?'음향 FFT(스팩트럼) 뷰어':'Audio FFT(spectrum) Visualizer. ';
        link = document.createElement('a');
        let i = document.createElement('i');
        i.className = "fas fa-info-circle";
        
        link.href = 'https://en.wikipedia.org/wiki/Music_visualization';
        link.target='_blank';
        link.style.textDecoration = 'none';
        t = document.createTextNode(isKor?' 음향 시각화 중 하나입니다.':' This is one type of Music visualization')
        link.append(i,t);
        audioFftDisp.append(audioFftinfo,link);
        document.querySelector('.player').insertAdjacentElement('beforebegin', audioFftDisp);

    },
    /**
     * @author Nick Jones
     * @see JS Audio Visualizer https://codepen.io/nfj525/pen/rVBaab
     * @param {number} szL soundSizeLv for set bar Height.
     */
    onReady: function (szL) {
        document.querySelector('.audioFftDisp a').style.display = 'block';
        const audio = document.querySelector('body > div.player > div > div.bottom > audio'),
            context = new AudioContext(),
            src = context.createMediaElementSource(audio),
            analyser = context.createAnalyser(),
            canvas = document.getElementById("canvas");

        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        var ctx = canvas.getContext("2d");

        src.connect(analyser);
        analyser.connect(context.destination);

        analyser.fftSize = 256;

        var bufferLength = analyser.frequencyBinCount;
        console.log(bufferLength);

        var dataArray = new Uint8Array(bufferLength);

        var WIDTH = canvas.width;
        var HEIGHT = canvas.height;
        var barWidth = (WIDTH / bufferLength);
        var barHeight;
        var x = 0;

        function renderFrame() {
            requestAnimationFrame(renderFrame);

            x = 0;

            analyser.getByteFrequencyData(dataArray);

            ctx.fillStyle = "#000";
            ctx.fillRect(0, 0, WIDTH, HEIGHT);
            szL = szL ? szL : 2.5;
            for (var i = 0; i < bufferLength; i++) {
                barHeight = dataArray[i] * szL;

                var r = barHeight + (25 * (i / bufferLength));
                var g = 250 * (i / bufferLength);
                var b = 50;

                ctx.fillStyle = "rgb(" + r + "," + g + "," + b + ")";
                ctx.fillRect(x, HEIGHT - barHeight, barWidth, barHeight);

                x += barWidth + 1;
            }
        }
        renderFrame();
    }
}