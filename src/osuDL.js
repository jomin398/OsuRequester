const osuDL={
    
    setID:null,
    songInfo:{
        title:null,
        artist:null,
        source:'',
    },
    path:null,
    doc:null,
    reqUrl:null,
    init:function(setID){
        const regex = /"([^"]*)"/;
        console.log('dl init');
        this.setID = setID;

        //parsing selected setID info....
        this.doc = $('.json-array li:contains('+this.setID+')')[0];
        
        this.songInfo.artist =this.doc.querySelector('li:nth-child(6) span').innerText.replace(regex, '$1');
        this.songInfo.title =this.doc.querySelector('li:nth-child(7) span').innerText.replace(regex, '$1');
        let source = this.doc.querySelector('li:nth-child(9) span').innerText
        if( source != ""){
            this.songInfo.source = " ("+source+")";
        }
        this.path = "["+this.songInfo.artist+"] "+this.songInfo.title+this.songInfo.source+".mp3";
        this.reqUrl ='https://api.chimu.moe/v1/download/'+this.setID+'?n=0';
        console.log(this);
    }
};
// function downloadInit(){
//     console.log('dl init')
//     $('.json-array li:contains("287453")')[0]
// }