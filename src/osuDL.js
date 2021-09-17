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
    init: function (setID) {
        const regex = /"([^"]*)"/;
        console.log('dl init');
        this.baseElem = document.getElementsByClassName('BeatmapSearching_options-container')[0];
        this.baseElem.remove();
        document.getElementById('sdsBtnw').remove();
        document.getElementById('sdp').remove();
        this.songInfo.setID = setID;

        //parsing selected setID info....
        this.doc = $('.json-array li:contains(' + this.songInfo.setID + ')')[0];

        this.songInfo.artist = this.doc.querySelector('li:nth-child(6) span').innerText.replace(regex, '$1');
        this.songInfo.title = this.doc.querySelector('li:nth-child(7) span').innerText.replace(regex, '$1');
        let source = this.doc.querySelector('li:nth-child(9) span').innerText;
        this.songInfo.source = "";
        if (source != "\"\"") {
            this.songInfo.source = " 『" + source.replace(regex, '$1') + "』";
        }
        this.songInfo.fileName = "[" + this.songInfo.artist + "] " + this.songInfo.title + this.songInfo.source + ".mp3";
        this.reqUrl = 'https://api.chimu.moe/v1/download/' + this.songInfo.setID + '?n=0';
        console.log(this);
        el = document.createElement('div');
        el.className = 'BeatmapSearching_options-container';
        bmapLink = document.createElement('a');
        bmapLink.innerText = isKor?LocalTextDB[0].BmapDL[0][0]:'Beatmap Download Link';
        bmapLink.href = this.reqUrl;
        bmapLink.style.textDecoration = 'none';
        bmapLink.style.color = '#ff8686';
        el.append(bmapLink);
        document.getElementById('displayInfo').insertAdjacentElement('afterend', el);
        this.add();
    },
    add: function () {
        const noti = function(t){
           
                t.style.border = '2px solid red';
                t.style.animation = '1s linear infinite condemned_blink_effect';
            setTimeout(() => {
                t.style.border = null;
                t.style.animation = null;
            }, 2000);
            
        }
        displayInfo("osuDL: "+(isKor?LocalTextDB[0].BmapDL[1][0]: "Promissing Osz file.. 1/2"));
        const baseElem = document.getElementsByClassName('BeatmapSearching_options-container')[0];
        // 1) fetch the Osz url
        fetch(this.reqUrl).then(res => {
            // 2) filter on 200 OK
            if (res.status === 200 || res.status === 0) {
                displayInfo("osuDL: "+(isKor?LocalTextDB[0].BmapDL[1][1]:"Promissing Osz file... 2/2"));
                // 3) fetch the zip as Osz file
                fetch(res.url.replace(/\.osz$/gm, '.zip'))
                    .then(function (response) {
                        displayInfo("osuDL: "+(isKor?LocalTextDB[0].BmapDL[1][2]:"reading Osz file..."));
                        // 4) return the zip file contents
                        return Promise.resolve(response.blob());
                    })
                    // 5) read zip file with the zip promise
                    .then(JSZip.loadAsync)
                    // 6) parse zip file then get mp3 file.                       
                    .then(function (zip) {
                        displayInfo("osuDL: "+(isKor?LocalTextDB[0].BmapDL[1][3]:"Parsing Osz file..."));
                        console.log(zip.files)

                        //find file mp3 of beatmap audio.
                        let mp3Filter = w => w.match(/\.mp3$/gm);
                        let mp3 = Object.keys(zip.files).filter((t) => mp3Filter(t))[0];
                        if (!mp3) {
                            return Promise.reject(new Error('No AUDIO'));
                        }
                        //find .jpg/png file of beatmap background.
                        let picFilter = w => w.match(/\.(jpg|png|jpeg)$/gm);
                        let pic = Object.keys(zip.files).filter((t) => picFilter(t))[0];
                        let list = new Array();
                        list.push(mp3);
                        if (pic) {
                            list.push(pic);
                        }
                        displayInfo("osuDL: "+(isKor?LocalTextDB[0].BmapDL[1][4]:"Generate... link"));
                        bmapLink = document.createElement('a');
                        bmapLink.innerText = isKor?LocalTextDB[0].BmapDL[0][1]:'audio Download Link';
                        bmapLink.href = '#';
                        bmapLink.style.textDecoration = 'none';
                        bmapLink.style.color = '#ff8686';
                        baseElem.append(bmapLink);

                        audioInfo = document.createElement('p');
                        audioInfo.innerText = isKor?LocalTextDB[0].BmapDL[0][2]:"Listenable full version of song. (depend on beatmap's length)";
                        audioInfo.id = 'title';
                        baseElem.append(audioInfo);
                        list.forEach((u, i) => {
                            let teg = document.createElement('br');
                            if (i == 0) {
                                teg = document.createElement('audio');
                                teg.controls = true;
                                zip.file(u).async('blob').then(f => {
                                    let l =  window.URL.createObjectURL(f);
                                    baseElem.getElementsByTagName('a')[1].download=osuDL.songInfo.fileName;
                                    baseElem.getElementsByTagName('a')[1].href = l;
                                    noti(baseElem.getElementsByTagName('a')[1]);
                                    baseElem.getElementsByTagName('audio')[0].src = l;
                                    displayInfo("osuDL: "+(isKor?LocalTextDB[0].BmapDL[1][5]:"Ready to Download or play song!"));
                                    
                                });
                            } else if (i == 1) {
                                teg = document.createElement('img');
                                teg.style.width = '80%';
                                teg.alt = u;
                                zip.file(u).async('blob').then(f=>{
                                    baseElem.getElementsByTagName('img')[0].src = window.URL.createObjectURL(f);
                                });
                                baseElem.append(document.createElement('br'));
                            }
                            baseElem.append(teg)
                        })
                    })
            } else {
                displayInfo("osuDL: " + JSON.stringify(new Error(res.statusText)));
            }
        })
    }
};
// function downloadInit(){
//     console.log('dl init')
//     $('.json-array li:contains("287453")')[0]
// }