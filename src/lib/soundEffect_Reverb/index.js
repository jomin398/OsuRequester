var Reverb_mix = 0.5; //0.5;
var Reverb_time = 1.5; //0.01;
var Reverb_decay = 1; //0.01;

function addReverb (){
    const audioContext = audioCtx;
    const inputNode = audioContext.createGain();
    const wetGainNode = audioContext.createGain();
    const dryGainNode = audioContext.createGain();
    const reverbNode = audioContext.createConvolver();
    const outputNode = audioContext.createGain();

    audioSourceNode.connect(inputNode);

    // Dry 소스 노드 연결
    inputNode.connect(dryGainNode);
    dryGainNode.connect(outputNode);
    dryGainNode.gain.value = 1 - Reverb_mix;

    function generateImpulseResponse() {
        const sampleRate = audioContext.sampleRate;
        const length = sampleRate * Reverb_time;
        const impulse = audioContext.createBuffer(2, length, sampleRate);
    
        const leftImpulse = impulse.getChannelData(0);
        const rightImpulse = impulse.getChannelData(1);
    
        for (let i = 0; i < length; i++) {
            leftImpulse[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / length, Reverb_decay);
            rightImpulse[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / length, Reverb_decay);
        }
    
        return impulse;
    }

    // IR을 생성하여 Convolver의 오디오 버퍼에 입력해준다.
    reverbNode.buffer = generateImpulseResponse();

    // Wet 소스 노드 연결
    inputNode.connect(reverbNode);
    reverbNode.connect(wetGainNode);
    wetGainNode.connect(outputNode);
    wetGainNode.gain.vaule = Reverb_mix;

    outputNode.connect(audioContext.destination);
}
