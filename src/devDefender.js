const DevDefenderSetups = {
    detect: 'dev',
    every: 1000,
    Protection: true,
    timer: null
};
const DevDefender = (function () {
    function disableDef() {
        window.removeEventListener("keydown", DevDefenderSetups.fn);
        if (DevDefenderSetups.timer) { clearInterval(DevDefenderSetups.timer) };
        alert("happy coding!");
        console.log('happy coding');
        document.getElementById('title').onclick = null;
        console.log("ID3 TAG Reader/Writer Disable :" + rootSetup.disableId3);
    }
    function devToolsOpened(e) {
        if (DevDefenderSetups.Protection) {
            alert("dev mode is blocked!")
            setTimeout(() => {
                window.location.assign('http://www.example.com'); //auto redirect for Prevent Hack.
            }, 2000);
            // uncomment to prevent opening dev.tools:
            e.preventDefault();
        } else {
            disableDef()
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
        DevDefenderSetups.fn = (e) => devDefender(e);
        window.addEventListener('keydown', DevDefenderSetups.fn);
        console.log('defender on');

        DevDefenderSetups.timer = setInterval(() => {
            if (document.querySelector('#search input')) {
                if (document.querySelector('#search input').value == DevDefenderSetups.detect) {
                    document.getElementById('title').onclick = (e) => {
                        DevDefenderSetups.Protection = false;
                        console.log('defender off');
                        disableDef();
                    };
                    clearInterval(DevDefenderSetups.timer);
                }
            }
        }, DevDefenderSetups.every);
    }
    return { on, DevDefenderSetups };
})()