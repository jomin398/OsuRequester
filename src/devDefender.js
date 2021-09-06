const DevDeffender = (function () {
    const Setups = { detect: 'dev', every: 1000, Protection: true, timer: null };
    let isMobile = window.orientation > -1;
    function devToolsOpened(e) {
        if (Setups.Protection) {
            alert("dev mode is blocked!")
            setTimeout(() => {
                window.location.assign('http://www.example.com'); //auto redirect for Prevent Hack.
            }, 2000);
            // uncomment to prevent opening dev.tools:
            e.preventDefault();
        } else {
            window.removeEventListener("keydown", Setups.fn);
            if (Setups.timer) { clearInterval(Setups.timer) };
            alert("happy coding!");
            mConsole.log('happy coding');
            if(isMobile){
                document.getElementById('bsConsole').style.display = "block";
            }
        }
    }
    function devDefender(e) {
        if (
            // CMD + Alt + I (Chrome, Firefox, Safari)
            e.metaKey == true && e.altKey == true && e.keyCode == 73 ||
            // CMD + Alt + J (Chrome)
            e.metaKey == true && e.altKey == true && e.keyCode == 74 ||
            // CMD + Alt + C (Chrome)
            e.metaKey == true && e.altKey == true && e.keyCode == 67 ||
            // CMD + Shift + C (Chrome)
            e.metaKey == true && e.shiftKey == true && e.keyCode == 67 ||
            // Ctrl + Shift + I (Chrome, Firefox, Safari, Edge)
            e.ctrlKey == true && e.shiftKey == true && e.keyCode == 73 ||
            // Ctrl + Shift + J (Chrome, Edge)
            e.ctrlKey == true && e.shiftKey == true && e.keyCode == 74 ||
            // Ctrl + Shift + C (Chrome, Edge)
            e.ctrlKey == true && e.shiftKey == true && e.keyCode == 67 ||
            // F12 (Chome, Firefox, Edge)
            e.keyCode == 123 ||
            // CMD + Alt + U, Ctrl + U (View source: Chrome, Firefox, Safari, Edge)
            e.metaKey == true && e.altKey == true && e.keyCode == 85 ||
            e.ctrlKey == true && e.keyCode == 85
        ) {
            devToolsOpened(e);
        }
    }

    function on() {
        Setups.fn = (e) => devDefender(e);
        window.addEventListener('keydown', Setups.fn);
        mConsole.log('defender on');

        Setups.timer = setInterval(() => {
            if (document.querySelector('#search input')) {
                if (document.querySelector('#search input').value == Setups.detect) {
                    document.getElementById('title').addEventListener('click', (e) => {
                        Setups.Protection = false;
                        mConsole.log('defender off');
                    })
                    clearInterval(Setups.timer);
                }
            }
        }, Setups.every);
    }
    return { on, isRun: (function () { return Setups.Protection })(), Setups };
})()