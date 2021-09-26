const osuDL = {
    songInfo: {
        title: null,
        artist: null,
        source: '',
        setID: null,
    },
    path: null,
    doc: null,
    reqUrl: null,
    zip: null,
    baseElem: null,
    done: null,
    init: function (setID, cbf) {
        const regexps = [/"([^"]*)"/, /\.$/, /feat\.? ?(.*)$/gm];
        console.log('dl init');
        this.baseElem = document.getElementsByClassName('BeatmapSearching_options-container')[0];
        this.baseElem.remove();
        document.getElementById('sdsBtnw').remove();
        document.getElementById('sdp').remove();
        let moreViewWrapper = document.getElementById('moreViewWrapper');
        if (moreViewWrapper) { moreViewWrapper.remove() };
        if (cbf) {
            this.done = cbf;
        }
        this.songInfo.setID = setID;

        //parsing selected setID info....
        let table = isKor?['식별 ID','아티스트','곡명','소스/출처']:['SetId','Artist','Title','Source'];

        this.doc = DB.user.search.data[DB.user.search.data.findIndex(e=>e[table[0]] ==this.songInfo.setID)];
        let artist = this.doc[table[1]];
        artist = regexps[2].test(artist) ? artist.match(regexps[2], '$1')[0] : artist
        artist= artist.replace(regexps[1],'').trim();
        this.songInfo.artist = artist;
        
        this.songInfo.title =this.doc[table[2]].replace(regexps[1],'').trim();
        this.songInfo.source = this.doc[table[3]];
        bs = '';
        if (this.songInfo.source!='') {
            this.songInfo.source = "『" + this.songInfo.source.replace(regexps[0], '$1') + "』";
            bs = ' ';
        }
        this.songInfo.fileName = this.songInfo.title + " [" + this.songInfo.artist + "]" + bs + this.songInfo.source + ".mp3";
        this.reqUrl = 'https://api.chimu.moe/v1/download/' + this.songInfo.setID + '?n=0';
        console.log(this);
        el = document.createElement('div');
        el.className = 'BeatmapSearching_options-container';
        bmapLink = document.createElement('a');
        bmapLink.innerText = isKor ? LocalTextDB[0].BmapDL[0][0] : 'Beatmap Download Link';
        bmapLink.href = this.reqUrl;
        bmapLink.style.textDecoration = 'none';
        bmapLink.style.color = '#ff8686';
        el.append(bmapLink);
        document.getElementById('displayInfo').insertAdjacentElement('afterend', el);
        displayJSON({ songInfo: osuDL.songInfo, reqUrl: osuDL.reqUrl }); //{collapsed: true}
        this.add();

    },
    noimg: function () {
        //if no image of background.
        let img = document.body.querySelector('.player .left img');
        if (img) {
            img.remove();
        } else {
            img = document.body.querySelector('.player .left div#noimg');
            if (img) {
                img.remove();
            }
        }
        img = document.createElement('div');
        img.id = 'noimg';
        img.style.backgroundColor = 'transparent';
        vi = document.createElement('div');
        vi.className = 'record';
        vi.style.animation = '1.2s top-to-bottom';
        img.append(vi)
        document.body.querySelector('.player .left').append(img);
        document.body.querySelector('.player .right .bottom audio').addEventListener('play', () => {
            document.body.querySelector('#noimg .record').style.animation = null;
            document.body.querySelector('#noimg .record').classList.add('on');
        });
        document.body.querySelector('.player .right .bottom audio').addEventListener('pause', () => {
            document.body.querySelector('#noimg .record').classList.remove('on');
        })

        //img.alt = isKor ? LocalTextDB[0].BmapDL[2][0] :'No Bk (vinyl image will setted)';
    },
    add: function () {
        displayInfo("osuDL: " + (isKor ? LocalTextDB[0].BmapDL[1][0] : "Promissing Osz file.. 1/2"));
        const baseElem = document.getElementsByClassName('BeatmapSearching_options-container')[0];
        // 1) fetch the Osz url
        var self = this;
        let req = (res) => {
            if (res.status === 200 || res.status === 0) {
                displayInfo("osuDL: " + (isKor ? LocalTextDB[0].BmapDL[1][1] : "Promissing Osz file... 2/2"));
                // 3) fetch the zip as Osz file
                fetch(res.url.replace(/\.osz/gm, '.zip'))
                    .then(function (response) {
                        displayInfo("osuDL: " + (isKor ? LocalTextDB[0].BmapDL[1][2] : "reading Osz file..."));
                        // 4) return the zip file contents
                        return Promise.resolve(response.blob());
                    })
                    // 5) read zip file with the zip promise
                    .then(JSZip.loadAsync)
                    // 6) parse zip file then get mp3 file.                       
                    .then(function (zip) {
                        displayInfo("osuDL: " + (isKor ? LocalTextDB[0].BmapDL[1][3] : "Parsing Osz file..."));
                        console.log(zip.files);
                        osuDL.zip = zip.files;
                        //find file mp3 of beatmap audio.
                        let mp3Filter = w => w.match(/\.mp3$/gm);
                        let mp3 = Object.keys(zip.files).filter((t) => mp3Filter(t))[0];
                        if (!mp3) {
                            return Promise.reject(new Error('No AUDIO'));
                        }
                        //find .jpg/png file of beatmap background.
                        let picFilter = w => w.match(/\.(jpg|png|jpeg)$/gm);
                        let isBk = w => /b(ackground|k|g)/gm.test(w);
                        let selBk = w => w.filter(y => isBk(y));
                        let pics = Object.keys(zip.files).filter((t) => picFilter(t));
                        pics = isBk(pics) ? selBk(pics) : pics;
                        let pic = pics[0];
                        let list = new Array();
                        list.push(mp3);
                        if (pic) {
                            list.push(pic);
                        }
                        displayInfo("osuDL: " + (isKor ? LocalTextDB[0].BmapDL[1][4] : "Generate... link"));
                        bmapLink = document.createElement('a');
                        bmapLink.innerText = isKor ? LocalTextDB[0].BmapDL[0][1] : 'audio Download Link';
                        bmapLink.href = '#';
                        bmapLink.style.textDecoration = 'none';
                        bmapLink.style.color = '#ff8686';
                        baseElem.append(bmapLink);

                        audioInfo = document.createElement('p');
                        audioInfo.innerText = isKor ? LocalTextDB[0].BmapDL[0][2] : "Listenable full version of song. at the bottom of site! (depend on beatmap's length)";
                        audioInfo.id = 'title';
                        baseElem.append(audioInfo);

                        list.forEach((u, i) => {
                            if (i == 0) {
                                basebottom = document.createElement('div');
                                basebottom.className = 'player';
                                let arr = ["left", "right"];
                                arr.forEach((el, j) => {
                                    let ele = null;
                                    if (j == 0) {
                                        ele = document.createElement('a');
                                        ele.className = el;
                                        let img = document.createElement('img');
                                        img.alt = 'preview';
                                        ele.appendChild(img);
                                    } else {
                                        ele = document.createElement('div');
                                        ele.className = el;
                                        let top = document.createElement('div');
                                        top.className = 'top';
                                        let tit = document.createElement('a');
                                        tit.className = 'title';
                                        tit.innerText = osuDL.songInfo.title;
                                        let art = document.createElement('a');
                                        art.className = 'artist';
                                        art.innerText = osuDL.songInfo.artist;
                                        top.append(tit, document.createElement('br'), art);
                                        if (osuDL.songInfo.source) {
                                            let source = document.createElement('a');
                                            source.className = 'source';
                                            source.innerText = osuDL.songInfo.source.trim();
                                            top.append(document.createElement('br'), source);
                                        }

                                        let bott = document.createElement('div');
                                        bott.className = 'bottom';
                                        let aud = document.createElement('audio');
                                        aud.controls = true;
                                        aud.controlsList = "nodownload";
                                        bott.appendChild(aud);
                                        ele.append(top, bott);
                                    }
                                    basebottom.appendChild(ele);
                                });
                                zip.file(u).async('blob').then(f => {
                                    let l = window.URL.createObjectURL(f);
                                    let aud = document.body.querySelector('.player .right .bottom');
                                    aud.download = self.songInfo.fileName;
                                    aud.href = l;
                                    document.body.querySelector('a:nth-child(2)').href = l;
                                    document.body.querySelector('a:nth-child(2)').download = self.songInfo.fileName;

                                    fftDIsplay.init('audio','.player');

                                    noti(baseElem.getElementsByTagName('a')[1]);
                                    let time = setTimeout(() => {
                                        clearTimeout(time);
                                        noti(baseElem.querySelector('p#title'));
                                        noti(document.body.querySelector('.player'));
                                        //autoscroll;                          
                                        $(document).scrollTop($(document).height());
                                    }, 3100);
                                    aud.querySelector('audio').src = l;
                                    fftDIsplay.onReady();
                                    //addReverb();
                                    if (list.length != 2) {
                                        self.noimg();
                                    }
                                    displayInfo("osuDL: " + (isKor ? LocalTextDB[0].BmapDL[1][5] : "Ready to Download or play song!"));
                                    if (self.done) {
                                        self.done(l);
                                    }
                                });
                                document.body.appendChild(basebottom);
                            } else if (i == 1) {

                                teg = document.createElement('a');
                                teg.id = 'bk';
                                let img = document.createElement('img');
                                img.style.width = '80%';
                                img.style.margin = 'auto';
                                teg.alt = 'BeatMap BackGround Image';
                                teg.style.textAlign = 'center';
                                teg.appendChild(img);
                                teg.style.margin = 'auto';

                                zip.file(u).async('blob').then(f => {

                                    baseElem.querySelector('a#bk').download = [
                                        "[", self.songInfo.setID, "] ", self.songInfo.title, ".jpg"
                                    ].join('');
                                    let u = window.URL.createObjectURL(f);
                                    document.body.querySelector('.player .left img').src = u;
                                    baseElem.querySelector('a#bk img').src = u;
                                    baseElem.querySelector('a#bk').href = u;
                                });
                                baseElem.append(document.createElement('br'));
                                baseElem.append(teg);
                            }

                        });
                        //audio Fft(spectrum) Display 
                        
                    }).then(null, function error(e) {
                        displayInfo("osuDL: reading Osz Error : " + e);
                    });
            }
        }
        fetch(this.reqUrl).then(res => {
            // 2) filter on 200 OK
            if (res.status === 200 || res.status === 0) {
                req(res);
            } else {
                displayInfo("osuDL: " + JSON.stringify(new Error(res.statusText)));
                this.reqUrl = 'https://chimu.moe/d/' + this.reqUrl.split('download\/')[1];
                fetch(this.reqUrl).then(res => {
                    // 2) final try
                    if (res.status === 200 || res.status === 0) {
                        req(res);
                    } else {
                        displayInfo("osuDL Final: " + JSON.stringify(new Error(res.statusText)));
                    }
                })
            }
        })
    }
};