var mConsole = (function () {
    var html = [
        '<style>',
        '#bsConsole{position:fixed;z-index:9;background:#eee;bottom:0;left:0;right:0;height:200px;display: grid;}',
        '#bsConsoleTab{background:#ccc;height:20px}',
        '#bsConsoleTabConsole,#bsConsoleTabElement{font-size:11px;margin:2px 5px;padding:0 5px;float:left;border:1px solid #666}',
        '#bsConsoleView{font-size:10px;overflow-y:scroll;height:180px}',
        '#bsConsoleViewElement{word-break:break-all;word-wrap:break-word}',
        '.bsConsoleItem{font-size:11px;border:1px solid #000;padding:5px;margin:5px;float:left}',
        '#log_timeStamp{padding-left:5px}',
        '</style>',
        '<div id="bsConsole">',
        '<div id="bsConsoleTab">',
        '<div id="bsConsoleTabConsole">Console</div><div id="bsConsoleTabElement">Element</div>',
        '</div>',
        '<div id="bsConsoleView">',
        '<div id="bsConsoleViewConsole"></div><div id="bsConsoleViewElement" style="display:none"></div>',
        '</div>',
        '</div>'],
        temp = document.createElement('div'),
        init = function () {
            if (document.getElementById('bsConsole')) return;
            temp.innerHTML = html.join('');
            document.body.appendChild(temp.childNodes[0]);
            document.body.appendChild(temp.childNodes[0]);
            document.getElementById('bsConsole').onclick = function (e) {
                switch (e.target.id) {
                    case 'bsConsoleTab':
                        e.target.style.height = e.target.style.height == '200px' ? '20px' : '200px';
                        break;
                    case 'bsConsoleTabElement':
                        document.getElementById('bsConsoleViewConsole').style.display = 'none';
                        document.getElementById('bsConsoleViewElement').style.display = 'block';
                        document.getElementById('bsConsoleViewElement').innerHTML = '<pre>' +
                            ('<html>\n' + document.getElementsByTagName('html')[0].innerHTML + '\n</html>').replace(/[<]/g, '&lt;') +
                            '</pre>';
                        break;
                    case 'bsConsoleTabConsole':
                        document.getElementById('bsConsoleViewConsole').style.display = 'block';
                        document.getElementById('bsConsoleViewElement').style.display = 'none';
                }
            }
        };
    return {
        log: function () {
            var a = arguments, i = 0, j = a.length, item, v;
            init();
            document.getElementById('bsConsole').style.display = "none";
            item = ['<div style="clear:both">','<span id="log_timeStamp">'+new Date().toLocaleString()+'</span><br>'];
            while (i < j) {
                v = a[i++];
                if (v && typeof v == 'object') v = JSON.stringify(v);
                item.push('<div class="bsConsoleItem">' +v + '</div>');
            }
            item.push('</div>');
            temp.innerHTML = item.join('');
            console.log.apply(console,arguments);
            document.getElementById('bsConsoleViewConsole').append(temp.childNodes[0]);
        }
    };
})();