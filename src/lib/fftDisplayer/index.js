var audioSourceNode = null;
var audioCtx = null;
/**
 * @class fftDIsplay
 */
 const fftDIsplay = {
    mode:0,
    eleTargets: [],
    /**
     * @author jomin398
     * @param {string} audioEle
     * @description Audio FFT(spectrum) Visualizer init function for dom.
     */
    init: function (audioEle,displayEle,mode) {
        isKorean = navigator.language == 'ko-KR';
        audioFftDisp = document.createElement('div');
        audioFftDisp.className = 'audioFftDisp';
        audioFftCanvas = document.createElement('canvas');
        audioFftCanvas.id = 'canvas';
        audioFftDisp.appendChild(audioFftCanvas);
        audioFftinfo = document.createElement('span');
        audioFftinfo.id = 'audioFftinfo';
        audioFftinfo.innerText = isKorean ? '음향 FFT(스팩트럼) 뷰어' : 'Audio FFT(spectrum) Visualizer. ';
        link = document.createElement('a');
        let i = document.createElement('i');
        i.className = "fas fa-info-circle";

        link.href = 'https://en.wikipedia.org/wiki/Music_visualization';
        link.target = '_blank';
        link.style.textDecoration = 'none';
        t = document.createTextNode(isKorean ? '음향 시각화 중 하나입니다.' : 'This is one type of Music visualization')
        link.append(i, t);
        audioFftDisp.append(audioFftinfo, link);
        this.eleTargets.push(audioEle);
        if(!displayEle){
            displayEle = audioEle;
        }
        document.querySelector(displayEle).insertAdjacentElement('beforebegin', audioFftDisp);
        this.mode = mode?mode:0;
        audioCtx = null;
    },
    onReady: function () {
        document.querySelector('.audioFftDisp a').style.display = 'block';
        const audio = document.querySelector(this.eleTargets[0]);
        audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        const audioSrc = audioCtx.createMediaElementSource(audio),
            analyser = audioCtx.createAnalyser(),
            canvas = document.getElementById("canvas");
            audioSourceNode = audioSrc;
        //get self;
        var self = this;
        var szL = self.szL;
        // Bind our analyser to the media element source.
        audioSrc.connect(analyser);
        analyser.connect(audioCtx.destination);

        //Get canvas context
        var ctx = canvas.getContext("2d");
        //set canvas
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;


        var frequencyData = null;
        var bufferLength = null;
        var fDataLength = 0;
        var WIDTH = 0, HEIGHT = 0;
        console.log(self.mode);
        if (!self.mode) {
            analyser.fftSize = 256;
            bufferLength = analyser.frequencyBinCount;
        } else if (self.mode == 1) {
            //(400 = max frequency)
            bufferLength = 400;

            //Use below to show all frequencies
            //var frequencyData = new Uint8Array(analyser.frequencyBinCount);

            //High dpi stuff
            canvas.width = parseInt(canvas.width) * 2;
            canvas.height = parseInt(canvas.height) * 2;

            //Set stroke color
            ctx.strokeStyle = "#ffff00"

            //Draw twice as thick lines due to high dpi scaling
            ctx.lineWidth = 2;
        };

        console.log(bufferLength);
        //Get frequency data
        frequencyData = new Uint8Array(bufferLength);
        fDataLength = frequencyData.length;
        var WIDTH = canvas.width;
        var HEIGHT = canvas.height;
        var barWidth = (WIDTH / bufferLength);
        var barHeight;
        var x = 0;
        //Our drawing method
        function renderFrame() {
            requestAnimationFrame(renderFrame);
            x = 0;
            // Copy frequency data to frequencyData array.
            analyser.getByteFrequencyData(frequencyData);
            if (self.mode == 1) {
                //Draw the wave
                ctx.clearRect(0, 0, WIDTH, HEIGHT);
                for (var i = 1; i < fDataLength; i++) {
                    var x1 = WIDTH / (fDataLength - 1) * (i - 1);
                    var x2 = WIDTH / (fDataLength - 1) * i;
                    var y1 = HEIGHT - frequencyData[i - 1] / 255 * HEIGHT;
                    var y2 = HEIGHT - frequencyData[i] / 255 * HEIGHT;
                    if (x1 && y1 && x2 && y2) {
                        ctx.beginPath();
                        ctx.moveTo(x1, y1);
                        ctx.lineTo(x2, y2);
                        ctx.stroke();
                    }
                }
            } else {
                ctx.fillStyle = "#000";
                ctx.fillRect(0, 0, WIDTH, HEIGHT);
                szL = szL ? szL : 2.5;
                for (var i = 0; i < bufferLength; i++) {
                    barHeight = frequencyData[i] * szL;

                    var r = barHeight + (25 * (i / bufferLength));
                    var g = 250 * (i / bufferLength);
                    var b = 50;

                    ctx.fillStyle = "rgb(" + r + "," + g + "," + b + ")";
                    ctx.fillRect(x, HEIGHT - barHeight, barWidth, barHeight);

                    x += barWidth + 1;
                }
            }
        }
        renderFrame();
    }
}